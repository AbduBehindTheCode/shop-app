import { supabase } from '../supabase';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const categoriesService = {
  getAllCategories: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  getCategoryById: async (categoryId: string): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) throw error;
    return data;
  },
};
