import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { formatSavedMealLastUsedDate, getInitials, type SavedMealCard } from './profileModels';
import { CardWrapper } from './CardWrapper';
import { Avatar } from './Avatar';

type SavedMealCardRowProps = {
  meal: SavedMealCard;
  onPress: (meal: SavedMealCard) => void;
  onAddToDay: (meal: SavedMealCard) => void;
  onRemove?: (meal: SavedMealCard) => void;
  isRemoving?: boolean;
};

export function SavedMealCardRow({
  meal,
  onAddToDay,
  onPress,
  onRemove,
  isRemoving = false,
}: SavedMealCardRowProps) {
  function handlePress() {
    onPress(meal);
  }

  return (
    <CardWrapper style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        style={({ pressed }) => [
          styles.mainPressable,
          pressed && styles.cardPressed,
        ]}>
        <View style={styles.content}>
          <Avatar
            imageUri={meal.imageUri}
            initials={getInitials(meal.name)}
            size="large"
          />

          <View style={styles.copyColumn}>
            <View style={styles.titleRow}>
              <Text style={styles.mealType}>{meal.type}</Text>
              <Text style={styles.lastUsed}>
                {formatSavedMealLastUsedDate(meal.lastUsedDate)}
              </Text>
            </View>
            <Text style={styles.title}>{meal.name}</Text>
            <Text numberOfLines={2} style={styles.recipePreview}>
              {meal.recipe}
            </Text>
          </View>
        </View>
      </Pressable>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <MaterialIcons name="restaurant-menu" size={16} color="#5b6c61" />
          <Text style={styles.footerInfoText}>
            {meal.ingredients.length} ingredient
            {meal.ingredients.length === 1 ? '' : 's'}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            onAddToDay(meal);
          }}
          style={({ pressed }) => [styles.cta, pressed && styles.cardPressed]}>
          <Text style={styles.ctaText}>Add to Day</Text>
          <MaterialIcons name="arrow-forward" size={16} color={COLORS.primary} />
        </Pressable>

        {onRemove ? (
          <Pressable
            accessibilityRole="button"
            disabled={isRemoving}
            onPress={() => {
              onRemove(meal);
            }}
            style={({ pressed }) => [
              styles.removeButton,
              isRemoving && styles.removeButtonDisabled,
              pressed && !isRemoving && styles.cardPressed,
            ]}>
            <Text style={styles.removeButtonText}>
              {isRemoving ? 'Removing...' : 'Remove'}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
  },
  mainPressable: {
    gap: 14,
  },
  cardPressed: {
    opacity: 0.86,
  },
  content: {
    flexDirection: 'row',
    gap: 14,
  },
  copyColumn: {
    flex: 1,
    gap: 8,
  },
  titleRow: {
    gap: 4,
  },
  mealType: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  lastUsed: {
    fontSize: 13,
    color: '#66776c',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  recipePreview: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eef3ed',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  footerInfoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  removeButton: {
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: '#fdebea',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonDisabled: {
    opacity: 0.7,
  },
  removeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.error,
  },
});
