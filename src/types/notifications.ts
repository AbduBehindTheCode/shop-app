export interface NotificationPreferences {
  // Daily notification
  dailyNotificationEnabled: boolean;
  dailyNotificationTime: string; // Format: "HH:MM" (24-hour)
  
  // Cart event notifications
  cartAddItemEnabled: boolean;
  cartUpdateItemEnabled: boolean;
  cartRemoveItemEnabled: boolean;
  
  // Sale notifications
  saleAnnouncementEnabled: boolean;
  saleDate: string | null; // Format: "YYYY-MM-DD"
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  dailyNotificationEnabled: false,
  dailyNotificationTime: '17:00',
  cartAddItemEnabled: true,
  cartUpdateItemEnabled: false,
  cartRemoveItemEnabled: false,
  saleAnnouncementEnabled: true,
  saleDate: null,
};
