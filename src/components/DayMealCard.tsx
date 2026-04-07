import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DayMeals, MealItem } from './mealModels';

type DayMealCardProps = {
  day: DayMeals;
  onSelectMeal: (meal: MealItem) => void;
};

export function DayMealCard({ day, onSelectMeal }: DayMealCardProps) {
  return (
    <View style={styles.dayCard}>
      <View>
        <Text style={styles.dayTitle}>{day.dayLabel}</Text>
        <Text style={styles.dayDate}>{day.dateLabel}</Text>
      </View>

      <View style={styles.mealsList}>
        {day.meals.map((meal) => (
          <Pressable
            key={meal.id}
            accessibilityRole="button"
            onPress={() => {
              onSelectMeal(meal);
            }}
            style={({ pressed }) => [styles.mealChip, pressed && styles.mealChipPressed]}>
            <Text style={styles.mealChipText}>{meal.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dayCard: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 16,
    shadowColor: '#1f2a1f',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 3,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#152033',
  },
  dayDate: {
    marginTop: 4,
    fontSize: 14,
    color: '#62707c',
  },
  mealsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mealChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#edf6ed',
  },
  mealChipPressed: {
    opacity: 0.78,
  },
  mealChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27502a',
  },
});
