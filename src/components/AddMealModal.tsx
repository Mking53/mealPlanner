import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  formatMealIngredientCount,
  getFilteredMealIngredientNames,
  MEAL_TYPES,
  type MealIngredient,
  type MealType,
} from './mealModels';
import type { SavedMealCard } from './profileModels';
import type { PlannerGroup } from './plannerGroupModels';

type AddMealModalProps = {
  availableIngredientNames: string[];
  availableGroups?: PlannerGroup[];
  draftDate: string;
  draftIngredientCount: string;
  draftIngredientName: string;
  draftIngredients: MealIngredient[];
  draftName: string;
  draftNutritionalBreakdown: string;
  draftRecipe: string;
  draftType: MealType | '';
  editingIngredientIndex: number | null;
  isDateValid: boolean;
  isIngredientCountValid: boolean;
  isSaving: boolean;
  modalTitle?: string;
  savedMealCards?: SavedMealCard[];
  saveButtonLabel?: string;
  selectedGroupId?: string | null;
  selectedMealCardId?: string | null;
  showDateField?: boolean;
  onAddIngredient: () => void;
  onChangeDate: (value: string) => void;
  onChangeIngredientCount: (value: string) => void;
  onChangeIngredientName: (value: string) => void;
  onChangeName: (value: string) => void;
  onChangeNutritionalBreakdown: (value: string) => void;
  onChangeRecipe: (value: string) => void;
  onChangeGroupId?: (groupId: string | null) => void;
  onChangeType: (value: MealType) => void;
  onClose: () => void;
  onEditIngredient: (index: number) => void;
  onRemoveIngredient: (index: number) => void;
  onSave: () => void;
  onSelectMealCard?: (mealCard: SavedMealCard) => void;
  visible: boolean;
};

export function AddMealModal({
  availableIngredientNames,
  availableGroups = [],
  draftDate,
  draftIngredientCount,
  draftIngredientName,
  draftIngredients,
  draftName,
  draftNutritionalBreakdown,
  draftRecipe,
  draftType,
  editingIngredientIndex,
  isDateValid,
  isIngredientCountValid,
  isSaving,
  modalTitle = 'Add Meal',
  savedMealCards = [],
  saveButtonLabel = 'Save',
  selectedGroupId = null,
  selectedMealCardId = null,
  showDateField = true,
  onAddIngredient,
  onChangeDate,
  onChangeIngredientCount,
  onChangeIngredientName,
  onChangeName,
  onChangeNutritionalBreakdown,
  onChangeRecipe,
  onChangeGroupId,
  onChangeType,
  onClose,
  onEditIngredient,
  onRemoveIngredient,
  onSave,
  onSelectMealCard,
  visible,
}: AddMealModalProps) {
  const [isMealCardMenuOpen, setIsMealCardMenuOpen] = useState(false);
  const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false);
  const [mealCardSearch, setMealCardSearch] = useState('');
  const isDateRequired = showDateField;
  const isSaveDisabled =
    draftName.trim().length === 0 ||
    (isDateRequired && (draftDate.trim().length === 0 || !isDateValid)) ||
    isSaving;
  const ingredientButtonLabel = editingIngredientIndex === null ? 'Add Ingredient' : 'Update Ingredient';
  const canAddIngredient = draftIngredientName.trim().length > 0 && isIngredientCountValid && !isSaving;
  const filteredIngredientNames = useMemo(
    () =>
      getFilteredMealIngredientNames(
        availableIngredientNames,
        draftIngredientName,
        draftIngredients,
        editingIngredientIndex
      ),
    [availableIngredientNames, draftIngredientName, draftIngredients, editingIngredientIndex]
  );
  const shouldShowIngredientDropdown =
    draftIngredientName.trim().length > 0 && filteredIngredientNames.length > 0;
  const selectedMealCard =
    savedMealCards.find((mealCard) => mealCard.id === selectedMealCardId) ?? null;
  const selectedGroup = availableGroups.find((group) => group.id === selectedGroupId) ?? null;
  const normalizedMealCardSearch = mealCardSearch.trim().toLowerCase();
  const filteredMealCards = useMemo(
    () =>
      savedMealCards.filter((mealCard) => {
        if (!normalizedMealCardSearch) {
          return true;
        }

        const searchableText = [
          mealCard.name,
          mealCard.type,
          mealCard.recipe,
          mealCard.ingredients.map((ingredient) => ingredient.name).join(' '),
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(normalizedMealCardSearch);
      }),
    [normalizedMealCardSearch, savedMealCards]
  );

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={() => {}} style={styles.card}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>{modalTitle}</Text>

            {savedMealCards.length > 0 ? (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Use My Meal Card</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setIsMealCardMenuOpen((current) => !current);
                  }}
                  style={({ pressed }) => [
                    styles.mealCardDropdownTrigger,
                    isMealCardMenuOpen && styles.mealCardDropdownTriggerOpen,
                    pressed && styles.typeChipPressed,
                  ]}>
                  <View style={styles.mealCardDropdownCopy}>
                    <Text style={styles.mealCardDropdownLabel}>
                      {selectedMealCard?.name ?? 'Select a meal card'}
                    </Text>
                    <Text style={styles.mealCardDropdownHint}>
                      {selectedMealCard ? `${selectedMealCard.type} selected` : 'Browse and auto-fill from saved meals'}
                    </Text>
                  </View>
                  <Text style={styles.mealCardDropdownChevron}>
                    {isMealCardMenuOpen ? '▲' : '▼'}
                  </Text>
                </Pressable>

                {isMealCardMenuOpen ? (
                  <View style={styles.mealCardDropdownMenu}>
                    <TextInput
                      placeholder="Search meal cards"
                      placeholderTextColor="#8a9399"
                      style={styles.input}
                      value={mealCardSearch}
                      onChangeText={setMealCardSearch}
                    />
                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator={false}
                      style={styles.mealCardResultsScroll}
                      contentContainerStyle={styles.mealCardResultsContent}>
                      {filteredMealCards.length > 0 ? (
                        filteredMealCards.map((mealCard) => (
                          <Pressable
                            key={mealCard.id}
                            onPress={() => {
                              onSelectMealCard?.(mealCard);
                              setIsMealCardMenuOpen(false);
                            }}
                            style={({ pressed }) => [
                              styles.mealCardResultRow,
                              selectedMealCardId === mealCard.id && styles.mealCardResultRowSelected,
                              pressed && styles.typeChipPressed,
                            ]}>
                            <View style={styles.mealCardResultCopy}>
                              <Text
                                style={[
                                  styles.mealCardResultTitle,
                                  selectedMealCardId === mealCard.id && styles.mealCardResultTitleSelected,
                                ]}>
                                {mealCard.name}
                              </Text>
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.mealCardResultSubtitle,
                                  selectedMealCardId === mealCard.id && styles.mealCardResultSubtitleSelected,
                                ]}>
                                {mealCard.type} · {mealCard.ingredients.length} ingredients
                              </Text>
                            </View>
                          </Pressable>
                        ))
                      ) : (
                        <View style={styles.emptyMealCardResults}>
                          <Text style={styles.emptyMealCardResultsText}>
                            No meal cards match your search.
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                ) : null}
                <Text style={styles.helperText}>
                  Select a saved meal card to auto-fill everything except the date.
                </Text>
              </View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Meal Name</Text>
              <TextInput
                placeholder="Enter meal name"
                placeholderTextColor="#8a9399"
                style={styles.input}
                value={draftName}
                onChangeText={onChangeName}
              />
            </View>

            {showDateField ? (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  placeholder="mm/dd/year"
                  placeholderTextColor="#8a9399"
                  style={[styles.input, !isDateValid && draftDate.trim().length > 0 && styles.inputInvalid]}
                  value={draftDate}
                  onChangeText={onChangeDate}
                  keyboardType="numbers-and-punctuation"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={styles.helperText}>Required. Use `mm/dd/year`.</Text>
              </View>
            ) : null}

            {availableGroups.length > 0 ? (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Group</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setIsGroupMenuOpen((current) => !current);
                  }}
                  style={({ pressed }) => [
                    styles.mealCardDropdownTrigger,
                    isGroupMenuOpen && styles.mealCardDropdownTriggerOpen,
                    pressed && styles.typeChipPressed,
                  ]}>
                  <View style={styles.mealCardDropdownCopy}>
                    <Text style={styles.mealCardDropdownLabel}>
                      {selectedGroup?.name ?? 'Personal meal'}
                    </Text>
                    <Text style={styles.mealCardDropdownHint}>
                      {selectedGroup ? 'This meal will be added to the selected group.' : 'Leave unselected to keep this meal personal.'}
                    </Text>
                  </View>
                  <Text style={styles.mealCardDropdownChevron}>
                    {isGroupMenuOpen ? '▲' : '▼'}
                  </Text>
                </Pressable>

                {isGroupMenuOpen ? (
                  <View style={styles.mealCardDropdownMenu}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        onChangeGroupId?.(null);
                        setIsGroupMenuOpen(false);
                      }}
                      style={({ pressed }) => [
                        styles.mealCardResultRow,
                        selectedGroupId === null && styles.mealCardResultRowSelected,
                        pressed && styles.typeChipPressed,
                      ]}>
                      <View style={styles.mealCardResultCopy}>
                        <Text
                          style={[
                            styles.mealCardResultTitle,
                            selectedGroupId === null && styles.mealCardResultTitleSelected,
                          ]}>
                          Personal meal
                        </Text>
                        <Text
                          style={[
                            styles.mealCardResultSubtitle,
                            selectedGroupId === null && styles.mealCardResultSubtitleSelected,
                          ]}>
                          Only visible in your own planner
                        </Text>
                      </View>
                    </Pressable>

                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator={false}
                      style={styles.mealCardResultsScroll}
                      contentContainerStyle={styles.mealCardResultsContent}>
                      {availableGroups.map((group) => (
                        <Pressable
                          key={group.id}
                          accessibilityRole="button"
                          onPress={() => {
                            onChangeGroupId?.(group.id);
                            setIsGroupMenuOpen(false);
                          }}
                          style={({ pressed }) => [
                            styles.mealCardResultRow,
                            selectedGroupId === group.id && styles.mealCardResultRowSelected,
                            pressed && styles.typeChipPressed,
                          ]}>
                          <View style={styles.mealCardResultCopy}>
                            <Text
                              style={[
                                styles.mealCardResultTitle,
                                selectedGroupId === group.id && styles.mealCardResultTitleSelected,
                              ]}>
                              {group.name}
                            </Text>
                            <Text
                              style={[
                                styles.mealCardResultSubtitle,
                                selectedGroupId === group.id && styles.mealCardResultSubtitleSelected,
                              ]}>
                              {group.memberNamesPreview && group.memberNamesPreview.length > 0
                                ? group.memberNamesPreview.join(', ')
                                : `${group.memberIds.length} member${group.memberIds.length === 1 ? '' : 's'}`}
                            </Text>
                          </View>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                ) : null}
                <Text style={styles.helperText}>
                  Choose a group from the dropdown if this meal should be shared with that group.
                </Text>
              </View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Meal Type</Text>
              <View style={styles.typeRow}>
                {MEAL_TYPES.map((mealType) => (
                  <Pressable
                    key={mealType}
                    onPress={() => {
                      onChangeType(mealType);
                    }}
                    style={({ pressed }) => [
                      styles.typeChip,
                      draftType === mealType && styles.typeChipSelected,
                      pressed && styles.typeChipPressed,
                    ]}>
                    <Text
                      style={[
                        styles.typeChipText,
                        draftType === mealType && styles.typeChipTextSelected,
                      ]}>
                      {mealType}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.helperText}>Optional. Defaults to Dinner if you leave it unselected.</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Recipe</Text>
              <TextInput
                placeholder="Optional"
                placeholderTextColor="#8a9399"
                style={[styles.input, styles.multilineInput]}
                value={draftRecipe}
                onChangeText={onChangeRecipe}
                multiline
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Ingredients</Text>
              <TextInput
                placeholder="Choose or type an ingredient"
                placeholderTextColor="#8a9399"
                style={styles.input}
                value={draftIngredientName}
                onChangeText={onChangeIngredientName}
                autoCapitalize="words"
              />

              {shouldShowIngredientDropdown ? (
                <View style={styles.dropdown}>
                  {filteredIngredientNames.map((ingredientName) => (
                    <Pressable
                      key={ingredientName}
                      onPress={() => {
                        onChangeIngredientName(ingredientName);
                      }}
                      style={({ pressed }) => [
                        styles.dropdownOption,
                        pressed && styles.dropdownOptionPressed,
                      ]}>
                      <Text style={styles.dropdownOptionText}>{ingredientName}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}

              <TextInput
                placeholder="Count"
                placeholderTextColor="#8a9399"
                style={[
                  styles.input,
                  styles.ingredientCountInput,
                  draftIngredientCount.length > 0 && !isIngredientCountValid && styles.inputInvalid,
                ]}
                value={draftIngredientCount}
                onChangeText={onChangeIngredientCount}
                keyboardType="number-pad"
              />

              <Pressable
                onPress={onAddIngredient}
                disabled={!canAddIngredient}
                style={({ pressed }) => [
                  styles.ingredientActionButton,
                  !canAddIngredient && styles.ingredientActionButtonDisabled,
                  pressed && canAddIngredient && styles.buttonPressed,
                ]}>
                <Text style={styles.ingredientActionButtonText}>{ingredientButtonLabel}</Text>
              </Pressable>

              <Text style={styles.helperText}>
                Add ingredients one at a time. You can pick from My Kitchen or type a new ingredient name.
              </Text>

              <View style={styles.ingredientList}>
                {draftIngredients.length > 0 ? (
                  draftIngredients.map((ingredient, index) => (
                    <View key={`${ingredient.name}-${index}`} style={styles.ingredientRow}>
                      <View style={styles.ingredientCopy}>
                        <Text style={styles.ingredientName}>{ingredient.name}</Text>
                        <Text style={styles.ingredientMeta}>
                          Count {formatMealIngredientCount(ingredient.count)}
                        </Text>
                      </View>

                      <View style={styles.ingredientActions}>
                        <Pressable
                          onPress={() => {
                            onEditIngredient(index);
                          }}
                          style={({ pressed }) => [
                            styles.smallButton,
                            styles.smallButtonMuted,
                            pressed && styles.buttonPressed,
                          ]}>
                          <Text style={styles.smallButtonMutedText}>Edit</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            onRemoveIngredient(index);
                          }}
                          style={({ pressed }) => [
                            styles.smallButton,
                            styles.smallButtonDanger,
                            pressed && styles.buttonPressed,
                          ]}>
                          <Text style={styles.smallButtonDangerText}>Remove</Text>
                        </Pressable>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyIngredientsCard}>
                    <Text style={styles.emptyIngredientsTitle}>No ingredients added yet</Text>
                    <Text style={styles.emptyIngredientsText}>
                      Leave this empty if you do not want the meal tied to kitchen inventory yet.
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nutritional Breakdown</Text>
              <TextInput
                placeholder="Optional"
                placeholderTextColor="#8a9399"
                style={[styles.input, styles.multilineInput]}
                value={draftNutritionalBreakdown}
                onChangeText={onChangeNutritionalBreakdown}
                multiline
              />
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && !isSaving && styles.buttonPressed,
                ]}
                disabled={isSaving}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={onSave}
                style={({ pressed }) => [
                  styles.primaryButton,
                  isSaveDisabled && styles.primaryButtonDisabled,
                  pressed && !isSaveDisabled && styles.buttonPressed,
                ]}
                disabled={isSaveDisabled}>
                <Text style={styles.primaryButtonText}>
                  {isSaving ? 'Saving...' : saveButtonLabel}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '88%',
    borderRadius: 26,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
    gap: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#173222',
  },
  fieldGroup: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#54635b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d7dfda',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#13222a',
  },
  ingredientCountInput: {
    maxWidth: 120,
  },
  multilineInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  inputInvalid: {
    borderColor: '#d14d41',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mealCardDropdownTrigger: {
    borderWidth: 1,
    borderColor: '#d7dfda',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  mealCardDropdownTriggerOpen: {
    borderColor: '#2f7d32',
  },
  mealCardDropdownCopy: {
    flex: 1,
    gap: 4,
  },
  mealCardDropdownLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#173222',
  },
  mealCardDropdownHint: {
    fontSize: 13,
    color: '#66756d',
  },
  mealCardDropdownChevron: {
    fontSize: 12,
    fontWeight: '700',
    color: '#587067',
  },
  mealCardDropdownMenu: {
    borderWidth: 1,
    borderColor: '#d7dfda',
    borderRadius: 16,
    backgroundColor: '#f8fbf7',
    padding: 12,
    gap: 10,
  },
  mealCardResultsScroll: {
    maxHeight: 220,
  },
  mealCardResultsContent: {
    gap: 8,
  },
  mealCardResultRow: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbe6dc',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  mealCardResultRowSelected: {
    borderColor: '#2f7d32',
    backgroundColor: '#e7f4e5',
  },
  mealCardResultCopy: {
    gap: 4,
  },
  mealCardResultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#173222',
  },
  mealCardResultTitleSelected: {
    color: '#2f7d32',
  },
  mealCardResultSubtitle: {
    fontSize: 13,
    color: '#66756d',
  },
  mealCardResultSubtitleSelected: {
    color: '#2f7d32',
  },
  emptyMealCardResults: {
    borderRadius: 14,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  emptyMealCardResultsText: {
    fontSize: 13,
    color: '#66756d',
  },
  typeChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#eef2ef',
  },
  typeChipSelected: {
    backgroundColor: '#2f7d32',
  },
  typeChipPressed: {
    opacity: 0.84,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#405249',
  },
  typeChipTextSelected: {
    color: '#ffffff',
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#66756d',
  },
  optionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d7dfda',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1ee',
  },
  dropdownOptionPressed: {
    backgroundColor: '#edf5ee',
  },
  dropdownOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2f6141',
  },
  ingredientActionButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#2f7d32',
  },
  ingredientActionButtonDisabled: {
    backgroundColor: '#91b793',
  },
  ingredientActionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  ingredientList: {
    gap: 10,
  },
  ingredientRow: {
    borderWidth: 1,
    borderColor: '#e1e9e3',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  ingredientCopy: {
    gap: 4,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#173222',
  },
  ingredientMeta: {
    fontSize: 14,
    color: '#587067',
  },
  ingredientActions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  smallButtonMuted: {
    backgroundColor: '#eef2ef',
  },
  smallButtonDanger: {
    backgroundColor: '#fdebea',
  },
  smallButtonMutedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#405249',
  },
  smallButtonDangerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b6483d',
  },
  emptyIngredientsCard: {
    borderRadius: 16,
    backgroundColor: '#f7f9f7',
    padding: 14,
    gap: 6,
  },
  emptyIngredientsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#173222',
  },
  emptyIngredientsText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#587067',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  secondaryButton: {
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#eef2ef',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#405249',
  },
  primaryButton: {
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#2f7d32',
  },
  primaryButtonDisabled: {
    backgroundColor: '#8eb591',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  buttonPressed: {
    opacity: 0.84,
  },
});
