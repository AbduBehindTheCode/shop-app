
import { supabase } from '../supabase';
import type { SignInRequest, SignUpRequest, User } from '../types';
import { pushTokenService } from './pushToken.service';

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
      .select('*')
      .single();

    if (userError) {
      throw userError;
    }

    // Register push token for notifications
    try {
      await pushTokenService.registerPushToken();
    } catch (error) {
      console.error('Failed to register push token:', error);
      // Don't fail signup if push token registration fails
    }

    return { 
      user: authData.user, 
      profile: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        household_id: userData.household_id,
      }
    };
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
      .select('id, email, name, household_id')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Register push token for notifications
    try {
      await pushTokenService.registerPushToken();
    } catch (error) {
      console.error('Failed to register push token:', error);
      // Don't fail login if push token registration fails
    }

    return { 
      session: data.session, 
      user: data.user, 
      profile: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        household_id: profile.household_id,
      }
    };
  },


  signOut: async () => {
    // Unregister push token before signing out
    try {
      await pushTokenService.unregisterPushToken();
    } catch (error) {
      console.error('Failed to unregister push token:', error);
      // Continue with sign out even if unregistration fails
    }

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
      .select('id, email, name, household_id, created_at, updated_at')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      household_id: profile.household_id,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    } as User;
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

  requestAccountDeletion: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Mark user for deletion in the database
    const { error } = await supabase
      .from('users')
      .update({
        deletion_requested_at: new Date().toISOString(),
        deletion_requested: true,
      })
      .eq('id', user.id);

    if (error) throw error;
  },
};
