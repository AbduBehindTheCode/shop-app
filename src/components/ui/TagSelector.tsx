import { ProductTag } from '@/types';
import { PRODUCT_TAGS } from '@/utils/constants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TagSelectorProps {
  selectedTags: ProductTag[];
  onTagToggle: (tag: ProductTag) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagToggle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tags (Optional)</Text>
      <View style={styles.tagsContainer}>
        {PRODUCT_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag.id as ProductTag);
          return (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tag,
                isSelected && { backgroundColor: tag.color, borderColor: tag.color },
              ]}
              onPress={() => onTagToggle(tag.id as ProductTag)}
            >
              <Text style={styles.tagEmoji}>{tag.emoji}</Text>
              <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                {tag.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  tagEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  tagTextSelected: {
    color: '#fff',
  },
});
