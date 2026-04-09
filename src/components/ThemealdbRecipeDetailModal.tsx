import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/theme';
import { ModalWrapper } from './ModalWrapper';
import type { ThemealdbRecipeDetail } from '@/src/types';

type ThemealdbRecipeDetailModalProps = {
  visible: boolean;
  recipe: ThemealdbRecipeDetail | null;
  isLoading?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
};

export function ThemealdbRecipeDetailModal({
  visible,
  recipe,
  isLoading = false,
  errorMessage = null,
  onClose,
}: ThemealdbRecipeDetailModalProps) {
  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title={recipe?.name || 'Recipe details'}
      subtitle={getSubtitle(recipe)}
      primaryAction={{
        label: 'Close',
        onPress: onClose,
      }}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>Loading recipe details...</Text>
            <Text style={styles.stateCopy}>Pulling the full recipe from TheMealDB.</Text>
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>Couldn&apos;t load this recipe</Text>
            <Text style={styles.stateCopy}>{errorMessage}</Text>
          </View>
        ) : null}

        {!isLoading && !errorMessage && recipe ? (
          <>
            {recipe.imageUrl ? (
              <Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} />
            ) : null}

            {recipe.tags.length > 0 ? (
              <View style={styles.tagRow}>
                {recipe.tags.map((tag) => (
                  <View key={tag} style={styles.tagChip}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Instructions</Text>
              <Text style={styles.sectionValue}>{recipe.instructions}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Ingredients</Text>
              {recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ingredient) => (
                  <View key={`${ingredient.name}-${ingredient.measure}`} style={styles.ingredientRow}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                    <Text style={styles.ingredientMeasure}>{ingredient.measure}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.sectionValue}>No ingredient list is available for this recipe.</Text>
              )}
            </View>

            {recipe.sourceUrl || recipe.youtubeUrl ? (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Links</Text>
                {recipe.sourceUrl ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      void Linking.openURL(recipe.sourceUrl!);
                    }}
                    style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}>
                    <Text style={styles.linkText}>Open source recipe</Text>
                  </Pressable>
                ) : null}
                {recipe.youtubeUrl ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      void Linking.openURL(recipe.youtubeUrl!);
                    }}
                    style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}>
                    <Text style={styles.linkText}>Watch on YouTube</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </ModalWrapper>
  );
}

function getSubtitle(recipe: ThemealdbRecipeDetail | null) {
  const parts = [recipe?.category, recipe?.area].filter(Boolean);

  return parts.length > 0 ? parts.join(' · ') : 'Recipe details from TheMealDB';
}

const styles = StyleSheet.create({
  scrollArea: {
    maxHeight: 440,
  },
  content: {
    gap: 16,
  },
  stateCard: {
    borderRadius: 18,
    backgroundColor: COLORS.backgroundLight,
    padding: 18,
    gap: 8,
  },
  stateTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  stateCopy: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 1.35,
    borderRadius: 22,
    backgroundColor: COLORS.backgroundLight,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    borderRadius: 999,
    backgroundColor: COLORS.backgroundLighter,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  section: {
    gap: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e6ece8',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: COLORS.textTertiary,
  },
  sectionValue: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textPrimary,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  ingredientName: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textPrimary,
  },
  ingredientMeasure: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  linkButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: COLORS.backgroundLighter,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  linkButtonPressed: {
    opacity: 0.84,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
});
