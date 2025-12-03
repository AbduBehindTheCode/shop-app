import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://fowtciltrjfesbcguzuy.supabase.co';
const supabaseAnonKey = 'sb_publishable_IcyDEcKS79kAKlbYgQ3GMw_enHOjOX7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});