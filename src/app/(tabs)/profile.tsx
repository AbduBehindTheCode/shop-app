import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { SettingsItem } from '@/components/ui/SettingsItem';
import { authService } from '@/services/auth.service';
import { setUnauthenticated } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';

export default function ProfileScreen() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [userName] = useState(user?.name || 'User');

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
});
