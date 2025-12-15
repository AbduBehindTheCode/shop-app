import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone_number?: string;
    household_id: string | null;
  } | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true, // Start with true to check stored auth
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setAuthenticated: (state, action: PayloadAction<{ user: AuthState['user'] }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.loading = false;
    },
    setUnauthenticated: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setAuthenticated, setUnauthenticated, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
