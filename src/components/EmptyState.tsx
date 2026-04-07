import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CARD_STYLES, COLORS } from '../constants/theme';

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: string;
  iconColor?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  iconColor = COLORS.textTertiary,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && (
        <MaterialIcons name={icon as any} size={32} color={iconColor} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: CARD_STYLES.borderRadiusMedium,
    backgroundColor: COLORS.backgroundLight,
    padding: 14,
    gap: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
});
