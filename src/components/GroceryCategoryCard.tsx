import { StyleSheet, Text, View } from 'react-native';

import type { CategorizedItem, ItemCategory } from './mealModels';
import { GroceryItemRow } from './GroceryItemRow';

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
    <View style={styles.card}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 14,
    shadowColor: '#18301e',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#173222',
  },
  list: {
    gap: 14,
  },
  emptyText: {
    fontSize: 14,
    color: '#7a8480',
  },
});
