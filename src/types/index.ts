// User types
export interface User {
  id: string;
  email: string;
  name: string;
  partnerId?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  icon: string;
}

// Cart item types
export interface CartItem {
  id: string;
  categoryId: string;
  name: string;
  quantity: number;
  purchased: boolean;
  addedBy: string;
  addedAt: Date;
}

// Shopping list types
export interface ShoppingList {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Notification types
export interface Notification {
  id: string;
  type: 'item_added' | 'item_purchased' | 'list_cleared';
  message: string;
  itemId?: string;
  createdAt: Date;
  read: boolean;
}
