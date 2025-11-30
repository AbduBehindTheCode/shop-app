import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { AddToCartModal } from '@/components/AddToCartModal';
import { ProductCard } from '@/components/ProductCard';
import { addToCart } from '@/store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Product } from '@/types';

export default function ProductsScreen() {
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector((state) => state.products.products);
  const { categoryId, categoryName } = useLocalSearchParams<{ categoryId: string; categoryName: string }>();
  const cartItems = useAppSelector((state: any) => state.cart.items);


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

  const handleAddToCart = (quantity: number, unit: string) => {
    if (selectedProduct) {
      // Check if product with same unit already exists in cart
      const existingItem = cartItems.find(
        (item: any) => item.productId === selectedProduct.id && item.unit === unit
      );

      if (existingItem) {
        Alert.alert(
          'Product Already in Cart',
          `${selectedProduct.name} (${unit}) is already in your cart with quantity ${existingItem.quantity}.`,
          [
            {
              text: 'View Cart',
              onPress: () => {
                setModalVisible(false);
                setSelectedProduct(null);
                router.push('/(tabs)/cart');
              }
            },
         
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      } else {
        dispatch(
          addToCart({
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            productImage: selectedProduct.image,
            quantity,
            unit
          })
        );
        setModalVisible(false);
        setSelectedProduct(null);
      }
    }
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
