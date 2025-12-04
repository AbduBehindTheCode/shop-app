import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { SettingsItem } from '@/components/ui/SettingsItem';
import { authService } from '@/services/auth.service';
import { householdsService } from '@/services/households.service';
import { invitationsService } from '@/services/invitations.service';
import { setUnauthenticated } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import type { HouseholdInvitation, User } from '@/types';

export default function ProfileScreen() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [userName] = useState(user?.name || 'User');
  const [householdMembers, setHouseholdMembers] = useState<User[]>([]);
  const [sentInvitations, setSentInvitations] = useState<HouseholdInvitation[]>([]);
  const [loadingHousehold, setLoadingHousehold] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [receivedInvitations, setReceivedInvitations] = useState<HouseholdInvitation[]>([]);

  useEffect(() => {
    loadHouseholdData();
    loadReceivedInvitations();
  }, []);

  const loadReceivedInvitations = async () => {
    try {
      const invitations = await invitationsService.getMyInvitations();
      setReceivedInvitations(invitations);
    } catch (error: any) {
      console.error('Failed to load received invitations:', error);
    }
  };

  const loadHouseholdData = async () => {
    if (!user?.household_id) {
      setLoadingHousehold(false);
      return;
    }

    try {
      setLoadingHousehold(true);
      const [members, invitations] = await Promise.all([
        householdsService.getHouseholdMembers(user.household_id),
        invitationsService.getSentInvitations(),
      ]);
      setHouseholdMembers(members);
      setSentInvitations(invitations.filter(inv => inv.status === 'pending'));
    } catch (error: any) {
      console.error('Failed to load household data:', error);
    } finally {
      setLoadingHousehold(false);
    }
  };

  const handleSearchUsers = async (term: string) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const results = await invitationsService.searchUsers(term);
      console.log('Raw search results:', results, 'for term:', term);
      
      // Filter out current user and existing members
      const filtered = results.filter(
        u => u.id !== user?.id && !householdMembers.some(m => m.id === u.id)
      );
      console.log('Filtered results:', filtered);
      setSearchResults(filtered);
    } catch (error: any) {
      console.error('Search failed:', error);
      Alert.alert('Search Error', error.message || 'Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleSendInvitation = async (invitedUserId: string) => {
    try {
      await invitationsService.sendInvitation(invitedUserId);
      Alert.alert('Success', 'Invitation sent!');
      setShowInviteModal(false);
      setSearchTerm('');
      setSearchResults([]);
      loadHouseholdData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send invitation');
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    Alert.alert(
      'Cancel Invitation',
      'Are you sure you want to cancel this invitation?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await invitationsService.cancelInvitation(invitationId);
              loadHouseholdData();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel invitation');
            }
          },
        },
      ]
    );
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await invitationsService.acceptInvitation(invitationId);
      Alert.alert('Success', 'You have joined the household!');
      loadReceivedInvitations();
      loadHouseholdData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to accept invitation');
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      await invitationsService.rejectInvitation(invitationId);
      Alert.alert('Success', 'Invitation rejected');
      loadReceivedInvitations();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reject invitation');
    }
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  const handleAccount = () => {
    router.push('/account');
  };

  const handlePrivacy = () => {
    // TODO: Navigate to privacy settings
    console.log('Navigate to privacy settings');
  };

  const handleHelp = () => {
    // TODO: Navigate to help center
    console.log('Navigate to help center');
  };

  const handleAbout = () => {
    // TODO: Navigate to about
    console.log('Navigate to about');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.signOut();
              dispatch(setUnauthenticated());
              router.replace('/login');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <ProfileAvatar name={userName} size={100} />
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
        </View>

        {/* Received Invitations Section */}
        {receivedInvitations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Household Invitations</Text>
            {receivedInvitations.map((invitation) => (
              <View key={invitation.id} style={styles.receivedInvitationItem}>
                <View style={styles.receivedInvitationHeader}>
                  <ProfileAvatar name={invitation.invited_by?.name || 'User'} size={40} />
                  <View style={styles.receivedInvitationInfo}>
                    <Text style={styles.receivedInvitationTitle}>
                      {invitation.invited_by?.name || 'Someone'} invited you
                    </Text>
                    <Text style={styles.receivedInvitationSubtitle}>
                      Join their household to share shopping lists
                    </Text>
                  </View>
                </View>
                <View style={styles.invitationActions}>
                  <Pressable
                    style={styles.acceptButton}
                    onPress={() => handleAcceptInvitation(invitation.id)}
                  >
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rejectButton}
                    onPress={() => handleRejectInvitation(invitation.id)}
                  >
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Household Members Section */}
        {user?.household_id && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Household Members</Text>
              <Pressable
                style={styles.inviteButton}
                onPress={() => setShowInviteModal(true)}
              >
                <Text style={styles.inviteButtonText}>+ Invite</Text>
              </Pressable>
            </View>
            
            {loadingHousehold ? (
              <ActivityIndicator size="small" color="#4CAF50" style={{ marginVertical: 16 }} />
            ) : (
              <>
                {householdMembers.map((member) => (
                  <View key={member.id} style={styles.memberItem}>
                    <ProfileAvatar name={member.name} size={40} />
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberEmail}>{member.email}</Text>
                    </View>
                    {member.id === user.id && (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>You</Text>
                      </View>
                    )}
                  </View>
                ))}

                {sentInvitations.length > 0 && (
                  <>
                    <Text style={styles.invitationsTitle}>Pending Invitations</Text>
                    {sentInvitations.map((invitation) => (
                      <View key={invitation.id} style={styles.invitationItem}>
                        <View style={styles.invitationInfo}>
                          <Text style={styles.invitationName}>
                            {invitation.invited_user?.name || invitation.invited_user?.email}
                          </Text>
                          <Text style={styles.invitationStatus}>Pending</Text>
                        </View>
                        <Pressable
                          style={styles.cancelButton}
                          onPress={() => handleCancelInvitation(invitation.id)}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                      </View>
                    ))}
                  </>
                )}
              </>
            )}
          </View>
        )}

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <SettingsItem
            icon="🔔"
            title="Notifications"
            subtitle="Manage notification preferences"
            onPress={handleNotifications}
          />
          
          <SettingsItem
            icon="👤"
            title="Account"
            subtitle="Edit profile information"
            onPress={handleAccount}
          />
          
          <SettingsItem
            icon="🔒"
            title="Privacy & Security"
            subtitle="Control your privacy settings"
            onPress={handlePrivacy}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <SettingsItem
            icon="❓"
            title="Help Center"
            subtitle="FAQs and support"
            onPress={handleHelp}
          />
          
          <SettingsItem
            icon="ℹ️"
            title="About"
            subtitle="Version 1.0.0"
            onPress={handleAbout}
          />
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <SettingsItem
            icon="🚪"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            danger
          />
        </View>
      </ScrollView>

      {/* Invite Modal */}
      <Modal
        visible={showInviteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invite Member</Text>
              <Pressable onPress={() => setShowInviteModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or email..."
              value={searchTerm}
              onChangeText={handleSearchUsers}
              autoCapitalize="none"
            />

            {searching && (
              <ActivityIndicator size="small" color="#4CAF50" style={{ marginVertical: 16 }} />
            )}

            <ScrollView style={styles.searchResults}>
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <Pressable
                    key={result.id}
                    style={styles.searchResultItem}
                    onPress={() => handleSendInvitation(result.id)}
                  >
                    <ProfileAvatar name={result.name} size={40} />
                    <View style={styles.searchResultInfo}>
                      <Text style={styles.searchResultName}>{result.name}</Text>
                      <Text style={styles.searchResultEmail}>{result.email}</Text>
                    </View>
                    <Text style={styles.inviteText}>Invite</Text>
                  </Pressable>
                ))
              ) : searchTerm.length >= 2 && !searching ? (
                <Text style={styles.noResults}>No users found</Text>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    paddingLeft: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inviteButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  memberEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  youBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  youBadgeText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  invitationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  invitationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  invitationInfo: {
    flex: 1,
  },
  invitationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  invitationStatus: {
    fontSize: 12,
    color: '#FF9800',
    marginTop: 2,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  searchResults: {
    maxHeight: 400,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  searchResultEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  inviteText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  noResults: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
  receivedInvitationItem: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  receivedInvitationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  receivedInvitationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  receivedInvitationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  receivedInvitationSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  invitationActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  rejectButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
});
