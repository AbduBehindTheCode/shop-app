import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, ProductTag } from '../../types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ 
      productId: string; 
      productName: string; 
      productImage: string; 
      quantity: number; 
      unit: string;
      tags?: ProductTag[];
    }>) => {
      const { productId, productName, productImage, quantity, unit, tags } = action.payload;
      
      const existingItem = state.items.find(item => item.productId === productId && item.unit === unit);
      
      if (existingItem) {
        existingItem.quantity += quantity;
        // Merge tags if new tags are provided
        if (tags && tags.length > 0) {
          const currentTags = existingItem.tags || [];
          existingItem.tags = Array.from(new Set([...currentTags, ...tags]));
        }
      } else {
        state.items.push({
          productId,
          productName,
          productImage,
          quantity,
          unit,
          tags: tags || [],
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<{ productId: string; unit: string }>) => {
      state.items = state.items.filter(item => 
        !(item.productId === action.payload.productId && item.unit === action.payload.unit)
      );
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; unit: string; quantity: number }>) => {
      const item = state.items.find(item => 
        item.productId === action.payload.productId && item.unit === action.payload.unit
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    updateTags: (state, action: PayloadAction<{ productId: string; unit: string; tags: ProductTag[] }>) => {
      const item = state.items.find(item => 
        item.productId === action.payload.productId && item.unit === action.payload.unit
      );
      if (item) {
        item.tags = action.payload.tags;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, updateTags, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
