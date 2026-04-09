import { StyleSheet, Text, TextInput, View } from 'react-native';

import { CARD_STYLES, COLORS } from '../constants/theme';
import { ModalWrapper } from './ModalWrapper';

type MealCardNamePromptModalProps = {
  visible: boolean;
  title?: string;
  subtitle?: string;
  value: string;
  helperText?: string;
  isSaving?: boolean;
  onChangeValue: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export function MealCardNamePromptModal({
  visible,
  title = 'Change meal card name',
  subtitle = 'Meal card names must be unique. Update the name and try again.',
  value,
  helperText,
  isSaving = false,
  onChangeValue,
  onClose,
  onSave,
}: MealCardNamePromptModalProps) {
  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      primaryAction={{
        label: isSaving ? 'Saving...' : 'Save to My Meal Cards',
        onPress: onSave,
        disabled: value.trim().length === 0 || isSaving,
      }}
      secondaryAction={{
        label: 'Cancel',
        onPress: onClose,
      }}>
      <View style={styles.content}>
        <Text style={styles.label}>Meal Card Name</Text>
        <TextInput
          autoCapitalize="words"
          editable={!isSaving}
          onChangeText={onChangeValue}
          placeholder="Enter a unique meal card name"
          placeholderTextColor={COLORS.textDisabled}
          style={[styles.input, isSaving && styles.inputDisabled]}
          value={value}
        />
        {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: CARD_STYLES.borderRadiusSmall,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  inputDisabled: {
    backgroundColor: COLORS.backgroundLight,
    opacity: 0.7,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.error,
  },
});
