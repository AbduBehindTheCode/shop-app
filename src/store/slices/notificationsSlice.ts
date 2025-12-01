import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_NOTIFICATION_PREFERENCES, NotificationPreferences } from '../../types/notifications';

interface NotificationsState {
  preferences: NotificationPreferences;
}

const initialState: NotificationsState = {
  preferences: DEFAULT_NOTIFICATION_PREFERENCES,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setDailyNotification: (state, action: PayloadAction<{ enabled: boolean; time?: string }>) => {
      state.preferences.dailyNotificationEnabled = action.payload.enabled;
      if (action.payload.time) {
        state.preferences.dailyNotificationTime = action.payload.time;
      }
    },
    
    setDailyNotificationTime: (state, action: PayloadAction<string>) => {
      state.preferences.dailyNotificationTime = action.payload;
    },
    
    toggleCartAddNotification: (state, action: PayloadAction<boolean>) => {
      state.preferences.cartAddItemEnabled = action.payload;
    },
    
    toggleCartUpdateNotification: (state, action: PayloadAction<boolean>) => {
      state.preferences.cartUpdateItemEnabled = action.payload;
    },
    
    toggleCartRemoveNotification: (state, action: PayloadAction<boolean>) => {
      state.preferences.cartRemoveItemEnabled = action.payload;
    },
    
    toggleSaleNotification: (state, action: PayloadAction<boolean>) => {
      state.preferences.saleAnnouncementEnabled = action.payload;
    },
    
    setSaleDate: (state, action: PayloadAction<string | null>) => {
      state.preferences.saleDate = action.payload;
    },
    
    resetNotificationPreferences: (state) => {
      state.preferences = DEFAULT_NOTIFICATION_PREFERENCES;
    },
  },
});

export const {
  setDailyNotification,
  setDailyNotificationTime,
  toggleCartAddNotification,
  toggleCartUpdateNotification,
  toggleCartRemoveNotification,
  toggleSaleNotification,
  setSaleDate,
  resetNotificationPreferences,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
