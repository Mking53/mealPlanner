import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AddGroceryItemModal,
  countRemainingGroceryItems,
  EditItemCountModal,
  GROCERY_LIST_CATEGORIES,
  GroceryCategoryCard,
  groupGroceryItemsByCategory,
  type GroceryListCategory,
} from '@/src/components';
import { useMealPlanner } from '@/src/state';

export function GroceryListScreen() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftCount, setDraftCount] = useState('1');
  const [draftCategory, setDraftCategory] = useState<GroceryListCategory>(GROCERY_LIST_CATEGORIES[0]);
  const [editCountDraft, setEditCountDraft] = useState('1');
  const {
    addGroceryItem,
    groceryShortages,
    isLoading,
    removeGroceryItem,
    toggleGroceryItemBought,
    updateGroceryItemCount,
  } = useMealPlanner();
  const remainingItemsCount = countRemainingGroceryItems(groceryShortages);
  const groupedItems = useMemo(() => groupGroceryItemsByCategory(groceryShortages), [groceryShortages]);
  const subtitle = `${remainingItemsCount} item${remainingItemsCount === 1 ? '' : 's'} to buy`;

  function handleDeleteItem(itemId: string) {
    void removeGroceryItem(itemId);
  }

  function handleToggleBought(itemId: string) {
    void toggleGroceryItemBought(itemId);
  }

  function handleOpenEditCount(itemId: string) {
    const selectedItem = groceryShortages.find((item) => item.id === itemId);

    if (!selectedItem) {
      return;
    }

    setEditingItemId(itemId);
    setEditCountDraft(String(selectedItem.count));
  }

  function closeEditCountModal() {
    setEditingItemId(null);
    setEditCountDraft('1');
  }

  function handleSaveEditedCount() {
    if (editingItemId === null || !isValidCount(editCountDraft)) {
      return;
    }

    void updateGroceryItemCount(editingItemId, Number(editCountDraft));
    closeEditCountModal();
  }

  function closeAddModal() {
    setIsAddModalVisible(false);
    setDraftName('');
    setDraftCount('1');
    setDraftCategory(GROCERY_LIST_CATEGORIES[0]);
  }

  function handleSaveItem() {
    const trimmedName = draftName.trim();
    const nextCount = Number(draftCount);

    if (!trimmedName || !isValidCount(draftCount)) {
      return;
    }

    void addGroceryItem(trimmedName, draftCategory, nextCount);
    closeAddModal();
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Shopping List</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.content}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setIsAddModalVisible(true);
            }}
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}>
            <MaterialIcons name="add-shopping-cart" size={22} color="#2f7d32" />
            <Text style={styles.addButtonText}>Add Item</Text>
          </Pressable>

          {isLoading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#2f7d32" />
              <Text style={styles.loadingText}>Calculating ingredient shortages from your planned meals...</Text>
            </View>
          ) : (
            groupedItems.map((group) => (
              <GroceryCategoryCard
                key={group.category}
                category={group.category}
                items={group.items}
                onDelete={handleDeleteItem}
                onToggle={handleToggleBought}
                onUpdateCount={handleOpenEditCount}
              />
            ))
          )}
        </View>
      </ScrollView>

      <AddGroceryItemModal
        visible={isAddModalVisible}
        categories={GROCERY_LIST_CATEGORIES}
        draftCount={draftCount}
        draftName={draftName}
        draftCategory={draftCategory}
        isCountValid={isValidCount(draftCount)}
        onChangeCount={setDraftCount}
        onChangeName={setDraftName}
        onChangeCategory={setDraftCategory}
        onClose={closeAddModal}
        onSave={handleSaveItem}
      />

      <EditItemCountModal
        visible={editingItemId !== null}
        itemName={groceryShortages.find((item) => item.id === editingItemId)?.name ?? ''}
        draftCount={editCountDraft}
        isCountValid={isValidCount(editCountDraft)}
        onChangeCount={setEditCountDraft}
        onClose={closeEditCountModal}
        onSave={handleSaveEditedCount}
      />
    </SafeAreaView>
  );
}

function isValidCount(value: string) {
  return /^\d+$/.test(value.trim()) && Number(value.trim()) > 0;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f8f4',
  },
  scrollContent: {
    paddingBottom: 32,
    backgroundColor: '#f6f8f4',
  },
  header: {
    backgroundColor: '#2f7d32',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#184b1b',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#e5f5e4',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  addButton: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#2f7d32',
    backgroundColor: '#f7fbf7',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addButtonPressed: {
    opacity: 0.84,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2f7d32',
  },
  loadingCard: {
    minHeight: 220,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#587067',
    textAlign: 'center',
  },
});
