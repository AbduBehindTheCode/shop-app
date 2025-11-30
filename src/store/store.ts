import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import slices (will be created)
// import cartReducer from './slices/cartSlice';
// import categoriesReducer from './slices/categoriesSlice';
// import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    // cart: cartReducer,
    // categories: categoriesReducer,
    // user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks for usage in components
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
