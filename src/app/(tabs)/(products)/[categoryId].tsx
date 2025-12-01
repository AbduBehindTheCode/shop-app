import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { AddToCartModal } from '@/components/AddToCartModal';
import { ProductCard } from '@/components/ProductCard';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { NotificationService } from '@/services/notificationService';
import { addToCart } from '@/store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Product, ProductTag } from '@/types';

export default function ProductsScreen() {
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector((state) => state.products.products);
  const { categoryId, categoryName } = useLocalSearchParams<{ categoryId: string; categoryName: string }>();
  const cartItems = useAppSelector((state: any) => state.cart.items);
  const notificationPreferences = useAppSelector((state) => state.notifications.preferences);
  const { toast, showToast, hideToast } = useToast();


  // Map category IDs to categories
  const getCategoryType = (id: string) => {
    switch (id) {
      case '1':
        return 'vegetable';
      case '2':
        return 'supermarket';
      case '3':
        return 'cleaning';
      case '4':
        return 'meat';
      default:
        return null;
    }
  };

  // Filter products by category
  const categoryType = getCategoryType(categoryId);
  const products = categoryType ? allProducts.filter((p) => p.category === categoryType) : allProducts;
  const router = useRouter();


  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleAddToCart = (quantity: number, unit: string, tags: ProductTag[]) => {
    if (!selectedProduct) return;

    // Check if product exists in cart (any unit)
    const productExistsInCart = cartItems.find(
      (item: any) => item.productId === selectedProduct.id
    );

    if (productExistsInCart) {
      Alert.alert(
        'Product in Cart',
        `${selectedProduct.name} is already in your cart`,
        [
          {
            text: 'View Cart',
            onPress: () => {
              setModalVisible(false);
              router.push('/(tabs)/cart');
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    // Add to cart
    dispatch(addToCart({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productImage: selectedProduct.image,
      quantity,
      unit,
      tags,
    }));

    // Send push notification if enabled
    if (notificationPreferences.cartAddItemEnabled) {
      NotificationService.notifyItemAdded(selectedProduct.name, quantity, unit);
    }

    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{categoryName || 'Products'}</Text>
        <Text style={styles.subtitle}>Select products to add to cart</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <View style={styles.productWrapper}>
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item)}
            />
          </View>
        )}
      />

      <AddToCartModal
        visible={modalVisible}
        product={selectedProduct}
        onAdd={handleAddToCart}
        onCancel={handleCancel}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
        actionText={toast.actionText}
        onActionPress={toast.onActionPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 16,
    paddingLeft: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  gridContainer: {
    padding: 12,
  },
  productWrapper: {
    flex: 1,
    maxWidth: '50%',
  },
});
