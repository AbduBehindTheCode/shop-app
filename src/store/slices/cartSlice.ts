import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
}

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
    addToCart: (state, action: PayloadAction<{ productId: string; productName: string; productImage: string; quantity: number }>) => {
      const { productId, productName, productImage, quantity } = action.payload;
      
      const existingItem = state.items.find(item => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          productId,
          productName,
          productImage,
          quantity,
        });
      }
      
      // Log to console as requested
      console.log(`Added to cart: ${productName}, Quantity: ${quantity}`);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(item => item.productId === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
