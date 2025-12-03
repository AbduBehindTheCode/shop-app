import { productsService } from '@/services/products.service';
import { setError, setLoading, setProducts } from '../slices/productsSlice';
import { AppDispatch } from '../store';

// Fetch all products from database
export const fetchProducts = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await productsService.getAllProducts();
    dispatch(setProducts(data));
    dispatch(setLoading(false));
  } catch (error: any) {
    console.error('Fetch products error:', error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

// Search products
export const searchProducts = (searchTerm: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await productsService.searchProducts(searchTerm);
    dispatch(setProducts(data));
    dispatch(setLoading(false));
  } catch (error: any) {
    console.error('Search products error:', error);
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};
