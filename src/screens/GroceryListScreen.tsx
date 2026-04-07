import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  countRemainingGroceryItems,
  GroceryCategoryCard,
  groupGroceryItemsByCategory,
} from '@/src/components';
import { useMealPlanner } from '@/src/state';

export function GroceryListScreen() {
  const { groceryShortages, isLoading } = useMealPlanner();
  const remainingItemsCount = countRemainingGroceryItems(groceryShortages);
  const groupedItems = useMemo(() => groupGroceryItemsByCategory(groceryShortages), [groceryShortages]);
  const subtitle = `${remainingItemsCount} item${remainingItemsCount === 1 ? '' : 's'} to buy`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Shopping List</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.content}>
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
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
