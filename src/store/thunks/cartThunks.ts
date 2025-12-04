import { cartService } from '@/services/cart.service';
import { CartItem, ProductTag } from '@/types';
import { removeCartItem, setCart, setError, setLoading, updateCartItem } from '../slices/cartSlice';
import { AppDispatch } from '../store';

// Fetch cart from database
export const fetchCart = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await cartService.getCart();
    dispatch(setCart(data as CartItem[]));
    dispatch(setLoading(false));
  } catch (error: any) {
    console.error('Fetch cart error:', error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

// Add item to cart
export const addToCart = (productId: string, quantity: number, tags: ProductTag[] = []) => 
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      await cartService.addToCart({
        product_id: productId,
        quantity,
        tags,
      });
      

      const allItems = await cartService.getCart();
      dispatch(setCart(allItems as CartItem[]));
      dispatch(setLoading(false));
    } catch (error: any) {
      console.error('Add to cart error:', error);
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  };

// Remove item from cart
export const removeFromCart = (cartItemId: string) => async (dispatch: AppDispatch) => {
  try {
    await cartService.removeFromCart(cartItemId);
    dispatch(removeCartItem(cartItemId));
  } catch (error: any) {
    console.error('Remove from cart error:', error);
    dispatch(setError(error.message));
  }
};

// Update cart item quantity
export const updateCartQuantity = (cartItemId: string, quantity: number) => 
  async (dispatch: AppDispatch) => {
    try {
      const updatedItem = await cartService.updateCartItem(cartItemId, { quantity });
      dispatch(updateCartItem(updatedItem as CartItem));
    } catch (error: any) {
      console.error('Update quantity error:', error);
      dispatch(setError(error.message));
    }
  };

// Update cart item tags
export const updateCartTags = (cartItemId: string, tags: ProductTag[]) => 
  async (dispatch: AppDispatch) => {
    try {
      const updatedItem = await cartService.updateCartItem(cartItemId, { tags });
      dispatch(updateCartItem(updatedItem as CartItem));
    } catch (error: any) {
      console.error('Update tags error:', error);
      dispatch(setError(error.message));
    }
  };

// Clear entire cart
export const clearCartAsync = () => async (dispatch: AppDispatch) => {
  try {
    await cartService.clearCart();
    dispatch(setCart([]));
  } catch (error: any) {
    console.error('Clear cart error:', error);
    dispatch(setError(error.message));
  }
};
