import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { AddToCartModal } from '@/components/AddToCartModal';
import { ProductCard } from '@/components/ProductCard';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { NotificationService } from '@/services/notificationService';
import { productsService } from '@/services/products.service';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { addToCart } from '@/store/thunks/cartThunks';
import { Product, ProductTag } from '@/types';

export default function ProductsScreen() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const { categoryId, categoryName } = useLocalSearchParams<{ categoryId: string; categoryName: string }>();
  const cartItems = useAppSelector((state: any) => state.cart.items);
  const notificationPreferences = useAppSelector((state) => state.notifications.preferences);
  const { toast, showToast, hideToast } = useToast();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch products by category
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!categoryId || !categories.length) return;

      try {
        setLoading(true);
        // Find the actual category from Redux to get its real UUID
        const category = categories.find(cat => cat.id === categoryId);
        if (!category) {
          console.error('Category not found');
          return;
        }
        
        // Use the category's UUID to query products
        const data = await productsService.getProductsByCategory(category.id);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId, categories]);


  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleAddToCart = (quantity: number, unit: string, tags: ProductTag[]) => {
    if (!selectedProduct) return;

    // Check if product exists in cart
    const productExistsInCart = cartItems.find(
      (item: any) => item.product_id === selectedProduct.id
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

    // Add to cart using new thunk
    dispatch(addToCart(selectedProduct.id, quantity, tags) as any);

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
