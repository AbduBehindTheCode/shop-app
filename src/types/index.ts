// User types
export interface User {
  id: string;
  email: string;
  name: string;
  household_id: string | null;
  created_at?: string;
  updated_at?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
}

export type UnitType = 'kg' | 'piece' | 'liter' | 'gram' | 'pack';

export type ProductTag = 'urgent' | 'wait-for-sale' | 'important';

// Category types
export interface Category {
  id: string;
  name: string;
  icon: string;
}

// Cart item types
export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unit: string;
  tags?: ProductTag[];
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

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

