import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { ProfileDayOption } from './profileModels';

type AddSavedMealToDayModalProps = {
  isSaving: boolean;
  mealName: string;
  onClose: () => void;
  onConfirm: () => void;
  onSelectDay: (dayKey: string) => void;
  selectedDayKey: string | null;
  visible: boolean;
  dayOptions: ProfileDayOption[];
};

export function AddSavedMealToDayModal({
  isSaving,
  mealName,
  onClose,
  onConfirm,
  onSelectDay,
  selectedDayKey,
  visible,
  dayOptions,
}: AddSavedMealToDayModalProps) {
  const selectedOption = dayOptions.find((option) => option.dayKey === selectedDayKey) ?? null;

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={() => {}} style={styles.card}>
          <Text style={styles.title}>Add Meal Card</Text>
          <Text style={styles.subtitle}>Choose a day for {mealName}.</Text>

          <ScrollView contentContainerStyle={styles.optionList} showsVerticalScrollIndicator={false}>
            {dayOptions.map((option) => {
              const isSelected = option.dayKey === selectedDayKey;

              return (
                <Pressable
                  key={option.dayKey}
                  accessibilityRole="button"
                  onPress={() => {
                    onSelectDay(option.dayKey);
                  }}
                  style={({ pressed }) => [
                    styles.optionRow,
                    isSelected && styles.optionRowSelected,
                    pressed && styles.optionRowPressed,
                  ]}>
                  <View>
                    <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                      {option.dayLabel}
                    </Text>
                    <Text style={[styles.optionMeta, isSelected && styles.optionMetaSelected]}>
                      {option.shortLabel}
                    </Text>
                  </View>

                  <Text style={[styles.optionDate, isSelected && styles.optionDateSelected]}>
                    {option.fullDateLabel}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.selectionCard}>
            <Text style={styles.selectionLabel}>Selected Day</Text>
            <Text style={styles.selectionValue}>
              {selectedOption?.fullDateLabel ?? 'Choose a day to continue'}
            </Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              accessibilityRole="button"
              disabled={isSaving}
              onPress={onClose}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && !isSaving && styles.buttonPressed,
              ]}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={selectedDayKey === null || isSaving}
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.primaryButton,
                (selectedDayKey === null || isSaving) && styles.primaryButtonDisabled,
                pressed && selectedDayKey !== null && !isSaving && styles.buttonPressed,
              ]}>
              <Text style={styles.primaryButtonText}>{isSaving ? 'Adding...' : 'Confirm'}</Text>
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
    backgroundColor: 'rgba(17, 24, 28, 0.42)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    maxHeight: '80%',
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#173222',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5b6c61',
  },
  optionList: {
    gap: 10,
  },
  optionRow: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dce8dd',
    backgroundColor: '#f8fbf7',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  optionRowSelected: {
    borderColor: '#2f7d32',
    backgroundColor: '#e7f4e5',
  },
  optionRowPressed: {
    opacity: 0.88,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#173222',
  },
  optionTitleSelected: {
    color: '#225f26',
  },
  optionMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#5b6c61',
  },
  optionMetaSelected: {
    color: '#39713d',
  },
  optionDate: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
    color: '#5b6c61',
  },
  optionDateSelected: {
    color: '#225f26',
    fontWeight: '600',
  },
  selectionCard: {
    borderRadius: 18,
    backgroundColor: '#f4f8f3',
    padding: 14,
    gap: 4,
  },
  selectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5b6c61',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  selectionValue: {
    fontSize: 15,
    lineHeight: 22,
    color: '#173222',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1ddd1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4d5f54',
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#2f7d32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  buttonPressed: {
    opacity: 0.86,
  },
});
