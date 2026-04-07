import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

type SelectableRowProps = {
  title: string;
  subtitle?: string;
  isSelected: boolean;
  onPress: () => void;
  leadingIcon?: MaterialIconName;
  trailingIcon?: MaterialIconName;
  leadingIconColor?: string;
};

export function SelectableRow({
  title,
  subtitle,
  isSelected,
  onPress,
  leadingIcon,
  trailingIcon,
  leadingIconColor = COLORS.primary,
}: SelectableRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.selected,
        pressed && styles.pressed,
      ]}>
      <View style={styles.leading}>
        {leadingIcon && (
          <MaterialIcons
            name={leadingIcon}
            size={20}
            color={leadingIconColor}
          />
        )}
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            isSelected && styles.titleSelected,
          ]}>
          {title}
        </Text>
        {subtitle && (
          <Text
            numberOfLines={1}
            style={[
              styles.subtitle,
              isSelected && styles.subtitleSelected,
            ]}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.trailing}>
        {trailingIcon ? (
          <MaterialIcons
            name={trailingIcon}
            size={20}
            color={isSelected ? COLORS.primary : COLORS.textTertiary}
          />
        ) : (
          <View
            style={[
              styles.checkbox,
              isSelected && styles.checkboxSelected,
            ]}>
            {isSelected && (
              <MaterialIcons
                name="check"
                size={16}
                color="#ffffff"
              />
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundLight,
  },
  selected: {
    backgroundColor: COLORS.primaryLight,
  },
  pressed: {
    opacity: 0.85,
  },
  leading: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  titleSelected: {
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  subtitleSelected: {
    color: COLORS.primary,
  },
  trailing: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
});
