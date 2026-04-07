import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, CARD_STYLES } from '../constants/theme';

import { ModalWrapper } from './ModalWrapper';
import { ValidatedInput } from './ValidatedInput';
import type { ItemCategory } from './mealModels';

type AddGroceryItemModalProps<TCategory extends ItemCategory> = {
  categories: readonly TCategory[];
  draftCategory: TCategory;
  draftCount: string;
  draftName: string;
  isCountValid: boolean;
  onChangeCategory: (category: TCategory) => void;
  onChangeCount: (value: string) => void;
  onChangeName: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  visible: boolean;
};

export function AddGroceryItemModal<TCategory extends ItemCategory>({
  categories,
  draftCategory,
  draftCount,
  draftName,
  isCountValid,
  onChangeCategory,
  onChangeCount,
  onChangeName,
  onClose,
  onSave,
  visible,
}: AddGroceryItemModalProps<TCategory>) {
  const isSaveDisabled = draftName.trim().length === 0 || draftCount.trim().length === 0 || !isCountValid;

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Add Item"
      primaryAction={{
        label: 'Save',
        onPress: onSave,
        disabled: isSaveDisabled,
      }}
      secondaryAction={{
        label: 'Cancel',
        onPress: onClose,
      }}>
      <ValidatedInput
        label="Item Name"
        placeholder="Enter grocery item"
        value={draftName}
        onChangeText={onChangeName}
      />

      <ValidatedInput
        label="Count"
        placeholder="Enter count"
        value={draftCount}
        onChangeText={onChangeCount}
        isValid={isCountValid}
        helperText={
          draftCount.trim().length > 0 && !isCountValid
            ? 'Please enter a valid count'
            : undefined
        }
        keyboardType="number-pad"
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => {
                onChangeCategory(category);
              }}
              style={({ pressed }) => [
                styles.categoryChip,
                draftCategory === category && styles.categoryChipSelected,
                pressed && styles.categoryChipPressed,
              ]}>
              <Text
                style={[
                  styles.categoryChipText,
                  draftCategory === category && styles.categoryChipTextSelected,
                ]}>
                {category}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.backgroundLight,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
  },
  categoryChipPressed: {
    opacity: 0.84,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#405249',
  },
  categoryChipTextSelected: {
    color: COLORS.textInvert,
  },
});
