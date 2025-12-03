import { supabase } from '../supabase';
import type { Product } from '../types';

export const productsService = {

  getAllProducts: async (): Promise<Product[]> => {
    let query = supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  getProductById: async (productId: string): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data;
  },

  searchProducts: async (searchTerm: string): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

};