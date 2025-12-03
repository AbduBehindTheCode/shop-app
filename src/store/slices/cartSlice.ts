import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Set cart items from database
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Add or update cart item (from database response)
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex >= 0) {
        state.items[existingIndex] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },
    
    // Remove cart item by ID
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    // Update cart item
    updateCartItem: (state, action: PayloadAction<CartItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.items[index] = action.payload;
      }
    },
    
    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { 
  setCart, 
  addCartItem, 
  removeCartItem, 
  updateCartItem, 
  clearCart, 
  setLoading, 
  setError 
} = cartSlice.actions;

export default cartSlice.reducer;
