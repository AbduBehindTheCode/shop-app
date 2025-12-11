import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  /**
   * Request notification permissions from the user
   */
  static async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4CAF50',
      });
    }

    return true;
  }

  /**
   * Schedule a daily notification at a specific time
   */
  static async scheduleDailyNotification(hour: number, minute: number): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      // Cancel existing daily notifications
      await this.cancelDailyNotification();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🛒 Shopping Reminder',
          body: 'Time to check your shopping list!',
          data: { type: 'daily_reminder' },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling daily notification:', error);
      return null;
    }
  }

  /**
   * Cancel daily notification
   */
  static async cancelDailyNotification(): Promise<void> {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const dailyNotifications = scheduledNotifications.filter(
      (notif) => notif.content.data?.type === 'daily_reminder'
    );

    for (const notif of dailyNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }

  /**
   * Send immediate notification for cart item added
   */
  static async notifyItemAdded(productName: string, quantity: number, unit: string): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✅ Item Added to Cart',
          body: `${productName} (${quantity} ${unit}) added to your cart`,
          data: { type: 'cart_add', productName },
          sound: true,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending cart add notification:', error);
    }
  }

  /**
   * Send immediate notification for cart item updated
   */
  static async notifyItemUpdated(productName: string, quantity: number, unit: string): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✏️ Cart Updated',
          body: `${productName} quantity updated to ${quantity} ${unit}`,
          data: { type: 'cart_update', productName },
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error sending cart update notification:', error);
    }
  }

  /**
   * Send immediate notification for cart item removed
   */
  static async notifyItemRemoved(productName: string): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🗑️ Item Removed',
          body: `${productName} removed from your cart`,
          data: { type: 'cart_remove', productName },
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error sending cart remove notification:', error);
    }
  }

  /**
   * Schedule a notification for a specific sale date and time
   */
  static async scheduleSaleNotification(dateString: string, hour: number = 9, minute: number = 0): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      // Cancel existing sale notifications
      await this.cancelSaleNotification();

      // Parse date and set time
      const saleDate = new Date(dateString);
      saleDate.setHours(hour, minute, 0, 0);

      // Calculate if date is in the past
      const now = new Date();
      if (saleDate < now) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎉 Sale Day Today!',
          body: `Check out today's special offers and deals! Sale starts at ${hour}:${minute.toString().padStart(2, '0')}`,
          data: { type: 'sale_notification', date: dateString },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          year: saleDate.getFullYear(),
          month: saleDate.getMonth() + 1,
          day: saleDate.getDate(),
          hour,
          minute,
        },
      });

      console.log(`Sale notification scheduled for ${saleDate.toLocaleString()}, ID: ${notificationId}`);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling sale notification:', error);
      return null;
    }
  }

  /**
   * Cancel sale notification
   */
  static async cancelSaleNotification(): Promise<void> {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const saleNotifications = scheduledNotifications.filter(
      (notif) => notif.content.data?.type === 'sale_notification'
    );

    for (const notif of saleNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  static async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get all scheduled notifications
   */
  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}
