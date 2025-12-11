// Expo Push Notification API Service
// Sends push notifications to specific devices via Expo's push service

export interface ExpoPushMessage {
  to: string | string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | null;
  badge?: number;
  channelId?: string;
  priority?: 'default' | 'normal' | 'high';
}

export const expoPushService = {
  /**
   * Send push notifications to multiple devices via Expo Push API
   */
  sendPushNotifications: async (messages: ExpoPushMessage[]): Promise<void> => {
    try {

      
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Expo push notification API error:', result);
        throw new Error('Failed to send push notifications');
      }

      // Map Expo response IDs to push tokens
      if (result.data) {
        result.data.forEach((ticket: any, index: number) => {
          const targetToken = Array.isArray(messages)
            ? messages[index]?.to
            : messages.to;
          if (ticket.status === 'error') {
            console.error(`❌ Push notification error for token ${targetToken}:`, ticket.message);
            if (ticket.details?.error) {
              console.error('Error details:', ticket.details.error);
            }
          } else if (ticket.status === 'ok') {
            console.log(`✅ Notification sent: token=${targetToken}, ticket ID=${ticket.id}`);
          }
        });
      }

    } catch (error) {
      console.error('❌ Error sending push notifications:', error);
      throw error;
    }
  },

  /**
   * Send a single push notification
   */
  sendSingleNotification: async (
    pushToken: string,
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<void> => {
    await expoPushService.sendPushNotifications([
      {
        to: pushToken,
        title,
        body,
        data,
        sound: 'default',
        priority: 'high',
      },
    ]);
  },

  /**
   * Send notification to multiple tokens (batch)
   */
  sendBatchNotifications: async (
    pushTokens: string[],
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<void> => {
    if (pushTokens.length === 0) return;

    // Split into chunks of 100 (Expo's limit)
    const chunks = [];
    for (let i = 0; i < pushTokens.length; i += 100) {
      chunks.push(pushTokens.slice(i, i + 100));
    }

    // Send each chunk
    for (const chunk of chunks) {
      const messages: ExpoPushMessage[] = chunk.map(token => ({
        to: token,
        title,
        body,
        data,
        sound: 'default',
        priority: 'high',
        channelId: 'default',
      }));

      await expoPushService.sendPushNotifications(messages);
    }
  },

  /**
   * Validate Expo push token format
   */
  isValidPushToken: (token: string): boolean => {
    return token.startsWith('ExponentPushToken[') || token.startsWith('ExpoPushToken[');
  },
};
