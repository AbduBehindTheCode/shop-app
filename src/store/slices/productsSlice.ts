import { createSlice } from '@reduxjs/toolkit';
import { Product } from '../../types';

interface ProductsState {
  products: Product[];
  loading: boolean;
}

const initialState: ProductsState = {
  loading: false,
  products: [
    {
      id: '1',
      name: 'Tomato',
      image: '🍅',
      category: 'vegetable',
    },
    {
      id: '2',
      name: 'Paprika',
      image: '🫑',
      category: 'vegetable',
    },
    {
      id: '3',
      name: 'Potato',
      image: '🥔',
      category: 'vegetable',
    },
    {
      id: '4',
      name: 'Cucumber',
      image: '🥒',
      category: 'vegetable',
    },
    {
      id: '5',
      name: 'Carrot',
      image: '🥕',
      category: 'vegetable',
    },
    {
      id: '6',
      name: 'Onion',
      image: '🧅',
      category: 'vegetable',
    },
    {
      id: '7',
      name: 'Garlic',
      image: '🧄',
      category: 'vegetable',
    },
    {
      id: '8',
      name: 'Lettuce',
      image: '🥬',
      category: 'vegetable',
    },
    {
      id: '9',
      name: 'Broccoli',
      image: '🥦',
      category: 'vegetable',
    },
    {
      id: '10',
      name: 'Spinach',
      image: '🍃',
      category: 'vegetable',
    },
  ],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
});

export default productsSlice.reducer;
