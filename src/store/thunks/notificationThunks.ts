// Notification Thunks
// Async actions for notification preferences

import { notificationPreferencesService } from '@/services/notificationPreferences.service';
import {
    setError,
    setLoading,
    toggleCartAddNotification,
    toggleCartRemoveNotification,
    toggleCartUpdateNotification
} from '../slices/notificationsSlice';
import { AppDispatch } from '../store';

/**
 * Load notification preferences from backend on app start
 */
export const loadNotificationPreferences = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const preferences = await notificationPreferencesService.getPreferences();
    
    // Update Redux state with backend preferences
    dispatch(toggleCartAddNotification(preferences.cart_add_enabled));
    dispatch(toggleCartUpdateNotification(preferences.cart_update_enabled));
    dispatch(toggleCartRemoveNotification(preferences.cart_remove_enabled));
    
    dispatch(setLoading(false));
  } catch (error: any) {
    console.error('Load notification preferences error:', error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

/**
 * Update cart add notification preference (save to backend)
 */
export const updateCartAddPreference = (enabled: boolean) => async (dispatch: AppDispatch) => {
  try {
    dispatch(toggleCartAddNotification(enabled));
    
    await notificationPreferencesService.updatePreferences({ cart_add_enabled: enabled });
  } catch (error: any) {
    console.error('Update cart add preference error:', error);
    dispatch(setError(error.message));
    
    dispatch(toggleCartAddNotification(!enabled));
  }
};


export const updateCartUpdatePreference = (enabled: boolean) => async (dispatch: AppDispatch) => {
  try {
    dispatch(toggleCartUpdateNotification(enabled));
    await notificationPreferencesService.updatePreferences({ cart_update_enabled: enabled });
  } catch (error: any) {
    console.error('Update cart update preference error:', error);
    dispatch(setError(error.message));
    dispatch(toggleCartUpdateNotification(!enabled));
  }
};

/**
 * Update cart remove notification preference (save to backend)
 */
export const updateCartRemovePreference = (enabled: boolean) => async (dispatch: AppDispatch) => {
  try {
    dispatch(toggleCartRemoveNotification(enabled));
    await notificationPreferencesService.updatePreferences({ cart_remove_enabled: enabled });
  } catch (error: any) {
    console.error('Update cart remove preference error:', error);
    dispatch(setError(error.message));
    dispatch(toggleCartRemoveNotification(!enabled));
  }
};
