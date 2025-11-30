import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { Category, CategoryCard } from '@/components/CategoryCard';
import { CATEGORIES } from '@/utils/categories';

export default function CategoriesScreen() {
  const handleCategoryPress = (category: Category) => {
    // Navigate to category products screen (you can implement this later)
    console.log('Selected category:', category.name);
  };

  const renderCategoryCard = ({ item }: { item: Category }) => (
    <CategoryCard category={item} onPress={handleCategoryPress} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
      </View>
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        scrollEnabled
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
});
