import { Pressable, StyleSheet, Text, View } from 'react-native';

type DayTileProps = {
  day: number | null;
  hasMeals: boolean;
  isSelected: boolean;
  isPlaceholder?: boolean;
  onPress: () => void;
};

export function DayTile({
  day,
  hasMeals,
  isSelected,
  isPlaceholder = false,
  onPress,
}: DayTileProps) {
  if (isPlaceholder || day === null) {
    return <View style={styles.tileWrapper} />;
  }

  return (
    <View style={styles.tileWrapper}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.tile,
          hasMeals && styles.tileHasMeals,
          isSelected && styles.tileSelected,
          pressed && styles.tilePressed,
        ]}>
        <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{day}</Text>
        {hasMeals && !isSelected ? <View style={styles.dot} /> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tileWrapper: {
    width: '14.2857%',
    padding: 4,
  },
  tile: {
    aspectRatio: 1,
    borderRadius: 18,
    backgroundColor: '#edf1ed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  tileHasMeals: {
    backgroundColor: '#dcefd8',
  },
  tileSelected: {
    backgroundColor: '#2f7d32',
  },
  tilePressed: {
    opacity: 0.84,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#203028',
  },
  dayTextSelected: {
    color: '#ffffff',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2f7d32',
  },
});
