import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, CARD_STYLES } from '../constants/theme';
import { CardWrapper } from './CardWrapper';

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
      <CardWrapper style={styles.wrapper}>
        <Text style={styles.mealType}>{meal.type}</Text>
        <Text style={styles.mealName}>{meal.name}</Text>
      </CardWrapper>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 96,
  },
  cardPressed: {
    opacity: 0.82,
  },
  wrapper: {
    backgroundColor: COLORS.success,
    borderRadius: CARD_STYLES.borderRadiusMedium,
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 10,
  },
  mealType: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  mealName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
