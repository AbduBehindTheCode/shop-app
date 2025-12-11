// Push Token Service
// Manages Expo push notification tokens for cross-device notifications

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { supabase } from '../supabase';

export const pushTokenService = {
  /**
   * Register current device's push token for the logged-in user
   */
  registerPushToken: async (): Promise<string | null> => {
    try {
      // Only works on physical devices
      if (!Device.isDevice) {
        return null;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return null;
      }

      // Check/request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return null;
      }

      // Get the Expo push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID || 'your-project-id', // Add your Expo project ID
      });
      const pushToken = tokenData.data;

      // Get device name
      const deviceName = `${Device.brand || 'Unknown'} ${Device.modelName || Device.osName || 'Device'}`;

      // Store token in database (upsert to handle multiple devices)
      const { error } = await supabase
        .from('push_tokens')
        .upsert({
          user_id: user.id,
          push_token: pushToken,
          device_name: deviceName,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,push_token',
        });

      if (error) {
        console.error('Error saving push token:', error);
        return null;
      }

      return pushToken;
    } catch (error) {
      console.error('Error registering push token:', error);
      return null;
    }
  },

  /**
   * Remove push token for current device (on logout)
   */
  unregisterPushToken: async (): Promise<void> => {
    try {
      if (!Device.isDevice) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID || 'your-project-id',
      });
      const pushToken = tokenData.data;

      await supabase
        .from('push_tokens')
        .delete()
        .eq('user_id', user.id)
        .eq('push_token', pushToken);

    } catch (error) {
      console.error('Error unregistering push token:', error);
    }
  },

  /**
   * Get all push tokens for specific user IDs (for sending notifications)
   */
  getPushTokensForUsers: async (userIds: string[]): Promise<{ user_id: string; push_token: string }[]> => {
    try {
      const { data, error } = await supabase
        .from('push_tokens')
        .select('user_id, push_token')
        .in('user_id', userIds);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching push tokens:', error);
      return [];
    }
  },

  /**
   * Clean up old/invalid push tokens
   */
  cleanupOldTokens: async (userId: string, validToken: string): Promise<void> => {
    try {
      await supabase
        .from('push_tokens')
        .delete()
        .eq('user_id', userId)
        .neq('push_token', validToken);
    } catch (error) {
      console.error('Error cleaning up old tokens:', error);
    }
  },
};
