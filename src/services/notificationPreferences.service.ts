// Notification Preferences Service
// Manages user notification settings stored in database

import { supabase } from '../supabase';

export interface NotificationPreferences {
  cart_add_enabled: boolean;
  cart_update_enabled: boolean;
  cart_remove_enabled: boolean;
}

export const notificationPreferencesService = {

  getPreferences: async (): Promise<NotificationPreferences> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('cart_add_enabled, cart_update_enabled, cart_remove_enabled')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching preferences:', error);
      // Return defaults if error
      return {
        cart_add_enabled: true,
        cart_update_enabled: false,
        cart_remove_enabled: false,
      };
    }

    // If no preferences found, return defaults
    if (!data) {
      return {
        cart_add_enabled: true,
        cart_update_enabled: false,
        cart_remove_enabled: false,
      };
    }

    return data;
  },


  updatePreferences: async (preferences: Partial<NotificationPreferences>): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Use upsert to create or update preferences
    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) throw error;
  },


  hasNotificationEnabled: async (
    userId: string, 
    type: 'cart_add_enabled' | 'cart_update_enabled' | 'cart_remove_enabled'
  ): Promise<boolean> => {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select(type)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error checking notification preference:', error);
      return true; // Default to enabled if error (fail-safe)
    }

    // If no preferences found (data is null), return default (true for all types)
    if (!data) {
      return true; // All notification types enabled by default
    }

    return (data as any)[type] ?? true;
  },
};
