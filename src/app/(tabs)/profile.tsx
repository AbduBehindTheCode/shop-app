import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { SettingsItem } from '@/components/ui/SettingsItem';

export default function ProfileScreen() {
  const [userName] = useState('John Doe');

  const handleNotifications = () => {
    router.push('/notifications');
  };

  const handleAccount = () => {
    // TODO: Navigate to account settings
    console.log('Navigate to account settings');
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <ProfileAvatar name={userName} size={100} />
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>johndoe@example.com</Text>
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
