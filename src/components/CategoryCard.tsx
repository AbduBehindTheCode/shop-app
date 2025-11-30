import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
}

export const CategoryCard = ({ category, onPress }: CategoryCardProps) => {
  return (
    <Pressable onPress={() => onPress(category)} style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={category.icon as any}
          size={48}
          color={category.color}
        />
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 140,
  },
  iconContainer: {
    marginBottom: 12,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
