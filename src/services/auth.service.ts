
import { supabase } from '../supabase';
import type { SignInRequest, SignUpRequest, User } from '../types';

export const authService = {

  signUp: async ({ email, password, name }: SignUpRequest) => {
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw authError;
    }
    if (!authData.user) {
      throw new Error('User creation failed');
    }


    // Create user profile (triggers household creation)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
      })
      .select()
      .single();

    if (userError) {
      throw userError;
    }

    return { user: authData.user, profile: userData };
  },

 
  signIn: async ({ email, password }: SignInRequest) => {
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

 
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*, household:households(*)')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    return { session: data.session, user: data.user, profile };
  },


  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },


  getCurrentUser: async (): Promise<User | null> => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select(`
        *,
        household:households(*)
      `)
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    return profile as User;
  },


  updateProfile: async (updates: { name?: string; email?: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },
};
