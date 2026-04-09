import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/theme';
import { Avatar } from './Avatar';
import { CardWrapper } from './CardWrapper';
import { getInitials } from './profileModels';
import type { ThemealdbRecipeSummary } from '@/src/types';

type ThemealdbRecipeCardProps = {
  recipe: ThemealdbRecipeSummary;
  onPress: (recipe: ThemealdbRecipeSummary) => void;
  onAddToMealCards: (recipe: ThemealdbRecipeSummary) => void;
  isSavingToMealCards?: boolean;
};

export function ThemealdbRecipeCard({
  recipe,
  onPress,
  onAddToMealCards,
  isSavingToMealCards = false,
}: ThemealdbRecipeCardProps) {
  const metaLabel = getMetaLabel(recipe);
  const originLabel = getOriginLabel(recipe);

  return (
    <CardWrapper style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          onPress(recipe);
        }}
        style={({ pressed }) => [styles.mainPressable, pressed && styles.cardPressed]}>
        <View style={styles.content}>
          <Avatar
            imageUri={recipe.imageUrl}
            initials={getInitials(recipe.name)}
            size="large"
          />

          <View style={styles.copyColumn}>
            <View style={styles.titleRow}>
              <Text style={styles.metaLabel}>{metaLabel}</Text>
              <Text style={styles.originLabel}>{originLabel}</Text>
            </View>
            <Text style={styles.title}>{recipe.name}</Text>
            <Text numberOfLines={2} style={styles.recipePreview}>
              {recipe.recipePreview}
            </Text>
          </View>
        </View>
      </Pressable>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <MaterialIcons name="menu-book" size={16} color="#5b6c61" />
          <Text style={styles.footerInfoText}>
            {recipe.hasFullDetails ? 'Recipe preview available' : 'Tap to load recipe details'}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={isSavingToMealCards}
          onPress={() => {
            onAddToMealCards(recipe);
          }}
          style={({ pressed }) => [
            styles.secondaryCta,
            isSavingToMealCards && styles.secondaryCtaDisabled,
            pressed && !isSavingToMealCards && styles.cardPressed,
          ]}>
          <Text style={styles.secondaryCtaText}>
            {isSavingToMealCards ? 'Saving...' : 'My Meal Cards'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            onPress(recipe);
          }}
          style={({ pressed }) => [styles.cta, pressed && styles.cardPressed]}>
          <Text style={styles.ctaText}>View Recipe</Text>
          <MaterialIcons name="arrow-forward" size={16} color={COLORS.primary} />
        </Pressable>
      </View>
    </CardWrapper>
  );
}

function getMetaLabel(recipe: ThemealdbRecipeSummary) {
  if (recipe.category) {
    return recipe.category;
  }

  if (recipe.area) {
    return recipe.area;
  }

  return 'Featured Recipe';
}

function getOriginLabel(recipe: ThemealdbRecipeSummary) {
  if (recipe.category && recipe.area) {
    return recipe.area;
  }

  return 'TheMealDB';
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
  metaLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  originLabel: {
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
    flex: 1,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secondaryCta: {
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: COLORS.backgroundLighter,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  secondaryCtaDisabled: {
    opacity: 0.7,
  },
  secondaryCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
