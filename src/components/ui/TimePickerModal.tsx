import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Button } from './button';

interface TimePickerModalProps {
  visible: boolean;
  time: string; // Format: "HH:MM"
  onConfirm: (time: string) => void;
  onCancel: () => void;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  time,
  onConfirm,
  onCancel,
}) => {
  const parseTime = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [hours, setHours] = useState(parseTime(time).getHours());
  const [minutes, setMinutes] = useState(parseTime(time).getMinutes());

  const handleConfirm = () => {
    const newTime = new Date();
    newTime.setHours(hours, minutes, 0, 0);
    onConfirm(formatTime(newTime));
  };

  const incrementHours = () => setHours((h) => (h + 1) % 24);
  const decrementHours = () => setHours((h) => (h - 1 + 24) % 24);
  const incrementMinutes = () => setMinutes((m) => (m + 5) % 60);
  const decrementMinutes = () => setMinutes((m) => (m - 5 + 60) % 60);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Time</Text>
          
          <View style={styles.timePickerContainer}>
            {/* Hours Picker */}
            <View style={styles.timeColumn}>
              <Text style={styles.timeButton} onPress={incrementHours}>▲</Text>
              <Text style={styles.timeValue}>{hours.toString().padStart(2, '0')}</Text>
              <Text style={styles.timeButton} onPress={decrementHours}>▼</Text>
            </View>
            
            <Text style={styles.timeSeparator}>:</Text>
            
            {/* Minutes Picker */}
            <View style={styles.timeColumn}>
              <Text style={styles.timeButton} onPress={incrementMinutes}>▲</Text>
              <Text style={styles.timeValue}>{minutes.toString().padStart(2, '0')}</Text>
              <Text style={styles.timeButton} onPress={decrementMinutes}>▼</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={onCancel}
              style={{ flex: 1 }}
            />
            
            <Button
              title="Confirm"
              variant="primary"
              onPress={handleConfirm}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
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
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  timeColumn: {
    alignItems: 'center',
  },
  timeButton: {
    fontSize: 24,
    color: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  timeValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  timeSeparator: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});
