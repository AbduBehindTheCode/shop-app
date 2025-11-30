import { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { AddToCartModal } from '../../components/AddToCartModal';
import { ProductCard } from '../../components/ProductCard';
import { addToCart } from '../../store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Product } from '../../types';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleAddToCart = (quantity: number) => {
    if (selectedProduct) {
      dispatch(addToCart({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productImage: selectedProduct.image,
        quantity,
      }));
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
        <View style={styles.titleRow}>
          <Text style={styles.title}>Vegetables</Text>
          <Text style={styles.titleEmoji}>🥬</Text>
        </View>
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
    paddingTop: 50,
    paddingLeft: 20,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  titleEmoji: {
    fontSize: 28,
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
