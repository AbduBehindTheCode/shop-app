import { Button } from '@/components/ui/button';
import { TagBadge } from '@/components/ui/TagBadge';
import { TagSelector } from '@/components/ui/TagSelector';
import { NotificationService } from '@/services/notificationService';
import { ProductTag } from '@/types';
import { useState } from 'react';
import { FlatList, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { removeFromCart, updateQuantity, updateTags } from '../../store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export default function CartScreen() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const notificationPreferences = useAppSelector((state) => state.notifications.preferences);
  
  const [editingTags, setEditingTags] = useState<{ productId: string; unit: string } | null>(null);
  const [tempTags, setTempTags] = useState<ProductTag[]>([]);

  const handleRemove = (productId: string, unit: string) => {
    const item = cartItems.find(i => i.productId === productId && i.unit === unit);
    dispatch(removeFromCart({ productId, unit }));
    
    // Send push notification if enabled
    if (notificationPreferences.cartRemoveItemEnabled && item) {
      NotificationService.notifyItemRemoved(item.productName);
    }
  };

  const handleQuantityChange = (productId: string, unit: string, delta: number) => {
    const item = cartItems.find(i => i.productId === productId && i.unit === unit);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        dispatch(updateQuantity({ productId, unit, quantity: newQuantity }));
        
        // Send push notification if enabled
        if (notificationPreferences.cartUpdateItemEnabled) {
          NotificationService.notifyItemUpdated(item.productName, newQuantity, unit);
        }
      }
    }
  };

  const handleEditTags = (productId: string, unit: string, currentTags: ProductTag[]) => {
    setEditingTags({ productId, unit });
    setTempTags(currentTags);
  };

  const handleSaveTags = () => {
    if (editingTags) {
      dispatch(updateTags({ 
        productId: editingTags.productId, 
        unit: editingTags.unit, 
        tags: tempTags 
      }));
      setEditingTags(null);
      setTempTags([]);
    }
  };

  const handleCancelEditTags = () => {
    setEditingTags(null);
    setTempTags([]);
  };

  const handleTagToggle = (tag: ProductTag) => {
    setTempTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Add some products to get started</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Cart</Text>
          <Text style={styles.titleEmoji}>🛒</Text>
        </View>
        <Text style={styles.itemCount}>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</Text>
      </View>
      
      <FlatList
        data={cartItems}
        keyExtractor={(item) => `${item.productId}-${item.unit}`}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.topRow}>
              <View style={styles.itemHeader}>
                <Text style={styles.productImage}>{item.productImage}</Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.productName}>{item.productName}</Text>
                  <Text style={styles.quantity}>{item.quantity} {item.unit}</Text>
                  
                  {item.tags && item.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                      {item.tags.map(tag => (
                        <TagBadge key={tag} tag={tag} small />
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <Button
                title="Remove"
                variant="danger"
                onPress={() => handleRemove(item.productId, item.unit)}
                style={styles.removeButton}
              />
            </View>

            <View style={styles.actions}>
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item.productId, item.unit, -1)}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{item.quantity}</Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item.productId, item.unit, 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.editTagsButton}
                onPress={() => handleEditTags(item.productId, item.unit, item.tags || [])}
              >
                <Text style={styles.editTagsButtonText}>🏷️ Edit Tags</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        visible={!!editingTags}
        transparent
        animationType="fade"
        onRequestClose={handleCancelEditTags}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Tags</Text>
                
                <TagSelector 
                  selectedTags={tempTags}
                  onTagToggle={handleTagToggle}
                />

                <View style={styles.modalButtons}>
                  <Button
                    title="Cancel"
                    variant="secondary"
                    onPress={handleCancelEditTags}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Save"
                    variant="primary"
                    onPress={handleSaveTags}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
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
  header: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  titleEmoji: {
    fontSize: 28,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  productImage: {
    fontSize: 48,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 6,
  },
  quantityButton: {
    width: 36,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#007AFF',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    minWidth: 40,
    textAlign: 'center',
  },
  editTagsButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
  },
  editTagsButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    minWidth: 90,
    alignSelf: 'flex-start',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalScroll: {
    maxHeight: '100%',
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
});
