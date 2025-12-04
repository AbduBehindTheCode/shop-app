// Households Service
// Manages household operations and member management

import { supabase } from '../supabase';
import type { Household, User } from '../types';

export const householdsService = {
  /**
   * Get current user's household with members
   */
  getMyHousehold: async (): Promise<Household | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get user's household
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('household_id')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;
    if (!userData.household_id) return null;

    // Get household with members
    const { data: household, error: householdError } = await supabase
      .from('households')
      .select(`
        *,
        members:users(*)
      `)
      .eq('id', userData.household_id)
      .single();

    if (householdError) throw householdError;
    return household as Household;
  },

  /**
   * Get household by ID
   */
  getHouseholdById: async (householdId: string): Promise<Household> => {
    const { data, error } = await supabase
      .from('households')
      .select(`
        *,
        members:users(*)
      `)
      .eq('id', householdId)
      .single();

    if (error) throw error;
    return data as Household;
  },

  /**
   * Update household name (admin only)
   */
  updateHousehold: async (
    householdId: string,
    updates: { name: string }
  ): Promise<Household> => {
    const { data, error } = await supabase
      .from('households')
      .update(updates)
      .eq('id', householdId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all members of a household
   */
  getHouseholdMembers: async (householdId: string): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('household_id', householdId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Remove member from household (admin only)
   */
  removeMember: async (householdId: string, userId: string): Promise<void> => {
    // Update user to remove household association
    const { error } = await supabase
      .from('users')
      .update({ household_id: null })
      .eq('id', userId)
      .eq('household_id', householdId);

    if (error) throw error;
  },

  /**
   * Leave household (self)
   */
  leaveHousehold: async (): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('users')
      .update({ household_id: null })
      .eq('id', user.id);

    if (error) throw error;
  },

  /**
   * Check if current user is household admin
   */

};
