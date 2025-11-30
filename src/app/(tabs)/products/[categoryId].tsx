import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { AddToCartModal } from '@/components/AddToCartModal';
import { ProductCard } from '@/components/ProductCard';
import { addToCart } from '@/store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Product } from '@/types';

export default function ProductsScreen() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const { categoryName } = useLocalSearchParams<{ categoryName: string }>();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleAddToCart = (quantity: number, unit: string) => {
    if (selectedProduct) {
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
