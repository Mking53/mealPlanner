import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AddMealModal,
  createBlankMealIngredients,
  createMealIngredient,
  DayMealCard,
  formatDateInputValue,
  formatFullDateLabel,
  formatWeekRange,
  getAvailableMealIngredientNames,
  getDateKeyFromDateInput,
  getIngredientInputCount,
  getIngredientInputName,
  isValidIngredientCount,
  MealCardNamePromptModal,
  MealDetailModal,
  parseDateInputValue,
  removeMealIngredient,
  SelectableListModal,
  ThemealdbRecipeCard,
  ThemealdbRecipeDetailModal,
  upsertMealIngredient,
  type MealIngredient,
  type MealType,
  type PlannerGroup,
  type SavedMealCard,
} from '@/src/components';
import { ApiError, api, themealdbApi } from '@/src/api';
import { useMealPlanner } from '@/src/state';
import {
  THEMEALDB_SEARCH_MODE_OPTIONS,
  getThemealdbSearchModeLabel,
  type ThemealdbRecipeCategory,
  type ThemealdbRecipeDetail,
  type ThemealdbRecipeSummary,
  type ThemealdbSearchMode,
} from '@/src/types';
import {
  createMealCardInputFromMeal,
  createMealDraftFromSavedMealCard,
  mapApiMealCardsToSavedMealCards,
} from '@/src/utils/savedMealCards';
import { HomeRecipesScreen } from './HomeRecipesScreen';
import { getMealCardNameConflictMessage, isMealCardNameConflictError } from '@/src/utils/mealCardErrors';

const DEFAULT_THEMEALDB_CATEGORY = 'Beef';
const HOME_RECIPE_PREVIEW_COUNT = 5;

type MealCardCreateDraft = {
  ingredients: string[];
  imageUrl?: string;
  mealType: MealType;
  name: string;
  nutritionalBreakdown?: string;
  recipe?: string;
  sourceKey: string;
  successMessage: string;
};

export function HomeScreen() {
  const [originDayKey, setOriginDayKey] = useState<string | null>(null);
  const [pendingDayKey, setPendingDayKey] = useState<string | null>(null);
  const [draftDayKey, setDraftDayKey] = useState<string | null>(null);
  const [draftDate, setDraftDate] = useState('');
  const [draftName, setDraftName] = useState('');
  const [draftType, setDraftType] = useState<MealType | ''>('');
  const [draftRecipe, setDraftRecipe] = useState('');
  const [draftIngredients, setDraftIngredients] = useState<MealIngredient[]>(createBlankMealIngredients);
  const [draftIngredientName, setDraftIngredientName] = useState('');
  const [draftIngredientCount, setDraftIngredientCount] = useState('1');
  const [editingIngredientIndex, setEditingIngredientIndex] = useState<number | null>(null);
  const [draftNutritionalBreakdown, setDraftNutritionalBreakdown] = useState('');
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [selectedMealCardId, setSelectedMealCardId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [savedMealCards, setSavedMealCards] = useState<SavedMealCard[]>([]);
  const [availableGroups, setAvailableGroups] = useState<PlannerGroup[]>([]);
  const [isSavingMealCard, setIsSavingMealCard] = useState(false);
  const [themealdbRecipes, setThemealdbRecipes] = useState<ThemealdbRecipeSummary[]>([]);
  const [themealdbCategories, setThemealdbCategories] = useState<ThemealdbRecipeCategory[]>([]);
  const [themealdbSearchMode, setThemealdbSearchMode] = useState<ThemealdbSearchMode>('category');
  const [themealdbSearchTerm, setThemealdbSearchTerm] = useState('');
  const [selectedThemealdbCategory, setSelectedThemealdbCategory] = useState(DEFAULT_THEMEALDB_CATEGORY);
  const [isThemealdbLoading, setIsThemealdbLoading] = useState(false);
  const [themealdbErrorMessage, setThemealdbErrorMessage] = useState<string | null>(null);
  const [isSearchModeModalVisible, setIsSearchModeModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isViewingAllRecipes, setIsViewingAllRecipes] = useState(false);
  const [selectedThemealdbRecipeId, setSelectedThemealdbRecipeId] = useState<string | null>(null);
  const [selectedThemealdbRecipe, setSelectedThemealdbRecipe] = useState<ThemealdbRecipeDetail | null>(null);
  const [isThemealdbRecipeLoading, setIsThemealdbRecipeLoading] = useState(false);
  const [themealdbRecipeErrorMessage, setThemealdbRecipeErrorMessage] = useState<string | null>(null);
  const [savingThemealdbRecipeId, setSavingThemealdbRecipeId] = useState<string | null>(null);
  const [pendingMealCardDraft, setPendingMealCardDraft] = useState<MealCardCreateDraft | null>(null);
  const [mealCardNamePromptValue, setMealCardNamePromptValue] = useState('');
  const [mealCardNamePromptError, setMealCardNamePromptError] = useState<string | null>(null);
  const { addMeal, isLoading, kitchenInventory, nextThreeDays, setMealMade, updateMealInState } = useMealPlanner();
  const selectedMeal = selectedMealId ? updateMealInState(selectedMealId) : null;
  const previewThemealdbRecipes = themealdbRecipes.slice(0, HOME_RECIPE_PREVIEW_COUNT);
  const availableIngredientNames = useMemo(
    () => getAvailableMealIngredientNames(kitchenInventory),
    [kitchenInventory]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadSavedMealCards() {
      try {
        const [response, groupsResponse] = await Promise.all([api.getMealCards(), api.getPlannerGroups()]);
        if (isMounted) {
          setSavedMealCards(mapApiMealCardsToSavedMealCards(response));
          setAvailableGroups(Array.isArray(groupsResponse) ? groupsResponse : []);
        }
      } catch (error) {
        console.error('Failed to load saved meal cards:', error);
      }
    }

    void loadSavedMealCards();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDefaultThemealdbRecipes() {
      setIsThemealdbLoading(true);
      setThemealdbErrorMessage(null);

      try {
        const categories = await themealdbApi.listCategories().catch((error) => {
          console.error('Failed to load TheMealDB categories:', error);
          return [] as ThemealdbRecipeCategory[];
        });
        const defaultCategory = categories[0]?.name || DEFAULT_THEMEALDB_CATEGORY;
        const recipes = await themealdbApi.filterMealsByCategory(defaultCategory);

        if (!isMounted) {
          return;
        }

        setThemealdbCategories(categories);
        setSelectedThemealdbCategory(defaultCategory);
        setThemealdbRecipes(recipes);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load TheMealDB recipes:', error);
        setThemealdbRecipes([]);
        setThemealdbErrorMessage('Unable to load recipes from TheMealDB right now.');
      } finally {
        if (isMounted) {
          setIsThemealdbLoading(false);
        }
      }
    }

    void loadDefaultThemealdbRecipes();

    return () => {
      isMounted = false;
    };
  }, []);

  function resetIngredientDraft() {
    setDraftIngredientName('');
    setDraftIngredientCount('1');
    setEditingIngredientIndex(null);
  }

  function resetDraft() {
    setOriginDayKey(null);
    setDraftDayKey(null);
    setDraftDate('');
    setDraftName('');
    setDraftType('');
    setDraftRecipe('');
    setDraftIngredients(createBlankMealIngredients());
    resetIngredientDraft();
    setDraftNutritionalBreakdown('');
    setSelectedMealCardId(null);
    setSelectedGroupId(null);
  }

  function openAddMealModal(dayKey: string) {
    if (pendingDayKey) {
      return;
    }

    resetDraft();
    setOriginDayKey(dayKey);
    setDraftDayKey(dayKey);
    setDraftDate(formatDateInputValue(new Date()));
  }

  function closeAddMealModal() {
    if (pendingDayKey) {
      return;
    }

    resetDraft();
  }

  async function handleSaveMeal() {
    if (!draftDayKey || !originDayKey || pendingDayKey) {
      return;
    }

    const trimmedName = draftName.trim();
    const parsedDate = parseDateInputValue(draftDate);

    if (!trimmedName || !parsedDate) {
      return;
    }

    const typedDayKey = getDateKeyFromDateInput(draftDate);
    const matchedDay = typedDayKey ? nextThreeDays.find((day) => day.dayKey === typedDayKey) : null;
    const targetDayKey = matchedDay?.dayKey ?? originDayKey;
    const selectedDay = nextThreeDays.find((day) => day.dayKey === targetDayKey);

    if (!selectedDay) {
      return;
    }

    setPendingDayKey(targetDayKey);

    try {
      await addMeal(
        targetDayKey,
        formatFullDateLabel(parsedDate),
        {
          groupId: selectedGroupId,
          mealCardId: selectedMealCardId,
          name: trimmedName,
          type: draftType,
          recipe: draftRecipe,
          ingredients: draftIngredients,
          nutritionalBreakdown: draftNutritionalBreakdown,
        }
      );

      resetDraft();
    } finally {
      setPendingDayKey(null);
    }
  }

  function handleSelectMealCard(mealCard: SavedMealCard) {
    const mealDraft = createMealDraftFromSavedMealCard(mealCard);

    setSelectedMealCardId(mealCard.id);
    setDraftName(mealDraft.name);
    setDraftType(mealDraft.type ?? '');
    setDraftRecipe(mealDraft.recipe ?? '');
    setDraftIngredients(mealDraft.ingredients ?? []);
    resetIngredientDraft();
    setDraftNutritionalBreakdown(mealDraft.nutritionalBreakdown ?? '');
  }

  async function handleAddMealToMealCards() {
    if (!selectedMeal || isSavingMealCard) {
      return;
    }

    setIsSavingMealCard(true);

    try {
      await saveMealCardDraft(
        {
          ...createMealCardInputFromMeal(selectedMeal),
          sourceKey: selectedMeal.id,
          successMessage: 'This meal was added to My Meal Cards.',
        },
        true
      );
    } catch (error) {
      const apiError = error as ApiError;
      if (!isMealCardNameConflictError(error)) {
        Alert.alert('Error', apiError.message || 'Failed to add meal to My Meal Cards.');
      }
    } finally {
      setIsSavingMealCard(false);
    }
  }

  async function ensureThemealdbCategories() {
    if (themealdbCategories.length > 0) {
      return themealdbCategories;
    }

    const categories = await themealdbApi.listCategories();
    setThemealdbCategories(categories);

    if (!selectedThemealdbCategory && categories[0]?.name) {
      setSelectedThemealdbCategory(categories[0].name);
    }

    return categories;
  }

  async function handleThemealdbSearch(
    overrideMode?: ThemealdbSearchMode,
    overrideTerm?: string
  ) {
    const mode = overrideMode ?? themealdbSearchMode;

    setIsThemealdbLoading(true);
    setThemealdbErrorMessage(null);

    try {
      let recipes: ThemealdbRecipeSummary[] = [];

      if (mode === 'category') {
        const categories = await ensureThemealdbCategories();
        const category = overrideTerm?.trim() || selectedThemealdbCategory || categories[0]?.name || DEFAULT_THEMEALDB_CATEGORY;

        setSelectedThemealdbCategory(category);
        recipes = await themealdbApi.filterMealsByCategory(category);
      }

      if (mode === 'name') {
        const query = (overrideTerm ?? themealdbSearchTerm).trim();

        if (!query) {
          setThemealdbRecipes([]);
          setThemealdbErrorMessage('Enter a meal name to search TheMealDB.');
          return;
        }

        recipes = await themealdbApi.searchMealsByName(query);
      }

      if (mode === 'firstLetter') {
        const query = (overrideTerm ?? themealdbSearchTerm).trim().charAt(0);

        if (!query) {
          setThemealdbRecipes([]);
          setThemealdbErrorMessage('Enter one letter to search by first letter.');
          return;
        }

        setThemealdbSearchTerm(query);
        recipes = await themealdbApi.searchMealsByFirstLetter(query);
      }

      if (mode === 'ingredient') {
        const query = (overrideTerm ?? themealdbSearchTerm).trim();

        if (!query) {
          setThemealdbRecipes([]);
          setThemealdbErrorMessage('Enter a main ingredient to search TheMealDB.');
          return;
        }

        recipes = await themealdbApi.filterMealsByIngredient(query);
      }

      setThemealdbRecipes(recipes);
    } catch (error) {
      console.error('Failed to search TheMealDB recipes:', error);
      setThemealdbErrorMessage('Unable to load recipes from TheMealDB right now.');
    } finally {
      setIsThemealdbLoading(false);
    }
  }

  async function handleThemealdbRecipePress(recipe: ThemealdbRecipeSummary) {
    setSelectedThemealdbRecipeId(recipe.id);
    setSelectedThemealdbRecipe(null);
    setThemealdbRecipeErrorMessage(null);
    setIsThemealdbRecipeLoading(true);

    try {
      const detail = await themealdbApi.getMealById(recipe.id);

      if (!detail) {
        setThemealdbRecipeErrorMessage('This recipe could not be found in TheMealDB.');
        return;
      }

      setSelectedThemealdbRecipe(detail);
    } catch (error) {
      console.error('Failed to load TheMealDB recipe details:', error);
      setThemealdbRecipeErrorMessage('Unable to load recipe details right now.');
    } finally {
      setIsThemealdbRecipeLoading(false);
    }
  }

  function closeThemealdbRecipeDetail() {
    setSelectedThemealdbRecipeId(null);
    setSelectedThemealdbRecipe(null);
    setIsThemealdbRecipeLoading(false);
    setThemealdbRecipeErrorMessage(null);
  }

  function closeMealCardNamePrompt() {
    if (isSavingMealCard || savingThemealdbRecipeId !== null) {
      return;
    }

    setPendingMealCardDraft(null);
    setMealCardNamePromptValue('');
    setMealCardNamePromptError(null);
  }

  async function handleAddThemealdbRecipeToMealCards(recipe: ThemealdbRecipeSummary) {
    if (savingThemealdbRecipeId) {
      return;
    }

    setSavingThemealdbRecipeId(recipe.id);

    try {
      const detail = await themealdbApi.getMealById(recipe.id);

      if (!detail) {
        Alert.alert('Error', 'This recipe could not be loaded from TheMealDB.');
        return;
      }

      await saveMealCardDraft(
        {
        name: detail.name,
        mealType: getThemealdbMealType(detail),
        recipe: detail.instructions,
        imageUrl: detail.imageUrl,
        ingredients: detail.ingredients.map((ingredient) => ingredient.name),
          sourceKey: `themealdb:${recipe.id}`,
          successMessage: 'This recipe was added to My Meal Cards.',
        },
        true
      );
    } catch (error) {
      const apiError = error as ApiError;
      if (!isMealCardNameConflictError(error)) {
        Alert.alert('Error', apiError.message || 'Failed to add recipe to My Meal Cards.');
      }
    } finally {
      setSavingThemealdbRecipeId(null);
    }
  }

  async function saveMealCardDraft(draft: MealCardCreateDraft, allowRenamePrompt: boolean) {
    try {
      const response = await api.createMealCard({
        name: draft.name,
        mealType: draft.mealType,
        recipe: draft.recipe,
        nutritionalBreakdown: draft.nutritionalBreakdown,
        imageUrl: draft.imageUrl,
        ingredients: draft.ingredients,
      });
      const createdMealCard = mapApiMealCardsToSavedMealCards([response])[0];

      setSavedMealCards((currentCards) =>
        createdMealCard ? [createdMealCard, ...currentCards] : currentCards
      );
      Alert.alert('Saved', draft.successMessage);
    } catch (error) {
      if (allowRenamePrompt && isMealCardNameConflictError(error)) {
        setPendingMealCardDraft(draft);
        setMealCardNamePromptValue(draft.name);
        setMealCardNamePromptError(getMealCardNameConflictMessage(draft.name));
        return;
      }

      throw error;
    }
  }

  function setSavingStateForDraft(sourceKey: string, isSaving: boolean) {
    if (sourceKey.startsWith('themealdb:')) {
      setSavingThemealdbRecipeId(isSaving ? sourceKey.replace('themealdb:', '') : null);
      return;
    }

    setIsSavingMealCard(isSaving);
  }

  async function handleConfirmMealCardNamePrompt() {
    if (!pendingMealCardDraft) {
      return;
    }

    const trimmedName = mealCardNamePromptValue.trim();

    if (!trimmedName) {
      setMealCardNamePromptError('Enter a unique meal card name.');
      return;
    }

    setMealCardNamePromptError(null);
    setSavingStateForDraft(pendingMealCardDraft.sourceKey, true);

    try {
      await saveMealCardDraft(
        {
          ...pendingMealCardDraft,
          name: trimmedName,
        },
        false
      );
      setPendingMealCardDraft(null);
      setMealCardNamePromptValue('');
    } catch (error) {
      if (isMealCardNameConflictError(error)) {
        setMealCardNamePromptError(getMealCardNameConflictMessage(trimmedName));
        return;
      }

      const apiError = error as ApiError;
      Alert.alert('Error', apiError.message || 'Failed to add meal to My Meal Cards.');
    } finally {
      setSavingStateForDraft(pendingMealCardDraft.sourceKey, false);
    }
  }

  const weekRange = formatWeekRange(new Date());
  const defaultHomeDayKey = nextThreeDays[0]?.dayKey ?? null;
  const isIngredientCountDraftValid = isValidIngredientCount(draftIngredientCount);

  function handleAddIngredient() {
    if (!isIngredientCountDraftValid) {
      return;
    }

    const trimmedName = draftIngredientName.trim();

    if (!trimmedName) {
      return;
    }

    setDraftIngredients((currentIngredients) =>
      upsertMealIngredient(
        currentIngredients,
        createMealIngredient(trimmedName, Number(draftIngredientCount)).name,
        Number(draftIngredientCount),
        editingIngredientIndex
      )
    );
    resetIngredientDraft();
  }

  function handleEditIngredient(index: number) {
    const ingredient = draftIngredients[index];

    if (!ingredient) {
      return;
    }

    setDraftIngredientName(ingredient.name);
    setDraftIngredientCount(String(ingredient.count));
    setEditingIngredientIndex(index);
  }

  if (isViewingAllRecipes) {
    return (
      <>
        <HomeRecipesScreen
          categories={themealdbCategories}
          errorMessage={themealdbErrorMessage}
          isLoading={isThemealdbLoading}
          onAddToMealCards={(recipe) => {
            void handleAddThemealdbRecipeToMealCards(recipe);
          }}
          onBack={() => {
            setIsViewingAllRecipes(false);
          }}
          onOpenCategoryPicker={() => {
            setIsCategoryModalVisible(true);
          }}
          onOpenRecipe={(recipe) => {
            void handleThemealdbRecipePress(recipe);
          }}
          onOpenSearchModePicker={() => {
            setIsSearchModeModalVisible(true);
          }}
          onRetry={() => {
            void handleThemealdbSearch();
          }}
          onSearch={() => {
            void handleThemealdbSearch();
          }}
          onSearchTermChange={setThemealdbSearchTerm}
          recipes={themealdbRecipes}
          savingRecipeId={savingThemealdbRecipeId}
          searchMode={themealdbSearchMode}
          searchModeLabel={getThemealdbSearchModeLabel(themealdbSearchMode)}
          searchTerm={themealdbSearchTerm}
          selectedCategory={selectedThemealdbCategory}
        />

        <ThemealdbRecipeDetailModal
          errorMessage={themealdbRecipeErrorMessage}
          isLoading={isThemealdbRecipeLoading}
          onClose={closeThemealdbRecipeDetail}
          recipe={selectedThemealdbRecipe}
          visible={selectedThemealdbRecipeId !== null}
        />

        <SelectableListModal
          items={THEMEALDB_SEARCH_MODE_OPTIONS}
          selectedIds={[themealdbSearchMode]}
          onClose={() => {
            setIsSearchModeModalVisible(false);
          }}
          onToggle={(itemId) => {
            const nextMode = itemId as ThemealdbSearchMode;

            setThemealdbSearchMode(nextMode);
            setIsSearchModeModalVisible(false);

            if (nextMode === 'category') {
              void handleThemealdbSearch('category');
            }
          }}
          renderItem={(item) => (
            <View style={styles.modalOption}>
              <Text style={styles.modalOptionTitle}>{item.label}</Text>
              <Text style={styles.modalOptionCopy}>{item.helperText}</Text>
            </View>
          )}
          title="Recipe Search Mode"
          subtitle="Choose how the Home screen should fetch recipes from TheMealDB."
          visible={isSearchModeModalVisible}
        />

        <SelectableListModal
          items={themealdbCategories}
          selectedIds={themealdbCategories
            .filter((category) => category.name === selectedThemealdbCategory)
            .map((category) => category.id)}
          onClose={() => {
            setIsCategoryModalVisible(false);
          }}
          onToggle={(itemId) => {
            const nextCategory = themealdbCategories.find((category) => category.id === itemId);

            if (!nextCategory) {
              return;
            }

            setSelectedThemealdbCategory(nextCategory.name);
            setIsCategoryModalVisible(false);
            void handleThemealdbSearch('category', nextCategory.name);
          }}
          renderItem={(item) => (
            <View style={styles.modalOption}>
              <Text style={styles.modalOptionTitle}>{item.name}</Text>
              <Text numberOfLines={2} style={styles.modalOptionCopy}>
                {item.description || 'Category from TheMealDB'}
              </Text>
            </View>
          )}
          title="Recipe Categories"
          subtitle="Pick a category to browse recipe ideas."
          visible={isCategoryModalVisible}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Weekly Overview</Text>
          <Text style={styles.title}>This Week&apos;s Plan</Text>
          <Text style={styles.subtitle}>{weekRange}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderTopRow}>
              <Text style={styles.sectionTitle}>Next 3 Days</Text>

              <Pressable
                accessibilityRole="button"
                disabled={pendingDayKey !== null || defaultHomeDayKey === null}
                onPress={() => {
                  if (defaultHomeDayKey) {
                    openAddMealModal(defaultHomeDayKey);
                  }
                }}
                style={({ pressed }) => [
                  styles.addMealButton,
                  (pendingDayKey !== null || defaultHomeDayKey === null) &&
                    styles.addMealButtonDisabled,
                  pressed && pendingDayKey === null && defaultHomeDayKey !== null && styles.addMealButtonPressed,
                ]}>
                <Text style={styles.addMealButtonText}>
                  {pendingDayKey !== null ? 'Saving...' : 'Add Meal'}
                </Text>
              </Pressable>
            </View>

            <Text style={styles.sectionHint}>Meals sync after each async mock request.</Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#2f7d32" />
              <Text style={styles.loadingText}>Loading meals from your planner database...</Text>
            </View>
          ) : (
            nextThreeDays.map((day) => (
              <DayMealCard
                key={day.dayKey}
                day={day}
                onSelectMeal={(meal) => {
                  setSelectedMealId(meal.id);
                }}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.recipeHeaderCopy}>
              <Text style={styles.sectionTitle}>Recipe Ideas</Text>
              <Text style={styles.sectionHint}>
                Discover recipes from TheMealDB without changing your planner.
              </Text>
            </View>
          </View>

          <View style={styles.recipeSearchCard}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setIsSearchModeModalVisible(true);
              }}
              style={({ pressed }) => [
                styles.selectorButton,
                pressed && styles.selectorButtonPressed,
              ]}>
              <Text style={styles.selectorLabel}>Search Mode</Text>
              <Text style={styles.selectorValue}>
                {getThemealdbSearchModeLabel(themealdbSearchMode)}
              </Text>
            </Pressable>

            {themealdbSearchMode === 'category' ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setIsCategoryModalVisible(true);
                }}
                style={({ pressed }) => [
                  styles.selectorButton,
                  pressed && styles.selectorButtonPressed,
                ]}>
                <Text style={styles.selectorLabel}>Category</Text>
                <Text style={styles.selectorValue}>{selectedThemealdbCategory || 'Select a category'}</Text>
              </Pressable>
            ) : (
              <View style={styles.searchInputGroup}>
                <Text style={styles.selectorLabel}>{getThemealdbInputLabel(themealdbSearchMode)}</Text>
                <TextInput
                  autoCapitalize={themealdbSearchMode === 'ingredient' ? 'none' : 'words'}
                  editable={!isThemealdbLoading}
                  onChangeText={setThemealdbSearchTerm}
                  placeholder={getThemealdbInputPlaceholder(themealdbSearchMode)}
                  placeholderTextColor="#8a9399"
                  style={[
                    styles.searchInput,
                    isThemealdbLoading && styles.searchInputDisabled,
                  ]}
                  value={themealdbSearchMode === 'firstLetter' ? themealdbSearchTerm.slice(0, 1) : themealdbSearchTerm}
                />
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              disabled={isThemealdbLoading}
              onPress={() => {
                void handleThemealdbSearch();
              }}
              style={({ pressed }) => [
                styles.searchButton,
                isThemealdbLoading && styles.searchButtonDisabled,
                pressed && !isThemealdbLoading && styles.searchButtonPressed,
              ]}>
              <Text style={styles.searchButtonText}>
                {isThemealdbLoading ? 'Searching...' : 'Search Recipes'}
              </Text>
            </Pressable>

            {themealdbRecipes.length > HOME_RECIPE_PREVIEW_COUNT ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setIsViewingAllRecipes(true);
                }}
                style={({ pressed }) => [styles.viewAllButton, pressed && styles.selectorButtonPressed]}>
                <Text style={styles.viewAllButtonText}>View All</Text>
              </Pressable>
            ) : null}
          </View>

          {themealdbErrorMessage ? (
            <View style={styles.recipeStateCard}>
              <Text style={styles.recipeStateTitle}>Recipe service unavailable</Text>
              <Text style={styles.recipeStateCopy}>{themealdbErrorMessage}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  void handleThemealdbSearch();
                }}
                style={({ pressed }) => [
                  styles.retryButton,
                  pressed && styles.selectorButtonPressed,
                ]}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </Pressable>
            </View>
          ) : null}

          {isThemealdbLoading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#2f7d32" />
              <Text style={styles.loadingText}>Fetching recipes from TheMealDB...</Text>
            </View>
          ) : themealdbRecipes.length > 0 ? (
            previewThemealdbRecipes.map((recipe) => (
              <ThemealdbRecipeCard
                key={recipe.id}
                isSavingToMealCards={savingThemealdbRecipeId === recipe.id}
                onAddToMealCards={(selectedRecipe) => {
                  void handleAddThemealdbRecipeToMealCards(selectedRecipe);
                }}
                recipe={recipe}
                onPress={(selectedRecipe) => {
                  void handleThemealdbRecipePress(selectedRecipe);
                }}
              />
            ))
          ) : (
            <View style={styles.recipeStateCard}>
              <Text style={styles.recipeStateTitle}>No recipes found</Text>
              <Text style={styles.recipeStateCopy}>
                Try a different {themealdbSearchMode === 'category' ? 'category' : 'search term'}.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <MealDetailModal
        isSavingToMealCard={isSavingMealCard}
        meal={selectedMeal}
        onAddToMealCards={() => {
          void handleAddMealToMealCards();
        }}
        visible={selectedMeal !== null}
        onToggleMade={setMealMade}
        onClose={() => {
          setSelectedMealId(null);
        }}
      />

      <ThemealdbRecipeDetailModal
        errorMessage={themealdbRecipeErrorMessage}
        isLoading={isThemealdbRecipeLoading}
        onClose={closeThemealdbRecipeDetail}
        recipe={selectedThemealdbRecipe}
        visible={selectedThemealdbRecipeId !== null}
      />

      <MealCardNamePromptModal
        helperText={mealCardNamePromptError ?? undefined}
        isSaving={isSavingMealCard || savingThemealdbRecipeId !== null}
        onChangeValue={(value) => {
          setMealCardNamePromptValue(value);
          if (mealCardNamePromptError) {
            setMealCardNamePromptError(null);
          }
        }}
        onClose={closeMealCardNamePrompt}
        onSave={() => {
          void handleConfirmMealCardNamePrompt();
        }}
        subtitle="That meal card name is already used. Change it and try again."
        title="Choose a unique meal card name"
        value={mealCardNamePromptValue}
        visible={pendingMealCardDraft !== null}
      />

      <SelectableListModal
        items={THEMEALDB_SEARCH_MODE_OPTIONS}
        selectedIds={[themealdbSearchMode]}
        onClose={() => {
          setIsSearchModeModalVisible(false);
        }}
        onToggle={(itemId) => {
          const nextMode = itemId as ThemealdbSearchMode;

          setThemealdbSearchMode(nextMode);
          setIsSearchModeModalVisible(false);

          if (nextMode === 'category') {
            void handleThemealdbSearch('category');
          }
        }}
        renderItem={(item) => (
          <View style={styles.modalOption}>
            <Text style={styles.modalOptionTitle}>{item.label}</Text>
            <Text style={styles.modalOptionCopy}>{item.helperText}</Text>
          </View>
        )}
        title="Recipe Search Mode"
        subtitle="Choose how the Home screen should fetch recipes from TheMealDB."
        visible={isSearchModeModalVisible}
      />

      <SelectableListModal
        items={themealdbCategories}
        selectedIds={themealdbCategories
          .filter((category) => category.name === selectedThemealdbCategory)
          .map((category) => category.id)}
        onClose={() => {
          setIsCategoryModalVisible(false);
        }}
        onToggle={(itemId) => {
          const nextCategory = themealdbCategories.find((category) => category.id === itemId);

          if (!nextCategory) {
            return;
          }

          setSelectedThemealdbCategory(nextCategory.name);
          setIsCategoryModalVisible(false);
          void handleThemealdbSearch('category', nextCategory.name);
        }}
        renderItem={(item) => (
          <View style={styles.modalOption}>
            <Text style={styles.modalOptionTitle}>{item.name}</Text>
            <Text numberOfLines={2} style={styles.modalOptionCopy}>
              {item.description || 'Category from TheMealDB'}
            </Text>
          </View>
        )}
        title="Recipe Categories"
        subtitle="Pick a category to browse recipe ideas."
        visible={isCategoryModalVisible}
      />

      <AddMealModal
        visible={draftDayKey !== null}
        draftDate={draftDate}
        draftName={draftName}
        draftType={draftType}
        draftRecipe={draftRecipe}
        draftIngredients={draftIngredients}
        draftIngredientName={draftIngredientName}
        draftIngredientCount={draftIngredientCount}
        editingIngredientIndex={editingIngredientIndex}
        draftNutritionalBreakdown={draftNutritionalBreakdown}
        availableIngredientNames={availableIngredientNames}
        availableGroups={availableGroups}
        isDateValid={parseDateInputValue(draftDate) !== null}
        isIngredientCountValid={isIngredientCountDraftValid}
        isSaving={pendingDayKey !== null}
        selectedGroupId={selectedGroupId}
        savedMealCards={savedMealCards}
        selectedMealCardId={selectedMealCardId}
        onChangeDate={setDraftDate}
        onChangeGroupId={setSelectedGroupId}
        onChangeName={setDraftName}
        onChangeType={(value) => {
          setDraftType(value);
        }}
        onChangeRecipe={setDraftRecipe}
        onChangeIngredientName={(value) => {
          setDraftIngredientName(getIngredientInputName(value));
        }}
        onChangeIngredientCount={(value) => {
          setDraftIngredientCount(getIngredientInputCount(value));
        }}
        onChangeNutritionalBreakdown={setDraftNutritionalBreakdown}
        onAddIngredient={handleAddIngredient}
        onEditIngredient={handleEditIngredient}
        onRemoveIngredient={(index) => {
          setDraftIngredients((currentIngredients) => removeMealIngredient(currentIngredients, index));

          if (editingIngredientIndex === index) {
            resetIngredientDraft();
          }
        }}
        onClose={closeAddMealModal}
        onSave={() => {
          void handleSaveMeal();
        }}
        onSelectMealCard={handleSelectMealCard}
      />
    </SafeAreaView>
  );
}

function getThemealdbInputLabel(mode: ThemealdbSearchMode) {
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

function getThemealdbInputPlaceholder(mode: ThemealdbSearchMode) {
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

function getThemealdbMealType(recipe: ThemealdbRecipeDetail): MealType {
  const category = recipe.category?.toLowerCase() || '';
  const name = recipe.name.toLowerCase();

  if (category.includes('breakfast') || name.includes('breakfast')) {
    return 'Breakfast';
  }

  if (category.includes('starter') || category.includes('side') || name.includes('sandwich')) {
    return 'Lunch';
  }

  return 'Dinner';
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
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#d9f0d8',
    marginBottom: 8,
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
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionHeaderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#183153',
  },
  sectionHint: {
    fontSize: 14,
    lineHeight: 20,
    color: '#587067',
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
  addMealButton: {
    minWidth: 96,
    height: 42,
    borderRadius: 999,
    paddingHorizontal: 16,
    backgroundColor: '#2f7d32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMealButtonDisabled: {
    backgroundColor: '#6aa86d',
  },
  addMealButtonPressed: {
    opacity: 0.88,
  },
  addMealButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  recipeSearchCard: {
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
  selectorButtonPressed: {
    opacity: 0.84,
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
  searchButtonDisabled: {
    backgroundColor: '#8eb591',
  },
  searchButtonPressed: {
    opacity: 0.88,
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  recipeStateCard: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 10,
  },
  recipeStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#173222',
  },
  recipeStateCopy: {
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
  modalOption: {
    gap: 6,
  },
  modalOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#173222',
  },
  modalOptionCopy: {
    fontSize: 13,
    lineHeight: 18,
    color: '#587067',
  },
  recipeHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  viewAllButton: {
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2f7d32',
  },
});
