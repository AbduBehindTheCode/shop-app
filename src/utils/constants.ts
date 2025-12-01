// API endpoints
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Unit types for products
export const UNITS = ['piece', 'kg', 'gram', 'liter', 'pack'] as const;

// Notification constants
export const NOTIFICATION_TYPES = {
  ITEM_ADDED: 'item_added',
  ITEM_PURCHASED: 'item_purchased',
  LIST_CLEARED: 'list_cleared',
} as const;

// Product tags
export const PRODUCT_TAGS = [
  { id: 'urgent', label: 'Urgent', color: '#FF6B6B', emoji: '🔴' },
  { id: 'wait-for-sale', label: 'Wait for Sale', color: '#4ECDC4', emoji: '💰' },
  { id: 'important', label: 'Important', color: '#FFD93D', emoji: '⭐' },
] as const;
