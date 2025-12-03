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


export interface CartItem {
  id: string;
  household_id: string;
  product_id: string;
  quantity: number;
  tags: ProductTag[];
  added_by_user_id: string;
  created_at: string;
  updated_at: string;
  product?: Product;
  added_by?: User;
}
export interface AddToCartRequest {
  product_id: string;
  quantity: number;
  tags?: ProductTag[];
}

export interface UpdateCartItemRequest {
  quantity?: number;
  tags?: ProductTag[];
}
