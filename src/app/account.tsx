import { Button } from '@/components/ui/button';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { authService } from '@/services/auth.service';
import { useAppSelector } from '@/store/store';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AccountScreen() {
  const { user } = useAppSelector((state) => state.auth);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Load user data from Redux store
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone_number || '');
    }
  }, [user]);
  const handleSave = async () => {
    try {
      await authService.updateProfile({ name, email, phone_number: phone });
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    // Reset to original values from Redux store
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone_number || '');
    }
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    Alert.prompt(
      'Change Password',
      'Enter your new password (min 6 characters)',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: async (newPassword?: string) => {
            if (!newPassword || newPassword.length < 6) {
              Alert.alert('Error', 'Password must be at least 6 characters');
              return;
            }
            
            try {
              await authService.updatePassword(newPassword);
              Alert.alert('Success', 'Password updated successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to update password');
            }
          },
        },
      ],
      'secure-text'
    );
  };

  const handleDeleteAccount = () => {
    router.push('/delete-account');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Account</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
            <Text style={styles.editIcon}>{isEditing ? '✕' : '✏️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Avatar Section */}
        <View style={styles.avatarSection}>
          <ProfileAvatar name={name} size={100} />
          {/* {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          )} */}
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={name}
              onChangeText={setName}
              editable={isEditing}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={email}
              onChangeText={setEmail}
              editable={isEditing}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={phone}
              onChangeText={setPhone}
              editable={isEditing}
              placeholder="Enter your phone"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={handleCancel}
              style={{ flex: 1 }}
            />
            <Button
              title="Save Changes"
              variant="primary"
              onPress={handleSave}
              style={{ flex: 1 }}
            />
          </View>
        )}

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <Text style={styles.actionButtonText}>🔑 Change Password</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

  

          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDeleteAccount}
          >
            <Text style={[styles.actionButtonText, styles.dangerText]}>🗑️ Delete Account</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  backIcon: {
    fontSize: 32,
    color: '#333',
    fontWeight: '300',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: 4,
    width: 40,
    alignItems: 'flex-end',
  },
  editIcon: {
    fontSize: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  changePhotoButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  changePhotoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  inputDisabled: {
    backgroundColor: '#f8f9fa',
    color: '#666',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  actionArrow: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  dangerText: {
    color: '#ff3b30',
  },
});
