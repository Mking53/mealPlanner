import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemealdbRecipeCard } from '@/src/components';
import type {
  ThemealdbRecipeCategory,
  ThemealdbRecipeSummary,
  ThemealdbSearchMode,
} from '@/src/types';

type HomeRecipesScreenProps = {
  recipes: ThemealdbRecipeSummary[];
  categories: ThemealdbRecipeCategory[];
  errorMessage: string | null;
  isLoading: boolean;
  onAddToMealCards: (recipe: ThemealdbRecipeSummary) => void;
  onBack: () => void;
  onOpenCategoryPicker: () => void;
  onOpenRecipe: (recipe: ThemealdbRecipeSummary) => void;
  onOpenSearchModePicker: () => void;
  onRetry: () => void;
  onSearch: () => void;
  onSearchTermChange: (value: string) => void;
  savingRecipeId: string | null;
  searchMode: ThemealdbSearchMode;
  searchModeLabel: string;
  searchTerm: string;
  selectedCategory: string;
};

export function HomeRecipesScreen({
  recipes,
  errorMessage,
  isLoading,
  onAddToMealCards,
  onBack,
  onOpenCategoryPicker,
  onOpenRecipe,
  onOpenSearchModePicker,
  onRetry,
  onSearch,
  onSearchTermChange,
  savingRecipeId,
  searchMode,
  searchModeLabel,
  searchTerm,
  selectedCategory,
}: HomeRecipesScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              onPress={onBack}
              style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}>
              <MaterialIcons name="arrow-back" size={20} color="#173222" />
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>

            <View style={styles.headerCopy}>
              <Text style={styles.title}>All Recipes</Text>
              <Text style={styles.subtitle}>Browse the full recipe list from TheMealDB.</Text>
            </View>
          </View>

          <View style={styles.searchCard}>
            <Pressable
              accessibilityRole="button"
              onPress={onOpenSearchModePicker}
              style={({ pressed }) => [styles.selectorButton, pressed && styles.buttonPressed]}>
              <Text style={styles.selectorLabel}>Search Mode</Text>
              <Text style={styles.selectorValue}>{searchModeLabel}</Text>
            </Pressable>

            {searchMode === 'category' ? (
              <Pressable
                accessibilityRole="button"
                onPress={onOpenCategoryPicker}
                style={({ pressed }) => [styles.selectorButton, pressed && styles.buttonPressed]}>
                <Text style={styles.selectorLabel}>Category</Text>
                <Text style={styles.selectorValue}>{selectedCategory || 'Select a category'}</Text>
              </Pressable>
            ) : (
              <View style={styles.searchInputGroup}>
                <Text style={styles.selectorLabel}>{getInputLabel(searchMode)}</Text>
                <TextInput
                  autoCapitalize={searchMode === 'ingredient' ? 'none' : 'words'}
                  editable={!isLoading}
                  onChangeText={onSearchTermChange}
                  placeholder={getInputPlaceholder(searchMode)}
                  placeholderTextColor="#8a9399"
                  style={[styles.searchInput, isLoading && styles.searchInputDisabled]}
                  value={searchMode === 'firstLetter' ? searchTerm.slice(0, 1) : searchTerm}
                />
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              disabled={isLoading}
              onPress={onSearch}
              style={({ pressed }) => [
                styles.searchButton,
                isLoading && styles.searchButtonDisabled,
                pressed && !isLoading && styles.buttonPressed,
              ]}>
              <Text style={styles.searchButtonText}>{isLoading ? 'Searching...' : 'Search Recipes'}</Text>
            </Pressable>
          </View>

          {errorMessage ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateTitle}>Recipe service unavailable</Text>
              <Text style={styles.stateCopy}>{errorMessage}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={onRetry}
                style={({ pressed }) => [styles.retryButton, pressed && styles.buttonPressed]}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </Pressable>
            </View>
          ) : null}

          {isLoading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#2f7d32" />
              <Text style={styles.loadingText}>Fetching recipes from TheMealDB...</Text>
            </View>
          ) : recipes.length > 0 ? (
            <View style={styles.recipeList}>
              {recipes.map((recipe) => (
                <ThemealdbRecipeCard
                  key={recipe.id}
                  isSavingToMealCards={savingRecipeId === recipe.id}
                  onAddToMealCards={onAddToMealCards}
                  onPress={onOpenRecipe}
                  recipe={recipe}
                />
              ))}
            </View>
          ) : (
            <View style={styles.stateCard}>
              <Text style={styles.stateTitle}>No recipes found</Text>
              <Text style={styles.stateCopy}>
                Try a different {searchMode === 'category' ? 'category' : 'search term'}.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getInputLabel(mode: ThemealdbSearchMode) {
  switch (mode) {
    case 'name':
      return 'Meal Name';
    case 'firstLetter':
      return 'First Letter';
    case 'ingredient':
      return 'Main Ingredient';
    default:
      return 'Search';
  }
}

function getInputPlaceholder(mode: ThemealdbSearchMode) {
  switch (mode) {
    case 'name':
      return 'Search for Arrabiata';
    case 'firstLetter':
      return 'Enter one letter';
    case 'ingredient':
      return 'Search for chicken_breast';
    default:
      return 'Search recipes';
  }
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 16,
  },
  header: {
    gap: 14,
  },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 40,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#173222',
  },
  headerCopy: {
    gap: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#173222',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5b6c61',
  },
  searchCard: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 18,
    gap: 14,
  },
  selectorButton: {
    borderWidth: 1,
    borderColor: '#d7dfda',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 6,
    backgroundColor: '#f8fbf7',
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#587067',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  selectorValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#173222',
  },
  searchInputGroup: {
    gap: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d7dfda',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: '#173222',
    backgroundColor: '#ffffff',
  },
  searchInputDisabled: {
    backgroundColor: '#f3f5f3',
    color: '#8a9399',
  },
  searchButton: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#2f7d32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  searchButtonDisabled: {
    backgroundColor: '#8eb591',
  },
  loadingCard: {
    minHeight: 180,
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
  stateCard: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 10,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#173222',
  },
  stateCopy: {
    fontSize: 14,
    lineHeight: 20,
    color: '#587067',
  },
  retryButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#edf6ed',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#27502a',
  },
  recipeList: {
    gap: 16,
  },
  buttonPressed: {
    opacity: 0.84,
  },
});
