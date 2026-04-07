import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CategorizedItem, KitchenItem } from './mealModels';

type GroceryItemRowProps = {
  item: CategorizedItem;
  onDelete?: (itemId: string) => void;
  onToggle?: (itemId: string) => void;
  onUpdateCount?: (itemId: string) => void;
};

export function GroceryItemRow({ item, onToggle, onDelete, onUpdateCount }: GroceryItemRowProps) {
  const isKitchenItem = 'freeCount' in item;

  return (
    <View style={styles.row}>
      {onToggle ? (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.isBought }}
          onPress={() => {
            onToggle(item.id);
          }}
          style={[styles.checkbox, item.isBought && styles.checkboxChecked]}>
          {item.isBought ? <MaterialIcons name="check" size={18} color="#ffffff" /> : null}
        </Pressable>
      ) : null}

      <Text style={[styles.itemName, item.isBought && styles.itemNameBought]}>{item.name}</Text>

      {isKitchenItem ? (
        <View style={styles.kitchenCounts}>
          <Pressable
            accessibilityLabel={`Edit free count for ${item.name}`}
            accessibilityRole="button"
            disabled={!onUpdateCount}
            onPress={() => {
              onUpdateCount?.(item.id);
            }}
            style={({ pressed }) => [styles.countButton, pressed && styles.countButtonPressed]}>
            <Text style={styles.countText}>{(item as KitchenItem).freeCount}</Text>
            <Text style={styles.countLabel}>Free</Text>
          </Pressable>

          <View style={styles.allocatedPill}>
            <Text style={styles.allocatedText}>{(item as KitchenItem).allocatedCount}</Text>
            <Text style={styles.countLabel}>Allocated</Text>
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityLabel={`Edit count for ${item.name}`}
          accessibilityRole="button"
          disabled={!onUpdateCount}
          onPress={() => {
            onUpdateCount?.(item.id);
          }}
          style={({ pressed }) => [styles.countButton, pressed && styles.countButtonPressed]}>
          <Text style={styles.countText}>{item.count}</Text>
        </Pressable>
      )}

      {onDelete ? (
        <Pressable
          accessibilityLabel={`Delete ${item.name}`}
          accessibilityRole="button"
          onPress={() => {
            onDelete(item.id);
          }}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}>
          <MaterialIcons name="delete-outline" size={22} color="#5f6b65" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#203028',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    borderColor: '#2c6bed',
    backgroundColor: '#2c6bed',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: '#13222a',
  },
  itemNameBought: {
    color: '#8a9399',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonPressed: {
    backgroundColor: '#eef1ef',
  },
  countButton: {
    minWidth: 38,
    height: 34,
    borderRadius: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef2ef',
  },
  countButtonPressed: {
    opacity: 0.84,
  },
  countText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#173222',
  },
  countLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#587067',
    textTransform: 'uppercase',
  },
  kitchenCounts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  allocatedPill: {
    minWidth: 54,
    height: 34,
    borderRadius: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dcefd8',
  },
  allocatedText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#173222',
  },
});
