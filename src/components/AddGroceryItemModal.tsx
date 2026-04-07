import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={() => {}} style={styles.card}>
          <Text style={styles.title}>Add Item</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Item Name</Text>
            <TextInput
              placeholder="Enter grocery item"
              placeholderTextColor="#8a9399"
              style={styles.input}
              value={draftName}
              onChangeText={onChangeName}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Count</Text>
            <TextInput
              placeholder="Enter count"
              placeholderTextColor="#8a9399"
              style={[styles.input, !isCountValid && draftCount.trim().length > 0 && styles.inputInvalid]}
              value={draftCount}
              onChangeText={onChangeCount}
              keyboardType="number-pad"
            />
          </View>

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

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
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
              <Text style={styles.primaryButtonText}>Save</Text>
            </Pressable>
          </View>
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
    maxWidth: 420,
    borderRadius: 26,
    backgroundColor: '#ffffff',
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
  inputInvalid: {
    borderColor: '#d14d41',
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
    backgroundColor: '#eef2ef',
  },
  categoryChipSelected: {
    backgroundColor: '#2f7d32',
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
    color: '#ffffff',
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
    backgroundColor: '#86b189',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  buttonPressed: {
    opacity: 0.86,
  },
});
