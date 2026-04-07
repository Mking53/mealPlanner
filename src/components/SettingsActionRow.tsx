import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

type SettingsActionRowProps = {
  iconName: MaterialIconName;
  label: string;
  onPress: () => void;
};

export function SettingsActionRow({ iconName, label, onPress }: SettingsActionRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <View style={styles.leading}>
        <View style={styles.iconWrap}>
          <MaterialIcons name={iconName} size={20} color="#2f7d32" />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>

      <MaterialIcons name="chevron-right" size={24} color="#7c8d83" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 62,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#16301c',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
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
    backgroundColor: '#e7f4e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#173222',
  },
});
