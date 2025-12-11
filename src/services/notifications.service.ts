// Notifications Service
// Manages user notifications

import { supabase } from '../supabase';
import type { Notification } from '../types';
import { expoPushService } from './expoPush.service';
import { notificationPreferencesService } from './notificationPreferences.service';
import { pushTokenService } from './pushToken.service';

export const notificationsService = {
  /**
   * Create notification for household members based on their preferences
   * Checks each recipient's notification preferences before sending
   */
  notifyHousehold: async ({
    type,
    title,
    message,
    data,
    excludeCurrentUser = true,
    notificationType,
  }: {
    type: Notification['type'];
    title: string;
    message: string;
    data?: any;
    excludeCurrentUser?: boolean;
    notificationType?: 'cart_add_enabled' | 'cart_update_enabled' | 'cart_remove_enabled';
  }): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get current user's household_id
    const { data: userProfile } = await supabase
      .from('users')
      .select('household_id')
      .eq('id', user.id)
      .single();

    if (!userProfile?.household_id) return;

    // Get all household members
    const { data: members, error: membersError } = await supabase
      .from('users')
      .select('id')
      .eq('household_id', userProfile.household_id);

    if (membersError) throw membersError;

    // Filter out current user if needed
    let recipientIds = excludeCurrentUser
      ? members.filter(m => m.id !== user.id).map(m => m.id)
      : members.map(m => m.id);


    // If notification type is specified, filter by user preferences
    if (notificationType && recipientIds.length > 0) {
      const filteredRecipients: string[] = [];
      
      for (const recipientId of recipientIds) {
        try {
          const hasEnabled = await notificationPreferencesService.hasNotificationEnabled(
            recipientId,
            notificationType
          );
          if (hasEnabled) {
            filteredRecipients.push(recipientId);
          }
        } catch (error) {
          console.error(`Error checking preferences for user ${recipientId}:`, error);
          // Include user if preference check fails (fail-safe)
          filteredRecipients.push(recipientId);
        }
      }
      
      recipientIds = filteredRecipients;
    }

    if (recipientIds.length === 0) return;

    // Create notifications for eligible members
    const notifications = recipientIds.map(recipientId => ({
      user_id: recipientId,
      household_id: userProfile.household_id,
      type,
      title,
      message,
      data,
      is_read: false,
    }));

    const { error, data: inserted } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error('❌ Error inserting notifications:', error);
      throw error;
    }

    // Send cross-device push notifications via Expo Push API
    try {
      
      // Get push tokens for all recipients
      const tokensData = await pushTokenService.getPushTokensForUsers(recipientIds);
      
      if (tokensData.length === 0) {
        console.warn('⚠️ No push tokens found for recipients. Users may need to restart the app.');
        return;
      }
      
      if (tokensData.length > 0) {
        const validTokens = tokensData
          .map(t => t.push_token)
          .filter(token => expoPushService.isValidPushToken(token));


        if (validTokens.length > 0) {
          const notificationIcon = type === 'item_added' ? '➕' : type === 'item_removed' ? '🗑️' : '✏️';
          
          
          await expoPushService.sendBatchNotifications(
            validTokens,
            `${notificationIcon} ${title}`,
            message,
            { type, ...data, household_id: userProfile.household_id }
          );
          
        } else {
          console.warn('⚠️ No valid Expo push tokens found');
        }
      }
    } catch (notifError) {
      console.error('❌ Failed to send push notifications:', notifError);
      // Don't throw - database notification was created successfully
    }
  },

  /**
   * Notify household about item added to cart (checks cart_add_enabled preference)
   */
  notifyItemAdded: async (productName: string, quantity: number, userName: string) => {
    await notificationsService.notifyHousehold({
      type: 'item_added',
      title: 'Item Added to Cart',
      message: `${userName} added ${quantity}x ${productName} to the shopping list`,
      data: { productName, quantity, userName },
      notificationType: 'cart_add_enabled',
    });
  },

  /**
   * Notify household about item removed from cart (checks cart_remove_enabled preference)
   */
  notifyItemRemoved: async (productName: string, userName: string) => {
    await notificationsService.notifyHousehold({
      type: 'item_removed',
      title: 'Item Removed from Cart',
      message: `${userName} removed ${productName} from the shopping list`,
      data: { productName },
      notificationType: 'cart_remove_enabled',
    });
  },

  /**
   * Notify household about item updated in cart (checks cart_update_enabled preference)
   */
  notifyItemUpdated: async (productName: string, quantity: number, userName: string) => {
    await notificationsService.notifyHousehold({
      type: 'item_updated',
      title: 'Item Updated',
      message: `${userName} updated ${productName} quantity to ${quantity}`,
      data: { productName, quantity },
      notificationType: 'cart_update_enabled',
    });
  },

  /**
   * Get all notifications for current user
   */
  getNotifications: async (): Promise<Notification[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<number> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId: string): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (notificationId: string): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },
};
