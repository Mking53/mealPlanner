import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

type ActionButton = {
  icon: MaterialIconName;
  onPress: () => void;
  accessibilityLabel?: string;
};

type ActionableListItemProps = {
  title: string;
  subtitle?: string;
  leadingIcon?: MaterialIconName;
  leadingIconColor?: string;
  actionButtons?: ActionButton[];
  isStrikethrough?: boolean;
  onPress?: () => void;
};

export function ActionableListItem({
  title,
  subtitle,
  leadingIcon,
  leadingIconColor = COLORS.primary,
  actionButtons = [],
  isStrikethrough = false,
  onPress,
}: ActionableListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.container,
        onPress && pressed && styles.pressed,
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
            isStrikethrough && styles.strikethrough,
          ]}>
          {title}
        </Text>
        {subtitle && (
          <Text
            numberOfLines={1}
            style={[
              styles.subtitle,
              isStrikethrough && styles.subtitleStrikethrough,
            ]}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {actionButtons.map((button, index) => (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityLabel={button.accessibilityLabel}
            onPress={button.onPress}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}>
            <MaterialIcons
              name={button.icon}
              size={18}
              color={COLORS.textSecondary}
            />
          </Pressable>
        ))}
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
  },
  pressed: {
    opacity: 0.7,
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
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  subtitleStrikethrough: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonPressed: {
    opacity: 0.6,
  },
});
