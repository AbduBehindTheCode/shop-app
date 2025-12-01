import { DatePickerModal } from '@/components/ui/DatePickerModal';
import { NotificationItem } from '@/components/ui/NotificationItem';
import { TimePickerModal } from '@/components/ui/TimePickerModal';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { NotificationService } from '@/services/notificationService';
import {
    setDailyNotification,
    setDailyNotificationTime,
    setSaleDate,
    toggleCartAddNotification,
    toggleCartRemoveNotification,
    toggleCartUpdateNotification,
    toggleSaleNotification,
} from '@/store/slices/notificationsSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
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

  // Request permissions on mount
  useEffect(() => {
    checkPermissions();
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
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      Alert.alert(
        'Sale Date Set',
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
          <Text style={styles.sectionTitle}>Cart Events</Text>
          <Text style={styles.sectionDescription}>
            Get notified about changes to your shopping cart
          </Text>

          <NotificationItem
            icon="➕"
            title="Item Added"
            description="Notify when a new item is added to cart"
            value={preferences.cartAddItemEnabled}
            onToggle={(value) => dispatch(toggleCartAddNotification(value))}
          />

          <NotificationItem
            icon="✏️"
            title="Item Updated"
            description="Notify when an item quantity is changed"
            value={preferences.cartUpdateItemEnabled}
            onToggle={(value) => dispatch(toggleCartUpdateNotification(value))}
          />

          <NotificationItem
            icon="🗑️"
            title="Item Removed"
            description="Notify when an item is removed from cart"
            value={preferences.cartRemoveItemEnabled}
            onToggle={(value) => dispatch(toggleCartRemoveNotification(value))}
          />
        </View>

        {/* Sales & Promotions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales & Promotions</Text>
          <Text style={styles.sectionDescription}>
            Stay updated on special offers and sales
          </Text>

          <NotificationItem
            icon="🎉"
            title="Sale Announcements"
            description="Get notified when new sales or promotions start"
            value={preferences.saleAnnouncementEnabled}
            onToggle={(value) => dispatch(toggleSaleNotification(value))}
          />

          {preferences.saleAnnouncementEnabled && (
            <View style={styles.saleNotificationCard}>
              <Text style={styles.saleCardTitle}>📅 Upcoming Sale</Text>
              <TouchableOpacity 
                style={styles.saleDateButton}
                onPress={handleSaleDateSelect}
              >
                <Text style={styles.saleDateLabel}>Sale Date</Text>
                <Text style={[
                  styles.saleDateValue,
                  preferences.saleDate && styles.saleDateValueSet
                ]}>
                  {formatDisplayDate(preferences.saleDate)}
                </Text>
              </TouchableOpacity>
              <Text style={styles.saleCardHint}>
                {preferences.saleDate 
                  ? 'Tap to change sale date'
                  : 'Set a date to receive notification on sale day'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TimePickerModal
        visible={showTimePicker}
        time={preferences.dailyNotificationTime}
        onConfirm={handleTimeChange}
        onCancel={() => setShowTimePicker(false)}
      />

      <DatePickerModal
        visible={showDatePicker}
        date={preferences.saleDate}
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backIcon: {
    fontSize: 32,
    color: '#333',
    fontWeight: '300',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  dailyNotificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dailyNotificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyNotificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  dailyNotificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dailyNotificationSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  timePickerButton: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timePickerLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  timePickerValue: {
    fontSize: 17,
    color: '#4CAF50',
    fontWeight: '700',
  },
  saleNotificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  saleCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  saleDateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saleDateLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  saleDateValue: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  saleDateValueSet: {
    color: '#4CAF50',
  },
  saleCardHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
