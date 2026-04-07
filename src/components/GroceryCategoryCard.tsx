import { Text, View } from 'react-native';

import type { CategorizedItem, ItemCategory } from './mealModels';
import { GroceryItemRow } from './GroceryItemRow';
import { CardWrapper } from './CardWrapper';
import { COLORS } from '../constants/theme';
import { StyleSheet } from 'react-native';

type GroceryCategoryCardProps = {
  category: ItemCategory;
  items: CategorizedItem[];
  onDelete?: (itemId: string) => void;
  onToggle?: (itemId: string) => void;
  onUpdateCount?: (itemId: string) => void;
};

export function GroceryCategoryCard({
  category,
  items,
  onToggle,
  onDelete,
  onUpdateCount,
}: GroceryCategoryCardProps) {
  return (
    <CardWrapper>
      <Text style={styles.title}>{category}</Text>

      {items.length > 0 ? (
        <View style={styles.list}>
          {items.map((item) => (
            <GroceryItemRow
              key={item.id}
              item={item}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdateCount={onUpdateCount}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No items in this category.</Text>
      )}
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  list: {
    gap: 14,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
