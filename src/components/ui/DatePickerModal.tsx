import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from './button';

interface DatePickerModalProps {
  visible: boolean;
  date: string | null; // Format: "YYYY-MM-DD"
  onConfirm: (date: string) => void;
  onCancel: () => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  date,
  onConfirm,
  onCancel,
}) => {
  const parseDate = (dateString: string | null): Date => {
    return dateString ? new Date(dateString) : new Date();
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<Date>(parseDate(date));

  const handleConfirm = () => {
    onConfirm(formatDate(selectedDate));
  };

  const incrementDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const decrementDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const incrementMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const decrementMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const incrementYear = () => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newDate.getFullYear() + 1);
    setSelectedDate(newDate);
  };

  const decrementYear = () => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newDate.getFullYear() - 1);
    setSelectedDate(newDate);
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Sale Date</Text>
          
          <View style={styles.datePickerContainer}>
            {/* Month Picker */}
            <View style={styles.dateColumn}>
              <TouchableOpacity onPress={incrementMonth}>
                <Text style={styles.dateButton}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.dateValue}>{monthNames[selectedDate.getMonth()]}</Text>
              <TouchableOpacity onPress={decrementMonth}>
                <Text style={styles.dateButton}>▼</Text>
              </TouchableOpacity>
            </View>
            
            {/* Day Picker */}
            <View style={styles.dateColumn}>
              <TouchableOpacity onPress={incrementDay}>
                <Text style={styles.dateButton}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.dateValue}>{selectedDate.getDate()}</Text>
              <TouchableOpacity onPress={decrementDay}>
                <Text style={styles.dateButton}>▼</Text>
              </TouchableOpacity>
            </View>
            
            {/* Year Picker */}
            <View style={styles.dateColumn}>
              <TouchableOpacity onPress={incrementYear}>
                <Text style={styles.dateButton}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.dateValue}>{selectedDate.getFullYear()}</Text>
              <TouchableOpacity onPress={decrementYear}>
                <Text style={styles.dateButton}>▼</Text>
              </TouchableOpacity>
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
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    gap: 16,
  },
  dateColumn: {
    alignItems: 'center',
    minWidth: 80,
  },
  dateButton: {
    fontSize: 24,
    color: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  dateValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});
