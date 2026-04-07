import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';
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
    backgroundColor: COLORS.backdropText,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    maxHeight: '80%',
    borderRadius: 24,
    backgroundColor: COLORS.background,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  optionList: {
    gap: 10,
  },
  optionRow: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  optionRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  optionRowPressed: {
    opacity: 0.88,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  optionTitleSelected: {
    color: COLORS.success,
  },
  optionMeta: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  optionMetaSelected: {
    color: COLORS.success,
  },
  optionDate: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
    color: COLORS.textSecondary,
  },
  optionDateSelected: {
    color: COLORS.success,
    fontWeight: '600',
  },
  selectionCard: {
    borderRadius: 18,
    backgroundColor: COLORS.backgroundLighter,
    padding: 14,
    gap: 4,
  },
  selectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  selectionValue: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textPrimary,
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
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textInvert,
  },
  buttonPressed: {
    opacity: 0.86,
  },
});
