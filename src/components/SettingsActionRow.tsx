import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { CardWrapper } from './CardWrapper';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

type SettingsActionRowProps = {
  iconName: MaterialIconName;
  label: string;
  onPress: () => void;
};

export function SettingsActionRow({ iconName, label, onPress }: SettingsActionRowProps) {
  return (
    <CardWrapper noShadow style={styles.cardWrapper}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
        <View style={styles.leading}>
          <View style={styles.iconWrap}>
            <MaterialIcons name={iconName} size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.label}>{label}</Text>
        </View>

        <MaterialIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
      </Pressable>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    padding: 0,
  },
  row: {
    minHeight: 62,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowPressed: {
    opacity: 0.84,
  },
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
