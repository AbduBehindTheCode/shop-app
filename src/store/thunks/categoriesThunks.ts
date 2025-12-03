import { categoriesService } from '@/services/categories.service';
import { AppDispatch } from '../store';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

// Fetch all categories from database
export const fetchCategories = () => async (dispatch: AppDispatch) => {
  try {
    dispatch({ type: 'categories/setLoading', payload: true });
    const data = await categoriesService.getAllCategories();
    dispatch({ type: 'categories/setCategories', payload: data });
    dispatch({ type: 'categories/setLoading', payload: false });
  } catch (error: any) {
    console.error('Fetch categories error:', error);
    dispatch({ type: 'categories/setError', payload: error.message });
    dispatch({ type: 'categories/setLoading', payload: false });
  }
};
