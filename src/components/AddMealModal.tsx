import { useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  formatMealIngredientCount,
  getFilteredMealIngredientNames,
  MEAL_TYPES,
  type MealIngredient,
  type MealType,
} from './mealModels';

type AddMealModalProps = {
  availableIngredientNames: string[];
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
  saveButtonLabel?: string;
  showDateField?: boolean;
  onAddIngredient: () => void;
  onChangeDate: (value: string) => void;
  onChangeIngredientCount: (value: string) => void;
  onChangeIngredientName: (value: string) => void;
  onChangeName: (value: string) => void;
  onChangeNutritionalBreakdown: (value: string) => void;
  onChangeRecipe: (value: string) => void;
  onChangeType: (value: MealType) => void;
  onClose: () => void;
  onEditIngredient: (index: number) => void;
  onRemoveIngredient: (index: number) => void;
  onSave: () => void;
  visible: boolean;
};

export function AddMealModal({
  availableIngredientNames,
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
  saveButtonLabel = 'Save',
  showDateField = true,
  onAddIngredient,
  onChangeDate,
  onChangeIngredientCount,
  onChangeIngredientName,
  onChangeName,
  onChangeNutritionalBreakdown,
  onChangeRecipe,
  onChangeType,
  onClose,
  onEditIngredient,
  onRemoveIngredient,
  onSave,
  visible,
}: AddMealModalProps) {
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

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={() => {}} style={styles.card}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>{modalTitle}</Text>

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
