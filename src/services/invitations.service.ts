import { supabase } from '../supabase';
import { HouseholdInvitation } from '../types';

export const invitationsService = {
  // Search for users to invite (by name or email)
  searchUsers: async (searchTerm: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email')
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .limit(10);

    if (error) throw error;
    return data;
  },

  // Send invitation to a user
  sendInvitation: async (invitedUserId: string) => {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) throw new Error('Not authenticated');

    // Get current user's household_id
    const { data: userProfile } = await supabase
      .from('users')
      .select('household_id')
      .eq('id', currentUser.user.id)
      .single();

    if (!userProfile?.household_id) throw new Error('No household found');

    const { data, error } = await supabase
      .from('household_invitations')
      .insert({
        household_id: userProfile.household_id,
        invited_user_id: invitedUserId,
        invited_by_user_id: currentUser.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get pending invitations for current user
  getMyInvitations: async (): Promise<HouseholdInvitation[]> => {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('household_invitations')
      .select(`
        *,
        household:households(*),
        invited_by:users!invited_by_user_id(id, name, email)
      `)
      .eq('invited_user_id', currentUser.user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Accept invitation
  acceptInvitation: async (invitationId: string) => {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) throw new Error('Not authenticated');

    // Get invitation details
    const { data: invitation, error: invError } = await supabase
      .from('household_invitations')
      .select('household_id')
      .eq('id', invitationId)
      .single();

    if (invError) throw invError;

    // Update invitation status
    const { error: updateError } = await supabase
      .from('household_invitations')
      .update({ status: 'accepted' })
      .eq('id', invitationId);

    if (updateError) throw updateError;

    // Update user's household_id
    const { error: userError } = await supabase
      .from('users')
      .update({ household_id: invitation.household_id })
      .eq('id', currentUser.user.id);

    if (userError) throw userError;

    return { success: true };
  },

  // Reject invitation
  rejectInvitation: async (invitationId: string) => {
    const { error } = await supabase
      .from('household_invitations')
      .update({ status: 'rejected' })
      .eq('id', invitationId);

    if (error) throw error;
    return { success: true };
  },

  // Get sent invitations (from my household)
  getSentInvitations: async (): Promise<HouseholdInvitation[]> => {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) throw new Error('Not authenticated');

    const { data: userProfile } = await supabase
      .from('users')
      .select('household_id')
      .eq('id', currentUser.user.id)
      .single();

    if (!userProfile?.household_id) return [];

    const { data, error } = await supabase
      .from('household_invitations')
      .select(`
        *,
        invited_user:users!invited_user_id(id, name, email),
        invited_by:users!invited_by_user_id(id, name, email)
      `)
      .eq('household_id', userProfile.household_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Cancel invitation (for sender)
  cancelInvitation: async (invitationId: string) => {
    const { error } = await supabase
      .from('household_invitations')
      .delete()
      .eq('id', invitationId);

    if (error) throw error;
    return { success: true };
  },

  // Subscribe to new invitations
  subscribeToInvitations: async (callback: (invitation: any) => void) => {
    const { data: currentUser } = await supabase.auth.getUser();
    
    const subscription = supabase
      .channel('invitations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'household_invitations',
          filter: `invited_user_id=eq.${currentUser}`,
        },
        (payload) => callback(payload.new)
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },
};
