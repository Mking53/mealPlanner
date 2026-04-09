import type {
  ThemealdbRecipeCategory,
  ThemealdbRecipeDetail,
  ThemealdbRecipeIngredient,
  ThemealdbRecipeSummary,
} from '@/src/types/themealdb';

type ThemealdbMeal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strTags?: string;
  strYoutube?: string;
  strSource?: string;
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
};

type ThemealdbMealsResponse = {
  meals: ThemealdbMeal[] | null;
};

type ThemealdbCategory = {
  idCategory: string;
  strCategory: string;
  strCategoryDescription?: string;
  strCategoryThumb?: string;
};

type ThemealdbCategoriesResponse = {
  categories: ThemealdbCategory[] | null;
};

class ThemealdbApi {
  constructor(
    private readonly baseUrl: string = process.env.EXPO_PUBLIC_THEMEALDB_BASE_URL ||
      'https://www.themealdb.com/api/json/v1/1'
  ) {}

  private async request<T>(path: string, params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    const response = await fetch(`${this.baseUrl}${path}${query ? `?${query}` : ''}`);

    if (!response.ok) {
      throw new Error(`TheMealDB request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  }

  async listCategories(): Promise<ThemealdbRecipeCategory[]> {
    const response = await this.request<ThemealdbCategoriesResponse>('/categories.php');
    const categories = response.categories ?? [];

    return categories.map((category) => ({
      id: category.idCategory,
      name: category.strCategory,
      description: category.strCategoryDescription?.trim(),
      thumbnailUrl: category.strCategoryThumb?.trim(),
    }));
  }

  async searchMealsByName(name: string): Promise<ThemealdbRecipeSummary[]> {
    const response = await this.request<ThemealdbMealsResponse>('/search.php', { s: name.trim() });
    return (response.meals ?? []).map((meal) => mapMealToSummary(meal, true));
  }

  async searchMealsByFirstLetter(letter: string): Promise<ThemealdbRecipeSummary[]> {
    const normalizedLetter = letter.trim().charAt(0);
    const response = await this.request<ThemealdbMealsResponse>('/search.php', { f: normalizedLetter });
    return (response.meals ?? []).map((meal) => mapMealToSummary(meal, true));
  }

  async filterMealsByCategory(category: string): Promise<ThemealdbRecipeSummary[]> {
    const response = await this.request<ThemealdbMealsResponse>('/filter.php', { c: category.trim() });
    return (response.meals ?? []).map((meal) =>
      mapMealToSummary(
        {
          ...meal,
          strCategory: category.trim(),
        },
        false
      )
    );
  }

  async filterMealsByIngredient(ingredient: string): Promise<ThemealdbRecipeSummary[]> {
    const response = await this.request<ThemealdbMealsResponse>('/filter.php', { i: ingredient.trim() });
    return (response.meals ?? []).map((meal) => mapMealToSummary(meal, false));
  }

  async getMealById(id: string): Promise<ThemealdbRecipeDetail | null> {
    const response = await this.request<ThemealdbMealsResponse>('/lookup.php', { i: id });
    const meal = response.meals?.[0];

    return meal ? mapMealToDetail(meal) : null;
  }
}

function mapMealToSummary(meal: ThemealdbMeal, hasFullDetails: boolean): ThemealdbRecipeSummary {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    imageUrl: meal.strMealThumb,
    category: meal.strCategory?.trim(),
    area: meal.strArea?.trim(),
    recipePreview: getSummaryPreview(meal, hasFullDetails),
    hasFullDetails,
  };
}

function mapMealToDetail(meal: ThemealdbMeal): ThemealdbRecipeDetail {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    imageUrl: meal.strMealThumb,
    category: meal.strCategory?.trim(),
    area: meal.strArea?.trim(),
    instructions: meal.strInstructions?.trim() || 'No instructions available for this recipe yet.',
    ingredients: getMealIngredients(meal),
    tags: meal.strTags
      ?.split(',')
      .map((tag) => tag.trim())
      .filter(Boolean) || [],
    youtubeUrl: meal.strYoutube?.trim() || undefined,
    sourceUrl: meal.strSource?.trim() || undefined,
  };
}

function getMealIngredients(meal: ThemealdbMeal): ThemealdbRecipeIngredient[] {
  return Array.from({ length: 20 }, (_, index) => index + 1)
    .map((index) => {
      const ingredient = meal[`strIngredient${index}`]?.trim();
      const measure = meal[`strMeasure${index}`]?.trim();

      if (!ingredient) {
        return null;
      }

      return {
        name: ingredient,
        measure: measure || 'As needed',
      };
    })
    .filter((ingredient): ingredient is ThemealdbRecipeIngredient => ingredient !== null);
}

function getSummaryPreview(meal: ThemealdbMeal, hasFullDetails: boolean) {
  if (hasFullDetails) {
    const instructions = meal.strInstructions?.replace(/\s+/g, ' ').trim();

    if (instructions) {
      return instructions;
    }
  }

  return 'Open recipe to view instructions and ingredients.';
}

export const themealdbApi = new ThemealdbApi();
