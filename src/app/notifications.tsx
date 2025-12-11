import { NotificationItem } from '@/components/ui/NotificationItem';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { NotificationService } from '@/services/notificationService';
import { notificationsService } from '@/services/notifications.service';
import {
  setDailyNotification,
  setDailyNotificationTime,
  setSaleDate
} from '@/store/slices/notificationsSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { loadNotificationPreferences, updateCartAddPreference, updateCartRemovePreference, updateCartUpdatePreference } from '@/store/thunks/notificationThunks';
import type { Notification } from '@/types';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function NotificationSettingsScreen() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.notifications.preferences);
  
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showHouseholdNotifications, setShowHouseholdNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Request permissions and load preferences on mount
  useEffect(() => {
    checkPermissions();
    dispatch(loadNotificationPreferences());
  }, []);

  useEffect(() => {
    if (showHouseholdNotifications) {
      loadNotifications();
      loadUnreadCount();
      
      // Auto-refresh every 10 seconds
      const interval = setInterval(() => {
        loadNotifications();
        loadUnreadCount();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [showHouseholdNotifications]);

  // Load unread count on mount (for the main settings view)
  useEffect(() => {
    loadUnreadCount();
  }, []);

  const checkPermissions = async () => {
    const granted = await NotificationService.requestPermissions();
    setPermissionGranted(granted);
    if (!granted) {
      Alert.alert(
        'Notifications Disabled',
        'Please enable notifications in your device settings to receive reminders.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleDailyNotificationToggle = async (enabled: boolean) => {
    if (enabled && !permissionGranted) {
      const granted = await NotificationService.requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in settings to use this feature.',
          [{ text: 'OK' }]
        );
        return;
      }
      setPermissionGranted(true);
    }

    dispatch(setDailyNotification({ enabled }));

    if (enabled) {
      // Schedule daily notification
      const [hour, minute] = preferences.dailyNotificationTime.split(':').map(Number);
      const notificationId = await NotificationService.scheduleDailyNotification(hour, minute);
      
      if (notificationId) {
        Alert.alert(
          'Daily Reminder Set',
          `You'll receive a reminder every day at ${preferences.dailyNotificationTime}`,
          [{ text: 'OK' }]
        );
      }
    } else {
      // Cancel daily notification
      await NotificationService.cancelDailyNotification();
      Alert.alert(
        'Daily Reminder Cancelled',
        'You will no longer receive daily reminders',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTimeChange = async (time: string) => {
    dispatch(setDailyNotificationTime(time));
    setShowTimePicker(false);

    // If daily notifications are enabled, reschedule with new time
    if (preferences.dailyNotificationEnabled) {
      const [hour, minute] = time.split(':').map(Number);
      await NotificationService.scheduleDailyNotification(hour, minute);
      
      Alert.alert(
        'Time Updated',
        `Daily reminder updated to ${time}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleTimePickerOpen = () => {
    if (preferences.dailyNotificationEnabled) {
      setShowTimePicker(true);
    }
  };

  const handleSaleToggle = async (enabled: boolean) => {
    if (enabled && !permissionGranted) {
      const granted = await NotificationService.requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in settings to use this feature.',
          [{ text: 'OK' }]
        );
        return;
      }
      setPermissionGranted(true);
    }

    // dispatch(toggleSaleNotification());

    // if (enabled && preferences.saleAnnouncementDate) {
    //   // Schedule notification if date is already set
    //   await NotificationService.scheduleSaleNotification(
    //     preferences.saleAnnouncementDate,
    //     9,
    //     0
    //   );
    // }
  };

  const handleSaleDateSelect = () => {
    if (preferences.saleAnnouncementEnabled) {
      setShowDatePicker(true);
    }
  };

  const handleDateConfirm = async (dateString: string) => {
    dispatch(setSaleDate(dateString));
    setShowDatePicker(false);
    
    // Schedule notification for sale date at 9:00 AM
    const notificationId = await NotificationService.scheduleSaleNotification(dateString, 9, 0);
    
    if (notificationId) {
      const date = new Date(dateString);
      const displayDate = date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      Alert.alert(
        'Sale Notification Scheduled',
        `You'll receive a notification on ${displayDate} at 9:00 AM about the sale`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Error',
        'Could not schedule sale notification. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const formatDisplayDate = (dateString: string | null): string => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const data = await notificationsService.getNotifications();
      setNotifications(data);
    } catch (error: any) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch (error: any) {
      console.error('Failed to load unread count:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadNotifications(), loadUnreadCount()]);
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error: any) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error: any) {
      console.error('Failed to mark all as read:', error);
      Alert.alert('Error', 'Failed to mark all as read');
    }
  };

  const handleDelete = async (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationsService.deleteNotification(notificationId);
              const deletedNotif = notifications.find(n => n.id === notificationId);
              setNotifications(notifications.filter(n => n.id !== notificationId));
              if (deletedNotif && !deletedNotif.is_read) {
                setUnreadCount(Math.max(0, unreadCount - 1));
              }
            } catch (error: any) {
              console.error('Failed to delete notification:', error);
              Alert.alert('Error', 'Failed to delete notification');
            }
          },
        },
      ]
    );
  };

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'item_added':
        return '➕';
      case 'item_removed':
        return '🗑️';
      case 'item_updated':
        return '✏️';
      default:
        return '📬';
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Household Activity View
  if (showHouseholdNotifications) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowHouseholdNotifications(false)} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Household Activity</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllButton}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {loadingNotifications ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyDescription}>
              You'll see household activity here when members add, remove, or update items in the cart
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.notificationsScrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4CAF50']} />
            }
          >
            {notifications.map((notification) => (
              <Pressable
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.is_read && styles.unreadCard
                ]}
                onPress={() => {
                  if (!notification.is_read) {
                    handleMarkAsRead(notification.id);
                  }
                }}
              >
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationIcon}>
                    {getNotificationIcon(notification.type)}
                  </Text>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationTitleRow}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      {!notification.is_read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <Text style={styles.notificationTime}>
                      {formatTimeAgo(notification.created_at)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(notification.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteIcon}>×</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }

  // Main Settings View
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Notification Settings</Text>
        </View>

        {/* Household Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Household Activity</Text>
          <Text style={styles.sectionDescription}>
            View notifications from household members
          </Text>

          <TouchableOpacity 
            style={styles.householdActivityCard}
            onPress={() => setShowHouseholdNotifications(true)}
          >
            <View style={styles.householdActivityHeader}>
              <Text style={styles.householdActivityIcon}>📬</Text>
              <View style={styles.householdActivityInfo}>
                <Text style={styles.householdActivityTitle}>View Activity Feed</Text>
                <Text style={styles.householdActivitySubtitle}>
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'No new notifications'}
                </Text>
              </View>
              <Text style={styles.chevronIcon}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Daily Notification Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Reminder</Text>
          <Text style={styles.sectionDescription}>
            Get a daily reminder to check your shopping list
          </Text>

          <View style={styles.dailyNotificationCard}>
            <View style={styles.dailyNotificationHeader}>
              <View style={styles.dailyNotificationInfo}>
                <Text style={styles.dailyNotificationTitle}>Daily Notification</Text>
                <Text style={styles.dailyNotificationSubtitle}>
                  {preferences.dailyNotificationEnabled
                    ? `Every day at ${preferences.dailyNotificationTime}`
                    : 'Disabled'}
                </Text>
              </View>
              <ToggleSwitch
                value={preferences.dailyNotificationEnabled}
                onValueChange={handleDailyNotificationToggle}
              />
            </View>

            {preferences.dailyNotificationEnabled && (
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={handleTimePickerOpen}
              >
                <Text style={styles.timePickerLabel}>Notification Time</Text>
                <Text style={styles.timePickerValue}>{preferences.dailyNotificationTime}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Cart Events Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cart Event Preferences</Text>
          <Text style={styles.sectionDescription}>
            Choose which cart notifications you want to receive
          </Text>

          <NotificationItem
            icon="➕"
            title="Item Added"
            description="Notify when a new item is added to cart"
            value={preferences.cartAddItemEnabled}
            onToggle={(value) => dispatch(updateCartAddPreference(value))}
          />

          <NotificationItem
            icon="✏️"
            title="Item Updated"
            description="Notify when an item quantity is changed"
            value={preferences.cartUpdateItemEnabled}
            onToggle={(value) => dispatch(updateCartUpdatePreference(value))}
          />

          <NotificationItem
            icon="🗑️"
            title="Item Removed"
            description="Notify when an item is removed from cart"
            value={preferences.cartRemoveItemEnabled}
            onToggle={(value) => dispatch(updateCartRemovePreference(value))}
          />
        </View>

        {/* Sales Announcement Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Announcements</Text>
          <Text style={styles.sectionDescription}>
            Get notified when sales start at your favorite stores
          </Text>

          <View style={styles.saleCard}>
            <View style={styles.saleCardHeader}>
              <View style={styles.saleCardInfo}>
                <Text style={styles.saleCardTitle}>Sale Notifications</Text>
                <Text style={styles.saleCardSubtitle}>
                  {/* {preferences.saleAnnouncementEnabled
                    ? `Scheduled for ${formatDisplayDate(preferences.saleAnnouncementDate)}`
                    : 'Disabled'} */}
                </Text>
              </View>
              <ToggleSwitch
                value={preferences.saleAnnouncementEnabled}
                onValueChange={handleSaleToggle}
              />
            </View>

            {preferences.saleAnnouncementEnabled && (
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={handleSaleDateSelect}
              >
                <Text style={styles.datePickerLabel}>Sale Start Date</Text>
                <Text style={styles.datePickerValue}>
                  {/* {formatDisplayDate(preferences.saleAnnouncementDate)} */}
                </Text>
              </TouchableOpacity>
            )}

            <Text style={styles.saleCardHint}>
              You'll receive a notification at 9:00 AM on the selected date
            </Text>
          </View>
        </View>

        {/* Modals */}
        {/* <TimePickerModal
          visible={showTimePicker}
          initialTime={preferences.dailyNotificationTime}
          onClose={() => setShowTimePicker(false)}
          onConfirm={handleTimeChange}
        /> */}

        {/* <DatePickerModal
          visible={showDatePicker}
          initialDate={preferences.saleAnnouncementDate || undefined}
          onClose={() => setShowDatePicker(false)}
          onConfirm={handleDateConfirm}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  notificationsScrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 32,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  householdActivityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  householdActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  householdActivityIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  householdActivityInfo: {
    flex: 1,
  },
  householdActivityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  householdActivitySubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  chevronIcon: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  dailyNotificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dailyNotificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyNotificationInfo: {
    flex: 1,
  },
  dailyNotificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  dailyNotificationSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  timePickerButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timePickerLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  timePickerValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  saleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  saleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saleCardInfo: {
    flex: 1,
  },
  saleCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  saleCardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  datePickerButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  datePickerValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  saleCardHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 28,
    color: '#EF4444',
    fontWeight: 'bold',
  },
});
