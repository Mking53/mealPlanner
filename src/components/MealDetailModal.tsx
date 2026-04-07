import { Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import {
  EMPTY_MEAL_FIELD_VALUE,
  formatMealIngredientCount,
  isPastMealDate,
  type MealItem,
} from './mealModels';

type MealDetailModalProps = {
  meal: MealItem | null;
  onToggleMade?: (mealId: string, wasMade: boolean) => void;
  visible: boolean;
  onClose: () => void;
};

export function MealDetailModal({ meal, visible, onClose, onToggleMade }: MealDetailModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable onPress={() => {}} style={styles.modalCard}>
          <Pressable
            accessibilityLabel="Close meal details"
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}>
            <Text style={styles.closeButtonText}>X</Text>
          </Pressable>

          {meal ? (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{meal.name}</Text>
              <View style={styles.detailList}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Meal Name</Text>
                  <Text style={styles.detailValue}>{meal.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date Made</Text>
                  <Text style={styles.detailValue}>{meal.dateMade}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text style={styles.detailValue}>{meal.type}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Recipe</Text>
                  <Text style={styles.detailValue}>{meal.recipe}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ingredients</Text>
                  {meal.ingredients.length > 0 ? (
                    <View style={styles.ingredientList}>
                      {meal.ingredients.map((ingredient, index) => (
                        <View key={`${ingredient.name}-${index}`} style={styles.ingredientRow}>
                          <Text style={styles.detailValue}>{ingredient.name}</Text>
                          <Text style={styles.ingredientCount}>
                            {formatMealIngredientCount(ingredient.count)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.detailValue}>{EMPTY_MEAL_FIELD_VALUE}</Text>
                  )}
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nutritional Breakdown</Text>
                  <Text style={styles.detailValue}>{meal.nutritionalBreakdown}</Text>
                </View>
                {isPastMealDate(meal.dateKey) ? (
                  <View style={styles.madeRow}>
                    <View style={styles.madeCopy}>
                      <Text style={styles.detailLabel}>Meal Made</Text>
                      <Text style={styles.detailValue}>
                        {meal.wasMade ? 'Ingredients consumed from My Kitchen.' : 'Ingredients return to free inventory.'}
                      </Text>
                    </View>
                    <Switch
                      value={meal.wasMade}
                      onValueChange={(value) => {
                        onToggleMade?.(meal.id, value);
                      }}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
    shadowColor: '#111827',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 26,
    elevation: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef2f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonPressed: {
    opacity: 0.78,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#152033',
  },
  modalContent: {
    gap: 18,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#152033',
  },
  detailList: {
    gap: 14,
  },
  detailRow: {
    gap: 6,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e6ece8',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#587067',
  },
  detailValue: {
    fontSize: 15,
    lineHeight: 22,
    color: '#152033',
  },
  madeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e6ece8',
  },
  madeCopy: {
    flex: 1,
    gap: 6,
  },
  ingredientList: {
    gap: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    backgroundColor: '#f6f8f4',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  ingredientCount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2f7d32',
  },
});
