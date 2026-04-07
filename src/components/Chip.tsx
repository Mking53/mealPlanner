import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

type ChipVariant = 'outlined' | 'filled' | 'removable';

type ChipProps = {
  text: string;
  variant?: ChipVariant;
  isSelected?: boolean;
  onRemove?: () => void;
  onPress?: () => void;
};

export function Chip({
  text,
  variant = 'outlined',
  isSelected = false,
  onRemove,
  onPress,
}: ChipProps) {
  const showRemoveIcon = variant === 'removable' && onRemove;

  const containerStyles = [
    styles.container,
    getVariantStyles(variant, isSelected),
    onPress && styles.pressable,
  ];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        containerStyles,
        onPress && pressed && styles.pressed,
      ]}>
      <Text
        style={[
          styles.text,
          getTextColor(variant, isSelected),
        ]}>
        {text}
      </Text>

      {showRemoveIcon && (
        <Pressable
          onPress={onRemove}
          style={({ pressed }) => [
            styles.removeButton,
            pressed && styles.removeButtonPressed,
          ]}>
          <MaterialIcons
            name="close"
            size={16}
            color={getRemoveIconColor(variant)}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

function getVariantStyles(variant: ChipVariant, isSelected: boolean) {
  const baseStyle = {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  };

  switch (variant) {
    case 'outlined':
      return {
        ...baseStyle,
        borderWidth: 1,
        borderColor: isSelected ? COLORS.primary : COLORS.border,
        backgroundColor: isSelected ? COLORS.primaryLight : '#f8fbf7',
      } as const;
    case 'filled':
      return {
        ...baseStyle,
        backgroundColor: isSelected ? COLORS.primary : COLORS.border,
      } as const;
    case 'removable':
      return {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.backgroundLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 6,
      };
    default:
      return baseStyle;
  }
}

function getTextColor(variant: ChipVariant, isSelected: boolean) {
  if (variant === 'filled') {
    return {
      color: isSelected ? '#ffffff' : COLORS.textSecondary,
    };
  }
  if (variant === 'removable') {
    return {
      color: COLORS.textPrimary,
    };
  }
  return {
    color: isSelected ? COLORS.primary : COLORS.textSecondary,
  };
}

function getRemoveIconColor(variant: ChipVariant) {
  return COLORS.textSecondary;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center' as const,
  },
  pressable: {
    flexDirection: 'row' as const,
    gap: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    padding: 4,
  },
  removeButtonPressed: {
    opacity: 0.6,
  },
});
