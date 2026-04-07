import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AddPlannerGroupModal,
  AddMealModal,
  buildCalendarGrid,
  type CalendarDayCell,
  createBlankMealIngredients,
  createMealIngredient,
  DayTile,
  formatDateInputValue,
  formatFullDateLabel,
  formatMonthLabel,
  formatSelectedDayTitle,
  formatSelectedWeekTitle,
  getAvailableMealIngredientNames,
  getDefaultSelectedDate,
  getDateKeyFromDateInput,
  getIngredientInputCount,
  getIngredientInputName,
  getMealsForDate,
  getMealsForWeek,
  getPlannerGroupButtonLabel,
  hasMealsForDate,
  isValidIngredientCount,
  MealDetailModal,
  MOCK_PLANNER_FRIENDS,
  MOCK_PLANNER_GROUPS,
  PlannerGroupSelectorModal,
  type PlannerGroup,
  removeMealIngredient,
  type MealIngredient,
  type MealType,
  parseDateInputValue,
  SelectedMealCard,
  shiftMonth,
  upsertMealIngredient,
  WEEKDAY_LABELS,
} from '@/src/components';
import { useMealPlanner } from '@/src/state';

function createCalendarDate(referenceDate: Date, day: number) {
  return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), day, 12, 0, 0, 0);
}

type PlannerDisplayMode = 'day' | 'week';

export function PlannerScreen() {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(2026, 2, 1, 12, 0, 0, 0));
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 2, 23, 12, 0, 0, 0));
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<PlannerDisplayMode>('day');
  const [availableGroups, setAvailableGroups] = useState<PlannerGroup[]>(MOCK_PLANNER_GROUPS);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [isGroupMenuVisible, setIsGroupMenuVisible] = useState(false);
  const [isAddGroupVisible, setIsAddGroupVisible] = useState(false);
  const [selectedFriendIdsForNewGroup, setSelectedFriendIdsForNewGroup] = useState<string[]>([]);
  const [newGroupNameDraft, setNewGroupNameDraft] = useState('');
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
  const { addMeal, isLoading, kitchenInventory, mealsByDate, setMealMade, updateMealInState } = useMealPlanner();
  const selectedMeal = selectedMealId ? updateMealInState(selectedMealId) : null;

  const calendarCells = useMemo(() => buildCalendarGrid(visibleMonth), [visibleMonth]);
  const selectedMeals = useMemo(
    () => getMealsForDate(mealsByDate, selectedDate),
    [mealsByDate, selectedDate]
  );
  const selectedWeekMeals = useMemo(
    () => getMealsForWeek(mealsByDate, selectedDate),
    [mealsByDate, selectedDate]
  );
  const monthLabel = formatMonthLabel(visibleMonth);
  const selectedDayTitle = formatSelectedDayTitle(selectedDate);
  const selectedWeekTitle = formatSelectedWeekTitle(selectedDate);
  const availableIngredientNames = useMemo(
    () => getAvailableMealIngredientNames(kitchenInventory),
    [kitchenInventory]
  );
  const isIngredientCountDraftValid = isValidIngredientCount(draftIngredientCount);
  const selectedGroupLabel = getPlannerGroupButtonLabel(availableGroups, selectedGroupIds);
  const isCreateGroupDisabled =
    newGroupNameDraft.trim().length === 0 || selectedFriendIdsForNewGroup.length === 0;

  useEffect(() => {
    if (Object.keys(mealsByDate).length === 0) {
      return;
    }

    setSelectedDate(getDefaultSelectedDate(visibleMonth, mealsByDate));
  }, [mealsByDate, visibleMonth]);

  function handleMonthChange(delta: number) {
    setVisibleMonth((currentMonth) => shiftMonth(currentMonth, delta));
  }

  function handleSelectDay(cell: CalendarDayCell) {
    if (cell.isPlaceholder || cell.day === null) {
      return;
    }

    setSelectedDate(createCalendarDate(visibleMonth, cell.day));
  }

  function resetDraft() {
    setDraftDayKey(null);
    setDraftDate('');
    setDraftName('');
    setDraftType('');
    setDraftRecipe('');
    setDraftIngredients(createBlankMealIngredients());
    setDraftIngredientName('');
    setDraftIngredientCount('1');
    setEditingIngredientIndex(null);
    setDraftNutritionalBreakdown('');
  }

  function openAddMealModal(date: Date) {
    if (pendingDayKey) {
      return;
    }

    resetDraft();
    setDraftDayKey(date.toISOString().slice(0, 10));
    setDraftDate(formatDateInputValue(date));
  }

  function closeAddMealModal() {
    if (pendingDayKey) {
      return;
    }

    resetDraft();
  }

  async function handleSaveMeal() {
    if (!draftDayKey || pendingDayKey) {
      return;
    }

    const trimmedName = draftName.trim();
    const parsedDate = parseDateInputValue(draftDate);

    if (!trimmedName || !parsedDate) {
      return;
    }

    const targetDayKey = getDateKeyFromDateInput(draftDate) ?? draftDayKey;
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
    setDraftIngredientName('');
    setDraftIngredientCount('1');
    setEditingIngredientIndex(null);
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

  function handleToggleGroup(groupId: string) {
    setSelectedGroupIds((currentIds) =>
      currentIds.includes(groupId)
        ? currentIds.filter((currentId) => currentId !== groupId)
        : [...currentIds, groupId]
    );
  }

  function handleToggleFriend(friendId: string) {
    setSelectedFriendIdsForNewGroup((currentIds) =>
      currentIds.includes(friendId)
        ? currentIds.filter((currentId) => currentId !== friendId)
        : [...currentIds, friendId]
    );
  }

  function closeAddGroupModal() {
    setIsAddGroupVisible(false);
    setNewGroupNameDraft('');
    setSelectedFriendIdsForNewGroup([]);
  }

  function handleCreateGroup() {
    const trimmedName = newGroupNameDraft.trim();

    if (!trimmedName || selectedFriendIdsForNewGroup.length === 0) {
      return;
    }

    const memberNamesPreview = MOCK_PLANNER_FRIENDS.filter((friend) =>
      selectedFriendIdsForNewGroup.includes(friend.id)
    ).map((friend) => friend.name.split(' ')[0] ?? friend.name);
    const newGroupId = `group-${Date.now()}`;

    setAvailableGroups((currentGroups) => [
      ...currentGroups,
      {
        id: newGroupId,
        name: trimmedName,
        memberIds: [...selectedFriendIdsForNewGroup],
        memberNamesPreview,
      },
    ]);
    setSelectedGroupIds((currentIds) => [...currentIds, newGroupId]);
    closeAddGroupModal();
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarShell}>
          <View style={styles.monthHeader}>
            <Pressable
              accessibilityLabel="Show previous month"
              accessibilityRole="button"
              onPress={() => {
                handleMonthChange(-1);
              }}
              style={({ pressed }) => [styles.arrowButton, pressed && styles.arrowButtonPressed]}>
              <MaterialIcons name="chevron-left" size={26} color="#ffffff" />
            </Pressable>

            <Text style={styles.monthTitle}>{monthLabel}</Text>

            <Pressable
              accessibilityLabel="Show next month"
              accessibilityRole="button"
              onPress={() => {
                handleMonthChange(1);
              }}
              style={({ pressed }) => [styles.arrowButton, pressed && styles.arrowButtonPressed]}>
              <MaterialIcons name="chevron-right" size={26} color="#ffffff" />
            </Pressable>
          </View>

          <View style={styles.weekdayRow}>
            {WEEKDAY_LABELS.map((label) => (
              <View key={label} style={styles.weekdayCell}>
                <Text style={styles.weekdayLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {isLoading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#2f7d32" />
              <Text style={styles.loadingText}>Loading your monthly meal calendar...</Text>
            </View>
          ) : (
            <View style={styles.calendarGrid}>
              {calendarCells.map((cell) => {
                const isSelected = cell.dateKey === selectedDate.toISOString().slice(0, 10);

                return (
                  <DayTile
                    key={cell.key}
                    day={cell.day}
                    hasMeals={hasMealsForDate(mealsByDate, cell.dateKey)}
                    isPlaceholder={cell.isPlaceholder}
                    isSelected={isSelected}
                    onPress={() => {
                      handleSelectDay(cell);
                    }}
                  />
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.mealsSection}>
          <View style={styles.mealsSectionHeader}>
            <Text style={styles.mealsSectionTitle}>
              {displayMode === 'week' ? selectedWeekTitle : selectedDayTitle}
            </Text>

            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                disabled={pendingDayKey === selectedDate.toISOString().slice(0, 10)}
                onPress={() => {
                  openAddMealModal(selectedDate);
                }}
                style={({ pressed }) => [
                  styles.addMealButton,
                  pendingDayKey === selectedDate.toISOString().slice(0, 10) &&
                    styles.addMealButtonDisabled,
                  pressed &&
                    pendingDayKey !== selectedDate.toISOString().slice(0, 10) &&
                    styles.actionButtonPressed,
                ]}>
                <Text style={styles.addMealButtonText}>
                  {pendingDayKey === selectedDate.toISOString().slice(0, 10)
                    ? 'Saving...'
                    : 'Add Meal'}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setDisplayMode((currentMode) => (currentMode === 'day' ? 'week' : 'day'));
                }}
                style={({ pressed }) => [
                  styles.modeButton,
                  displayMode === 'week' && styles.modeButtonSelected,
                  pressed && styles.actionButtonPressed,
                ]}>
                <Text
                  style={[
                    styles.modeButtonText,
                    displayMode === 'week' && styles.modeButtonTextSelected,
                  ]}>
                  {displayMode === 'week' ? 'Show Day' : 'Show Week'}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setIsGroupMenuVisible(true);
                }}
                style={({ pressed }) => [
                  styles.modeButton,
                  selectedGroupIds.length > 0 && styles.modeButtonSelected,
                  pressed && styles.actionButtonPressed,
                ]}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.modeButtonText,
                    selectedGroupIds.length > 0 && styles.modeButtonTextSelected,
                  ]}>
                  {selectedGroupLabel}
                </Text>
              </Pressable>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.sectionPlaceholder} />
          ) : displayMode === 'week' ? (
            <View style={styles.weekGroups}>
              {selectedWeekMeals.map((weekDay) => (
                <View key={weekDay.dateKey} style={styles.weekDayCard}>
                  <View style={styles.weekDayHeader}>
                    <View style={styles.weekDayHeading}>
                      <Text style={styles.weekDayTitle}>{weekDay.dayLabel}</Text>
                      <Text style={styles.weekDaySubtitle}>{weekDay.fullDateLabel}</Text>
                    </View>
                  </View>

                  {weekDay.meals.length > 0 ? (
                    <View style={styles.weekMealsRow}>
                      {weekDay.meals.map((meal) => (
                        <SelectedMealCard
                          key={meal.id}
                          meal={meal}
                          onPress={(selected) => {
                            setSelectedMealId(selected.id);
                          }}
                        />
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.weekEmptyText}>No meals planned for this day.</Text>
                  )}
                </View>
              ))}
            </View>
          ) : selectedMeals.length > 0 ? (
            <View style={styles.selectedMealsRow}>
              {selectedMeals.map((meal) => (
                <SelectedMealCard
                  key={meal.id}
                  meal={meal}
                  onPress={(selected) => {
                    setSelectedMealId(selected.id);
                  }}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyStateTitle}>No meals planned yet</Text>
              <Text style={styles.emptyStateBody}>
                Pick another highlighted day to preview breakfast, lunch, and dinner.
              </Text>
            </View>
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
            setDraftIngredientName('');
            setDraftIngredientCount('1');
            setEditingIngredientIndex(null);
          }
        }}
        onClose={closeAddMealModal}
        onSave={() => {
          void handleSaveMeal();
        }}
      />

      <PlannerGroupSelectorModal
        visible={isGroupMenuVisible}
        groups={availableGroups}
        selectedGroupIds={selectedGroupIds}
        onToggleGroup={handleToggleGroup}
        onClose={() => {
          setIsGroupMenuVisible(false);
        }}
        onAddGroup={() => {
          setIsGroupMenuVisible(false);
          setIsAddGroupVisible(true);
        }}
      />

      <AddPlannerGroupModal
        visible={isAddGroupVisible}
        friends={MOCK_PLANNER_FRIENDS}
        draftGroupName={newGroupNameDraft}
        selectedFriendIds={selectedFriendIdsForNewGroup}
        isCreateDisabled={isCreateGroupDisabled}
        onChangeGroupName={setNewGroupNameDraft}
        onToggleFriend={handleToggleFriend}
        onClose={closeAddGroupModal}
        onCreateGroup={handleCreateGroup}
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
    padding: 18,
    paddingBottom: 32,
    gap: 20,
  },
  calendarShell: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#16301c',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 4,
  },
  monthHeader: {
    minHeight: 86,
    backgroundColor: '#2f7d32',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 6,
  },
  weekdayCell: {
    width: '14.2857%',
    alignItems: 'center',
  },
  weekdayLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5b6c61',
  },
  loadingCard: {
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  loadingText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: '#587067',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  mealsSection: {
    gap: 14,
  },
  mealsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  mealsSectionTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: '#183153',
  },
  addMealButton: {
    minWidth: 96,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#2f7d32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMealButtonDisabled: {
    backgroundColor: '#6aa86d',
  },
  addMealButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  modeButton: {
    maxWidth: 150,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#edf6ed',
  },
  modeButtonSelected: {
    backgroundColor: '#2f7d32',
  },
  actionButtonPressed: {
    opacity: 0.84,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2f7d32',
  },
  modeButtonTextSelected: {
    color: '#ffffff',
  },
  selectedMealsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  weekGroups: {
    gap: 14,
  },
  weekDayCard: {
    borderRadius: 22,
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 12,
  },
  weekDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  weekDayHeading: {
    gap: 4,
  },
  weekDayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#173222',
  },
  weekDaySubtitle: {
    fontSize: 14,
    color: '#587067',
  },
  weekMealsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  weekEmptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#587067',
  },
  sectionPlaceholder: {
    height: 126,
  },
  emptyStateCard: {
    borderRadius: 22,
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 20,
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#173222',
  },
  emptyStateBody: {
    fontSize: 15,
    lineHeight: 22,
    color: '#587067',
  },
});
