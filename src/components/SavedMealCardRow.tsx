import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatSavedMealLastUsedDate, getInitials, type SavedMealCard } from './profileModels';

type SavedMealCardRowProps = {
  meal: SavedMealCard;
  onPress: (meal: SavedMealCard) => void;
  onAddToDay: (meal: SavedMealCard) => void;
};

export function SavedMealCardRow({ meal, onAddToDay, onPress }: SavedMealCardRowProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowImage = Boolean(meal.imageUri) && !hasImageError;

  function handlePress() {
    onPress(meal);
  }

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        style={({ pressed }) => [styles.mainPressable, pressed && styles.cardPressed]}>
        <View style={styles.content}>
          {shouldShowImage ? (
            <Image
              source={{ uri: meal.imageUri }}
              style={styles.image}
              onError={() => {
                setHasImageError(true);
              }}
            />
          ) : (
            <View style={styles.imageFallback}>
              <Text style={styles.imageFallbackText}>{getInitials(meal.name)}</Text>
            </View>
          )}

          <View style={styles.copyColumn}>
            <View style={styles.titleRow}>
              <Text style={styles.mealType}>{meal.type}</Text>
              <Text style={styles.lastUsed}>{formatSavedMealLastUsedDate(meal.lastUsedDate)}</Text>
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
            {meal.ingredients.length} ingredient{meal.ingredients.length === 1 ? '' : 's'}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            onAddToDay(meal);
          }}
          style={({ pressed }) => [styles.cta, pressed && styles.cardPressed]}>
          <Text style={styles.ctaText}>Add to Day</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#2f7d32" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 16,
    gap: 14,
    shadowColor: '#16301c',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 4,
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
  image: {
    width: 88,
    height: 88,
    borderRadius: 18,
    backgroundColor: '#dcefd8',
  },
  imageFallback: {
    width: 88,
    height: 88,
    borderRadius: 18,
    backgroundColor: '#dcefd8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFallbackText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2f7d32',
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
    color: '#2f7d32',
  },
  lastUsed: {
    fontSize: 13,
    color: '#66776c',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#173222',
  },
  recipePreview: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5b6c61',
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
  },
  footerInfoText: {
    fontSize: 13,
    color: '#5b6c61',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2f7d32',
  },
});
