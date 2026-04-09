export type ThemealdbSearchMode = 'category' | 'name' | 'firstLetter' | 'ingredient';

export type ThemealdbRecipeCategory = {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
};

export type ThemealdbRecipeIngredient = {
  name: string;
  measure: string;
};

export type ThemealdbRecipeSummary = {
  id: string;
  name: string;
  imageUrl: string;
  category?: string;
  area?: string;
  recipePreview: string;
  hasFullDetails: boolean;
};

export type ThemealdbRecipeDetail = {
  id: string;
  name: string;
  imageUrl: string;
  category?: string;
  area?: string;
  instructions: string;
  ingredients: ThemealdbRecipeIngredient[];
  tags: string[];
  youtubeUrl?: string;
  sourceUrl?: string;
};

export const THEMEALDB_SEARCH_MODE_OPTIONS: {
  id: ThemealdbSearchMode;
  label: string;
  helperText: string;
}[] = [
  {
    id: 'category',
    label: 'Category',
    helperText: 'Browse meals by category.',
  },
  {
    id: 'name',
    label: 'Name',
    helperText: 'Search meals by name.',
  },
  {
    id: 'firstLetter',
    label: 'First Letter',
    helperText: 'Search by the first letter only.',
  },
  {
    id: 'ingredient',
    label: 'Main Ingredient',
    helperText: 'Filter meals by a main ingredient.',
  },
];

export function getThemealdbSearchModeLabel(mode: ThemealdbSearchMode) {
  return THEMEALDB_SEARCH_MODE_OPTIONS.find((option) => option.id === mode)?.label ?? 'Category';
}
