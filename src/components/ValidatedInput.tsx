import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CARD_STYLES, COLORS } from '../constants/theme';

type ValidatedInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  isValid?: boolean;
  helperText?: string;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
};

export function ValidatedInput({
  label,
  placeholder,
  value,
  onChangeText,
  isValid = true,
  helperText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
}: ValidatedInputProps) {
  const hasValue = value.trim().length > 0;
  const showError = hasValue && !isValid;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.textDisabled}
        style={[
          styles.input,
          showError && styles.inputInvalid,
          !editable && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
      />
      {helperText && (
        <Text style={[styles.helperText, showError && styles.helperTextError]}>
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  inputInvalid: {
    borderColor: COLORS.errorLight,
  },
  inputDisabled: {
    backgroundColor: COLORS.backgroundLight,
    opacity: 0.6,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.warning,
  },
  helperTextError: {
    color: COLORS.error,
  },
});
