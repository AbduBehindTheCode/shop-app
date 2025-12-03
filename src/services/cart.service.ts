// Cart Service
// Manages household shopping cart operations

import { supabase } from '../supabase';
import type { AddToCartRequest, CartItem, ProductTag, UpdateCartItemRequest } from '../types';

export const cartService = {
  /**
   * Get household cart items with product details
   */
  getCart: async (): Promise<CartItem[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get user's household
    const { data: userData } = await supabase
      .from('users')
      .select('household_id')
      .eq('id', user.id)
      .single();

    if (!userData?.household_id) {
      throw new Error('User not in a household');
    }

    // Get cart items with product and user info
    const { data, error } = await supabase
      .from('household_carts')
      .select(`
        *,
        product:products(*),
        added_by:users(id, name, email)
      `)
      .eq('household_id', userData.household_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as CartItem[];
  },

  /**
   * Add item to household cart
   */
  addToCart: async ({
    product_id,
    quantity,
    tags = [],
  }: AddToCartRequest): Promise<CartItem> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get user's household
    const { data: userData } = await supabase
      .from('users')
      .select('household_id')
      .eq('id', user.id)
      .single();

    if (!userData?.household_id) {
      throw new Error('User not in a household');
    }

    // Check if item already exists in cart
    const { data: existing } = await supabase
      .from('household_carts')
      .select('*')
      .eq('household_id', userData.household_id)
      .eq('product_id', product_id)
      .single();

    if (existing) {
      // Update quantity if item exists
      return cartService.updateCartItem(existing.id, {
        quantity: existing.quantity + quantity,
        tags: [...new Set([...existing.tags, ...tags])], // Merge tags
      });
    }

    // Add new item
    const { data, error } = await supabase
      .from('household_carts')
      .insert({
        household_id: userData.household_id,
        product_id,
        quantity,
        tags,
        added_by_user_id: user.id,
      })
      .select(`
        *,
        product:products(*),
        added_by:users(id, name, email)
      `)
      .single();

    if (error) throw error;
    return data as CartItem;
  },

  /**
   * Update cart item quantity or tags
   */
  updateCartItem: async (
    cartItemId: string,
    updates: UpdateCartItemRequest
  ): Promise<CartItem> => {
    const { data, error } = await supabase
      .from('household_carts')
      .update(updates)
      .eq('id', cartItemId)
      .select(`
        *,
        product:products(*),
        added_by:users(id, name, email)
      `)
      .single();

    if (error) throw error;
    return data as CartItem;
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (cartItemId: string): Promise<void> => {
    const { error } = await supabase
      .from('household_carts')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;
  },

  /**
   * Clear entire household cart
   */
  clearCart: async (): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get user's household
    const { data: userData } = await supabase
      .from('users')
      .select('household_id')
      .eq('id', user.id)
      .single();

    if (!userData?.household_id) {
      throw new Error('User not in a household');
    }

    const { error } = await supabase
      .from('household_carts')
      .delete()
      .eq('household_id', userData.household_id);

    if (error) throw error;
  },

  /**
   * Get cart items by tag
   */
  getCartItemsByTag: async (tag: ProductTag): Promise<CartItem[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get user's household
    const { data: userData } = await supabase
      .from('users')
      .select('household_id')
      .eq('id', user.id)
      .single();

    if (!userData?.household_id) {
      throw new Error('User not in a household');
    }

    const { data, error } = await supabase
      .from('household_carts')
      .select(`
        *,
        product:products(*),
        added_by:users(id, name, email)
      `)
      .eq('household_id', userData.household_id)
      .contains('tags', [tag])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as CartItem[];
  },

  getCartItemCount: async (): Promise<number> => {
    const items = await cartService.getCart();
    return items.reduce((count, item) => count + item.quantity, 0);
  },
};
