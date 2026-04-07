import { Pressable, StyleSheet, Text } from 'react-native';

import type { MealItem } from './mealModels';

type SelectedMealCardProps = {
  meal: MealItem;
  onPress: (meal: MealItem) => void;
};

export function SelectedMealCard({ meal, onPress }: SelectedMealCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        onPress(meal);
      }}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <Text style={styles.mealType}>{meal.type}</Text>
      <Text style={styles.mealName}>{meal.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 96,
    borderRadius: 18,
    backgroundColor: '#dcefd8',
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 10,
  },
  cardPressed: {
    opacity: 0.82,
  },
  mealType: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2f7d32',
  },
  mealName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: '#173222',
  },
});
