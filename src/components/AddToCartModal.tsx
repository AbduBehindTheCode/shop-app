import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Product, UnitType } from '../types';

interface AddToCartModalProps {
  visible: boolean;
  product: Product | null;
  onAdd: (quantity: number, unit: string) => void;
  onCancel: () => void;
}

const UNITS: UnitType[] = ['piece', 'kg', 'gram', 'liter', 'pack'];

export const AddToCartModal: React.FC<AddToCartModalProps> = ({
  visible,
  product,
  onAdd,
  onCancel,
}) => {
  const [quantity, setQuantity] = useState('1');
  const [selectedUnit, setSelectedUnit] = useState<UnitType>('piece');
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const handleAdd = () => {
    const qty = parseInt(quantity, 10);
    if (!isNaN(qty) && qty > 0) {
      onAdd(qty, selectedUnit);
      setQuantity('1'); // Reset quantity
      setSelectedUnit('piece'); // Reset unit
    }
  };

  const handleCancel = () => {
    setQuantity('1'); // Reset quantity
    setSelectedUnit('piece'); // Reset unit
    setShowUnitDropdown(false);
    onCancel();
  };

  const handleUnitSelect = (unit: UnitType) => {
    setSelectedUnit(unit);
    setShowUnitDropdown(false);
  };

  if (!product) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.productImage}>{product.image}</Text>
            <Text style={styles.productName}>{product.name}</Text>
            
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="1"
              />
              
              <TouchableOpacity 
                style={styles.unitSelector}
                onPress={() => setShowUnitDropdown(!showUnitDropdown)}
              >
                <Text style={styles.unitText}>{selectedUnit}</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
            </View>

            {showUnitDropdown && (
              <View style={styles.dropdown}>
                {UNITS.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.dropdownItem,
                      selectedUnit === unit && styles.dropdownItemSelected
                    ]}
                    onPress={() => handleUnitSelect(unit)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedUnit === unit && styles.dropdownItemTextSelected
                    ]}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleAdd}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  productImage: {
    fontSize: 64,
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 10,
    color: '#666',
  },
  dropdown: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#e3f2fd',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: '#007AFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
