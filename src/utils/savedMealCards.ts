import type { MealItem, NewMealDraft } from '@/src/components/mealModels';
import type { SavedMealCard } from '@/src/components/profileModels';

export function mapApiMealCardToSavedMealCard(data: any): SavedMealCard {
  return {
    id: data.id,
    name: data.name,
    type: data.meal_type,
    recipe: data.recipe,
    nutritionalBreakdown: data.nutritional_breakdown,
    imageUri: data.image_url,
    lastUsedDate: data.last_used_at ? data.last_used_at.split('T')[0] : undefined,
    ingredients: (data.meal_card_ingredients || []).map((ingredient: any) => ({
      name: ingredient.ingredient_name,
      count: ingredient.count,
    })),
  };
}

export function mapApiMealCardsToSavedMealCards(response: any): SavedMealCard[] {
  const cards = Array.isArray(response) ? response : response?.meals || [];
  return cards.map(mapApiMealCardToSavedMealCard);
}

export function createMealDraftFromSavedMealCard(mealCard: SavedMealCard): NewMealDraft {
  return {
    mealCardId: mealCard.id,
    name: mealCard.name,
    type: mealCard.type,
    recipe: mealCard.recipe,
    ingredients: mealCard.ingredients.map((ingredient) => ({ ...ingredient })),
    nutritionalBreakdown: mealCard.nutritionalBreakdown,
  };
}

export function createMealCardInputFromMeal(meal: MealItem) {
  return {
    name: meal.name,
    mealType: meal.type,
    recipe: meal.recipe,
    nutritionalBreakdown: meal.nutritionalBreakdown,
    ingredients: meal.ingredients.map((ingredient) => ingredient.name),
  };
}
