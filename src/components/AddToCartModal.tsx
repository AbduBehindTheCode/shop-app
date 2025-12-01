import { useAppSelector } from '@/store/store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Product, ProductTag, UnitType } from '../types';
import { UNITS } from '../utils/constants';
import { Button } from './ui/button';
import { TagSelector } from './ui/TagSelector';

interface AddToCartModalProps {
  visible: boolean;
  product: Product | null;
  onAdd: (quantity: number, unit: string, tags: ProductTag[]) => void;
  onCancel: () => void;
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({
  visible,
  product,
  onAdd,
  onCancel,
}) => {
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  
  const [quantity, setQuantity] = useState('1');
  const [selectedUnit, setSelectedUnit] = useState<UnitType>('piece');
  const [selectedTags, setSelectedTags] = useState<ProductTag[]>([]);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const handleAdd = () => {
    const qty = parseInt(quantity, 10);
    if (!isNaN(qty) && qty > 0 && product) {
      // Check if product already exists in cart (any unit)
      const productExistsWithDifferentUnit = cartItems.find(
        item => item.productId === product.id && item.unit !== selectedUnit
      );

      if (productExistsWithDifferentUnit) {
        Alert.alert(
          'Product in Cart',
          `${product.name} is already in your cart with ${productExistsWithDifferentUnit.quantity} ${productExistsWithDifferentUnit.unit}. Please remove it first or update the quantity in cart.`,
          [
            {
              text: 'View Cart',
              onPress: () => {
                handleCancel();
                router.push('/(tabs)/cart');
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        return;
      }

      onAdd(qty, selectedUnit, selectedTags);
      setQuantity('1');
      setSelectedUnit('piece');
      setSelectedTags([]);
    }
  };

  const handleCancel = () => {
    setQuantity('1');
    setSelectedUnit('piece');
    setSelectedTags([]);
    setShowUnitDropdown(false);
    onCancel();
  };

  const handleUnitSelect = (unit: UnitType) => {
    setSelectedUnit(unit);
    setShowUnitDropdown(false);
  };

  const handleTagToggle = (tag: ProductTag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
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
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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

            <TagSelector 
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={handleCancel}
                style={{ flex: 1 }}
              />
              
              <Button
                title="Add"
                variant="primary"
                onPress={handleAdd}
                style={{ flex: 1 }}
              />
            </View>
          </View>
          </ScrollView>
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
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  scrollView: {
    maxHeight: '100%',
  },
  modalContent: {
    padding: 24,
  },
  productImage: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
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
});
