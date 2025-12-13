import { authService } from '@/services/auth.service';
import { emailService } from '@/services/email.service';
import { useAppSelector } from '@/store/store';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export const screenOptions = {
  headerShown: true,
};

export default function DeleteAccountScreen() {
  const { user } = useAppSelector((state) => state.auth);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dataToDelete = [
    { icon: '👤', label: 'First Name' },
    { icon: '👤', label: 'Last Name' },
    { icon: '📱', label: 'Phone Number' },
    { icon: '🏠', label: 'Address' },
    { icon: '🗂️', label: 'All Personal Data' },
  ];

  const handleDeleteRequest = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDeletion = async () => {
    setIsLoading(true);
    try {
      // Send email notification
      if (user?.email) {
        await emailService.sendAccountDeletionEmail(user.email);
      }

      setShowConfirmModal(false);
      Alert.alert(
        'Deletion Request Submitted',
        'Your account deletion request has been submitted. We will process it within 48 hours. You will receive a confirmation email once your account is permanently deleted.',
        [
          {
            text: 'OK',
            onPress: async () => {
              // Sign out user
              await authService.signOut();
              router.replace('/login');
            },
          },
        ]
      );
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert(
        'Error',
        error.message || 'Failed to submit deletion request. Please try again.'
      );
    }
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Delete Account</Text>
          <View style={styles.editButton} />
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {/* Warning Banner */}
          <View style={styles.warningBanner}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Account Deletion Request</Text>
              <Text style={styles.warningSubtitle}>
                This action cannot be undone
              </Text>
            </View>
          </View>

          {/* Timeline Card */}
          <View style={styles.timelineCard}>
            <Text style={styles.timelineIcon}>⏱️</Text>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Processing Time</Text>
              <Text style={styles.timelineText}>
                Your deletion request will be processed within 48 hours
              </Text>
            </View>
          </View>

          {/* Data Deletion Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data That Will Be Deleted</Text>
            <View style={styles.dataList}>
              {dataToDelete.map((item, index) => (
                <View key={index} style={styles.dataItem}>
                  <Text style={styles.dataIcon}>{item.icon}</Text>
                  <Text style={styles.dataLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Info Text */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Once you submit the deletion request, you will not be able to recover your account or any of its data. A confirmation email will be sent to your registered email address.
            </Text>
          </View>
        </View>

        {/* Delete Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteRequest}
          >
            <Text style={styles.deleteButtonText}>Request Account Deletion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>🗑️</Text>
            
            <Text style={styles.modalTitle}>Are you sure?</Text>
            
            <Text style={styles.modalMessage}>
              This will permanently delete your account and all associated data. This action cannot be undone.
            </Text>
            
            <View style={styles.warningList}>
              <View style={styles.warningItem}>
                <Text style={styles.warningDot}>•</Text>
                <Text style={styles.warningItemText}>All data will be deleted within 48 hours</Text>
              </View>
              <View style={styles.warningItem}>
                <Text style={styles.warningDot}>•</Text>
                <Text style={styles.warningItemText}>You cannot undo this action</Text>
              </View>
              <View style={styles.warningItem}>
                <Text style={styles.warningDot}>•</Text>
                <Text style={styles.warningItemText}>You will be logged out immediately</Text>
              </View>
            </View>

            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleCancelModal}
                disabled={isLoading}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalConfirmButton, isLoading && styles.modalConfirmButtonDisabled]}
                onPress={handleConfirmDeletion}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalConfirmText}>Confirm Deletion</Text>
                )}
              </TouchableOpacity>
            </View>
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
    paddingBottom: 120,
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
    width: 40,
  },
  contentArea: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  warningBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  warningSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  timelineCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  timelineIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  timelineText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  dataList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dataIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  dataLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#E8F4F8',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#0D47A1',
    lineHeight: 18,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  warningList: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    width: '100%',
  },
  warningItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  warningDot: {
    color: '#FF9800',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  warningItemText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    lineHeight: 18,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmButtonDisabled: {
    opacity: 0.6,
  },
  modalConfirmText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
