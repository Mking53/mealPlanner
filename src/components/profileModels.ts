import type { MealIngredient, MealType } from './mealModels';

export type SavedMealCard = {
  id: string;
  name: string;
  type: MealType;
  recipe: string;
  ingredients: MealIngredient[];
  nutritionalBreakdown: string;
  lastUsedDate?: string;
  imageUri?: string;
};

export type ProfileDayOption = {
  dayKey: string;
  dayLabel: string;
  shortLabel: string;
  fullDateLabel: string;
};

export const MOCK_PROFILE_NAME = 'Maya Carter';
export const MOCK_PROFILE_IMAGE_URI =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80';

export const MOCK_SAVED_MEAL_CARDS: SavedMealCard[] = [
  {
    id: 'saved-meal-1',
    name: 'Lemon Garlic Salmon Bowl',
    type: 'Dinner',
    recipe:
      'Roast salmon with garlic and lemon, then serve over rice with cucumbers and a spoonful of yogurt sauce.',
    ingredients: [
      { name: 'Salmon Fillets', count: 2 },
      { name: 'Jasmine Rice', count: 1 },
      { name: 'Cucumbers', count: 1 },
      { name: 'Greek Yogurt', count: 1 },
    ],
    nutritionalBreakdown: 'Protein-forward dinner with healthy fats, complex carbs, and fresh vegetables.',
    lastUsedDate: '2026-04-02',
    imageUri:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'saved-meal-2',
    name: 'Berry Protein Overnight Oats',
    type: 'Breakfast',
    recipe:
      'Mix oats, chia seeds, protein yogurt, and berries in a jar. Chill overnight and top with almonds before serving.',
    ingredients: [
      { name: 'Rolled Oats', count: 1 },
      { name: 'Greek Yogurt', count: 1 },
      { name: 'Mixed Berries', count: 1 },
      { name: 'Chia Seeds', count: 1 },
    ],
    nutritionalBreakdown: 'Balanced breakfast with fiber, protein, and slow-release energy.',
    lastUsedDate: '2026-03-28',
  },
  {
    id: 'saved-meal-3',
    name: 'Turkey Pesto Wrap Box',
    type: 'Lunch',
    recipe:
      'Layer turkey, pesto, spinach, and tomatoes in a tortilla. Slice and pack with fruit for an easy lunch.',
    ingredients: [
      { name: 'Sliced Turkey', count: 1 },
      { name: 'Flour Tortillas', count: 2 },
      { name: 'Spinach', count: 1 },
      { name: 'Cherry Tomatoes', count: 1 },
    ],
    nutritionalBreakdown: 'Portable lunch with lean protein, greens, and moderate carbs.',
    imageUri:
      'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'saved-meal-4',
    name: 'Veggie Stir Fry Night',
    type: 'Dinner',
    recipe:
      'Saute tofu and vegetables in a savory garlic-ginger sauce and serve over brown rice.',
    ingredients: [
      { name: 'Tofu', count: 1 },
      { name: 'Brown Rice', count: 1 },
      { name: 'Bell Peppers', count: 2 },
      { name: 'Broccoli', count: 1 },
    ],
    nutritionalBreakdown: 'Plant-based dinner with colorful vegetables and a hearty grain base.',
    lastUsedDate: '2026-03-15',
  },
];

export function buildCurrentMonthDayOptions(referenceDate: Date): ProfileDayOption[] {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month, index + 1, 12, 0, 0, 0);

    return {
      dayKey: date.toISOString().slice(0, 10),
      dayLabel: date.toLocaleDateString('en-US', { weekday: 'long' }),
      shortLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDateLabel: formatFullDateLabel(date),
    };
  });
}

export function getDefaultDayKey(referenceDate: Date, options: ProfileDayOption[]) {
  const todayDayKey = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    12,
    0,
    0,
    0
  )
    .toISOString()
    .slice(0, 10);

  return options.find((option) => option.dayKey === todayDayKey)?.dayKey ?? options[0]?.dayKey ?? null;
}

export function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return '?';
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
}

export function formatSavedMealLastUsedDate(lastUsedDate?: string) {
  if (!lastUsedDate) {
    return 'Not used recently';
  }

  const parsedDate = new Date(`${lastUsedDate}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Not used recently';
  }

  return `Last used ${parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
}

export function createSavedMealCardDraft(meal: SavedMealCard) {
  return {
    name: meal.name,
    type: meal.type,
    recipe: meal.recipe,
    ingredients: meal.ingredients.map((ingredient) => ({ ...ingredient })),
    nutritionalBreakdown: meal.nutritionalBreakdown,
  };
}

function formatFullDateLabel(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
