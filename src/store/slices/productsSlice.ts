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
    // Meats
    {
      id: '11',
      name: 'Chicken Breast',
      image: '🍗',
      category: 'meat',
    },
    {
      id: '12',
      name: 'Lamb',
      image: '🐑',
      category: 'meat',
    },
    {
      id: '13',
      name: 'Fish Fillet',
      image: '🐟',
      category: 'meat',
    },
    {
      id: '14',
      name: 'Jambon',
      image: '🥓',
      category: 'meat',
    },
    {
      id: '15',
      name: 'Chicken Wings',
      image: '🍗',
      category: 'meat',
    },
    {
      id: '16',
      name: 'Ground Beef',
      image: '🥩',
      category: 'meat',
    },
    // Supermarket
    {
      id: '17',
      name: 'Bread',
      image: '🍞',
      category: 'supermarket',
    },
    {
      id: '18',
      name: 'Yogurt',
      image: '🥣',
      category: 'supermarket',
    },
    {
      id: '19',
      name: 'Milk',
      image: '🥛',
      category: 'supermarket',
    },
    {
      id: '20',
      name: 'Cheese',
      image: '🧀',
      category: 'supermarket',
    },
    {
      id: '21',
      name: 'Greek Yogurt',
      image: '🥛',
      category: 'supermarket',
    },
    {
      id: '22',
      name: 'Eggs',
      image: '🥚',
      category: 'supermarket',
    },
    {
      id: '23',
      name: 'Coffee',
      image: '☕',
      category: 'supermarket',
    },
    {
      id: '24',
      name: 'Chocolate',
      image: '🍫',
      category: 'supermarket',
    },
    {
      id: '25',
      name: 'Chips',
      image: '🍟',
      category: 'supermarket',
    },
    {
      id: '26',
      name: 'Rice',
      image: '🍚',
      category: 'supermarket',
    },
    {
      id: '27',
      name: 'Pasta',
      image: '🍝',
      category: 'supermarket',
    },
    {
      id: '28',
      name: 'Cake',
      image: '🍰',
      category: 'supermarket',
    },
    {
      id: '29',
      name: 'Nuts',
      image: '🥜',
      category: 'supermarket',
    },
    {
      id: '30',
      name: 'Honey',
      image: '🍯',
      category: 'supermarket',
    },
    {
      id: '31',
      name: 'Oats',
      image: '🌾',
      category: 'supermarket',
    },
    {
      id: '32',
      name: 'Flour',
      image: '🫙',
      category: 'supermarket',
    },
    // Cleaning
    {
      id: '33',
      name: 'Bleach',
      image: '🧪',
      category: 'cleaning',
    },
    {
      id: '34',
      name: 'Toilet Paper',
      image: '🧻',
      category: 'cleaning',
    },
    {
      id: '35',
      name: 'Liquid Soap',
      image: '🧼',
      category: 'cleaning',
    },
    {
      id: '36',
      name: 'Washing Machine Liquid',
      image: '🧺',
      category: 'cleaning',
    },
    {
      id: '37',
      name: 'Dishwasher Liquid',
      image: '🍽️',
      category: 'cleaning',
    },
  ],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
});

export default productsSlice.reducer;
