import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  removeMealIngredient,
  upsertMealIngredient,
  type MealIngredient,
  type MealType,
  MealDetailModal,
  parseDateInputValue,
} from '@/src/components';
import { useMealPlanner } from '@/src/state';

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
  const { addMeal, isLoading, kitchenInventory, nextThreeDays, setMealMade, updateMealInState } = useMealPlanner();
  const selectedMeal = selectedMealId ? updateMealInState(selectedMealId) : null;
  const availableIngredientNames = useMemo(
    () => getAvailableMealIngredientNames(kitchenInventory),
    [kitchenInventory]
  );

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
      </ScrollView>

      <MealDetailModal
        meal={selectedMeal}
        visible={selectedMeal !== null}
        onToggleMade={setMealMade}
        onClose={() => {
          setSelectedMealId(null);
        }}
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
        isDateValid={parseDateInputValue(draftDate) !== null}
        isIngredientCountValid={isIngredientCountDraftValid}
        isSaving={pendingDayKey !== null}
        onChangeDate={setDraftDate}
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
      />
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
});
