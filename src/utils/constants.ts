// API endpoints
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// App constants
export const CATEGORIES = [
  { id: '1', name: 'Vegetables', icon: 'carrot' },
  { id: '2', name: 'Fruits', icon: 'apple' },
  { id: '3', name: 'Meats', icon: 'drumstick' },
  { id: '4', name: 'Cleaning', icon: 'spray-bottle' },
  { id: '5', name: 'Supermarket', icon: 'shopping-bag' },
];

// Notification constants
export const NOTIFICATION_TYPES = {
  ITEM_ADDED: 'item_added',
  ITEM_PURCHASED: 'item_purchased',
  LIST_CLEARED: 'list_cleared',
};
