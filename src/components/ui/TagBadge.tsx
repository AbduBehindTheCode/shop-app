import { ProductTag } from '@/types';
import { PRODUCT_TAGS } from '@/utils/constants';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TagBadgeProps {
  tag: ProductTag;
  small?: boolean;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, small = false }) => {
  const tagConfig = PRODUCT_TAGS.find(t => t.id === tag);
  
  if (!tagConfig) return null;

  return (
    <View style={[styles.badge, { backgroundColor: tagConfig.color }, small && styles.badgeSmall]}>
      <Text style={[styles.emoji, small && styles.emojiSmall]}>{tagConfig.emoji}</Text>
      <Text style={[styles.label, small && styles.labelSmall]}>{tagConfig.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  badgeSmall: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  emoji: {
    fontSize: 12,
    marginRight: 3,
  },
  emojiSmall: {
    fontSize: 10,
    marginRight: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  labelSmall: {
    fontSize: 9,
  },
});
