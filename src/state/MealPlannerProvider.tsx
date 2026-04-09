import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { api } from '../api/mealPlannerApi';
import {
  getNextThreeDayMeals,
  type DayMeals,
  type GroceryListItem,
  type KitchenCategory,
  type KitchenItem,
  type MealsByDate,
  type MealItem,
  type NewMealDraft,
} from '@/src/components';
import { getIsoDateString } from '@/src/utils';

type MealPlannerContextValue = {
  addGroceryItem: (name: string, category: GroceryListItem['category'], count: number) => Promise<void>;
  addKitchenInventoryItem: (name: string, category: KitchenCategory, freeCount: number) => Promise<void>;
  addMeal: (dayKey: string, dateMade: string, mealDraft: NewMealDraft) => Promise<void>;
  ensureMealsForMonth: (referenceDate: Date) => Promise<void>;
  groceryShortages: GroceryListItem[];
  isLoading: boolean;
  kitchenInventory: KitchenItem[];
  mealsByDate: MealsByDate;
  nextThreeDays: ReturnType<typeof getNextThreeDayMeals>;
  removeGroceryItem: (itemId: string) => Promise<void>;
  removeKitchenInventoryItem: (itemId: string) => Promise<void>;
  setMealMade: (mealId: string, wasMade: boolean) => void;
  toggleGroceryItemBought: (itemId: string) => Promise<void>;
  updateKitchenAllocatedCount: (itemId: string, allocatedCount: number) => Promise<void>;
  updateGroceryItemCount: (itemId: string, count: number) => Promise<void>;
  updateKitchenFreeCount: (itemId: string, freeCount: number) => Promise<void>;
  updateMealInState: (mealId: string) => MealItem | null;
};

const MealPlannerContext = createContext<MealPlannerContextValue | null>(null);

function getMonthKey(referenceDate: Date) {
  return `${referenceDate.getFullYear()}-${referenceDate.getMonth()}`;
}

function mergeMealsByDate(primary: MealsByDate, secondary: MealsByDate): MealsByDate {
  const mergedMeals: MealsByDate = {};

  for (const dateKey of Object.keys({ ...secondary, ...primary })) {
    const uniqueMeals = new Map<string, MealItem>();

    for (const meal of [...(secondary[dateKey] ?? []), ...(primary[dateKey] ?? [])]) {
      uniqueMeals.set(`${meal.dateKey}:${meal.name}:${meal.type}`, meal);
    }

    mergedMeals[dateKey] = Array.from(uniqueMeals.values());
  }

  return mergedMeals;
}

// Load entire month of meals from the database
async function loadMealsForMonthFromDb(referenceDate: Date): Promise<MealsByDate> {
  const monthStart = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const monthEnd = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);

  const startDateStr = getIsoDateString(monthStart);
  const endDateStr = getIsoDateString(monthEnd);

  try {
    const mealsResponse = await api.getPlannedMeals(startDateStr, endDateStr);

    const mealsByDateKey: MealsByDate = {};

    if (Array.isArray(mealsResponse)) {
      for (const apiMeal of mealsResponse) {
        const dateKey = getIsoDateString(new Date(apiMeal.planned_date));

        const mealItem: MealItem = {
          id: apiMeal.id,
          name: apiMeal.name,
          dateKey,
          dateMade: apiMeal.planned_date,
          type: apiMeal.meal_type as any,
          recipe: apiMeal.recipe || '',
          ingredients: apiMeal.planned_meal_ingredients?.map((ing: any) => ({
            name: ing.ingredient_name,
            count: ing.count,
          })) || [],
          nutritionalBreakdown: apiMeal.nutritional_breakdown || '',
          wasMade: apiMeal.was_made || false,
        };

        if (!mealsByDateKey[dateKey]) {
          mealsByDateKey[dateKey] = [];
        }
        mealsByDateKey[dateKey].push(mealItem);
      }
    }

    return mealsByDateKey;
  } catch (error) {
    console.error('Error loading meals for month from database:', error);
    return {};
  }
}

// Load previous, current, and next months from database
async function loadMealsForPlannerViewFromDb(referenceDate: Date): Promise<MealsByDate> {
  const [previousMonthMeals, currentMonthMeals, nextMonthMeals] = await Promise.all([
    loadMealsForMonthFromDb(new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1)),
    loadMealsForMonthFromDb(referenceDate),
    loadMealsForMonthFromDb(new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1)),
  ]);

  return {
    ...previousMonthMeals,
    ...currentMonthMeals,
    ...nextMonthMeals,
  };
}

// Load next 3 days of meals from the database
async function loadMealsForNextThreeDaysFromDb(): Promise<DayMeals[]> {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 2);

  const startDateStr = getIsoDateString(today);
  const endDateStr = getIsoDateString(endDate);

  try {
    const mealsResponse = await api.getPlannedMeals(startDateStr, endDateStr);

    // Build the structure for next 3 days
    const days: DayMeals[] = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayKey = getIsoDateString(date);

      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const fullDateLabel = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      days.push({
        dayKey,
        dayLabel,
        dateLabel,
        fullDateLabel,
        meals: [],
      });
    }

    // Transform API response to MealItem format and populate meals
    if (Array.isArray(mealsResponse)) {
      const mealsByDateKey = new Map<string, MealItem[]>();

      for (const apiMeal of mealsResponse) {
        const dateKey = getIsoDateString(new Date(apiMeal.planned_date));

        const mealItem: MealItem = {
          id: apiMeal.id,
          name: apiMeal.name,
          dateKey,
          dateMade: apiMeal.planned_date,
          type: apiMeal.meal_type as any,
          recipe: apiMeal.recipe || '',
          ingredients: apiMeal.planned_meal_ingredients?.map((ing: any) => ({
            name: ing.ingredient_name,
            count: ing.count,
          })) || [],
          nutritionalBreakdown: apiMeal.nutritional_breakdown || '',
          wasMade: apiMeal.was_made || false,
        };

        if (!mealsByDateKey.has(dateKey)) {
          mealsByDateKey.set(dateKey, []);
        }
        mealsByDateKey.get(dateKey)!.push(mealItem);
      }

      // Populate meals for each day
      for (const day of days) {
        day.meals = mealsByDateKey.get(day.dayKey) || [];
      }
    }

    return days;
  } catch (error) {
    console.error('Error loading next 3 days from database:', error);
    // Fall back to empty days structure if API fails
    const days: DayMeals[] = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayKey = getIsoDateString(date);

      days.push({
        dayKey,
        dayLabel: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDateLabel: date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        meals: [],
      });
    }
    return days;
  }
}

function mapApiKitchenItem(item: any): KitchenItem {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    freeCount: item.free_count ?? 0,
    allocatedCount: item.allocated_count ?? 0,
    isBought: item.is_bought ?? true,
  };
}

function mapApiGroceryItem(item: any): GroceryListItem {
  const normalizedCategory =
    item.category === 'Produce' || item.category === 'General'
      ? item.category
      : 'General';

  return {
    id: item.id,
    name: item.name,
    category: normalizedCategory,
    count: item.count ?? 1,
    isBought: item.is_bought ?? false,
  };
}

export function MealPlannerProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mealsByDate, setMealsByDate] = useState<MealsByDate>({});
  const [kitchenInventory, setKitchenInventory] = useState<KitchenItem[]>([]);
  const [groceryShortages, setGroceryShortages] = useState<GroceryListItem[]>([]);
  const [loadedMonthKeys, setLoadedMonthKeys] = useState<string[]>([]);

  const ensureMealsForMonth = useCallback(async (referenceDate: Date) => {
    const monthKey = getMonthKey(referenceDate);

    if (loadedMonthKeys.includes(monthKey)) {
      return;
    }

    const plannerMeals = await loadMealsForMonthFromDb(referenceDate);

    setMealsByDate((currentMeals) => mergeMealsByDate(plannerMeals, currentMeals));
    setLoadedMonthKeys((currentKeys) =>
      currentKeys.includes(monthKey) ? currentKeys : [...currentKeys, monthKey]
    );
  }, [loadedMonthKeys]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialState() {
      const [homeDays, plannerMeals, kitchenItems, groceryItems] = await Promise.all([
        loadMealsForNextThreeDaysFromDb(),
        loadMealsForPlannerViewFromDb(new Date()),
        api.getKitchenItems(),
        api.getGroceryItems(),
      ]);

      if (!isMounted) {
        return;
      }

      const homeMeals: MealsByDate = homeDays.reduce<MealsByDate>((map, day) => {
        map[day.dayKey] = day.meals;
        return map;
      }, {});

      // Use plannerMeals as primary so it includes all database meals, with any additional home meals merged in
      setMealsByDate(mergeMealsByDate(plannerMeals, homeMeals));
      setKitchenInventory(Array.isArray(kitchenItems) ? kitchenItems.map(mapApiKitchenItem) : []);
      setGroceryShortages(Array.isArray(groceryItems) ? groceryItems.map(mapApiGroceryItem) : []);
      const today = new Date();
      setLoadedMonthKeys([
        getMonthKey(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
        getMonthKey(new Date(today.getFullYear(), today.getMonth(), 1)),
        getMonthKey(new Date(today.getFullYear(), today.getMonth() + 1, 1)),
      ]);
      setIsLoading(false);
    }

    void loadInitialState();

    return () => {
      isMounted = false;
    };
  }, []);

  const nextThreeDays = useMemo(
    () => getNextThreeDayMeals(mealsByDate, new Date()),
    [mealsByDate]
  );

  async function addMeal(dayKey: string, dateMade: string, mealDraft: NewMealDraft) {
    try {
      // Convert ingredients from MealIngredient[] to string[]
      const ingredientNames = mealDraft.ingredients?.map((ing) => ing.name) ?? [];

      // Meal type is already in correct format: 'Breakfast', 'Lunch', or 'Dinner'
      const mealTypeForApi = (mealDraft.type || 'Dinner') as string;

      // Call the real API to create planned meal
      await api.createPlannedMeal({
        name: mealDraft.name,
        mealType: mealTypeForApi,
        plannedDate: dayKey,
        recipe: mealDraft.recipe,
        nutritionalBreakdown: mealDraft.nutritionalBreakdown,
        ingredients: ingredientNames,
        groupId: mealDraft.groupId ?? null,
        mealCardId: mealDraft.mealCardId ?? undefined,
      });

      // Re-fetch meals for this date to get the server-generated ID and data
      const mealResponse = await api.getPlannedMeals(dayKey, dayKey);

      if (Array.isArray(mealResponse)) {
        // Convert API response to MealItem format
        const newMeals: MealItem[] = mealResponse.map((apiMeal) => ({
          id: apiMeal.id,
          name: apiMeal.name,
          dateKey: dayKey,
          dateMade,
          type: apiMeal.meal_type as any,
          recipe: apiMeal.recipe || '',
          ingredients: apiMeal.planned_meal_ingredients?.map((ing: any) => ({
            name: ing.ingredient_name,
            count: ing.count,
          })) || [],
          nutritionalBreakdown: apiMeal.nutritional_breakdown || '',
          wasMade: apiMeal.was_made || false,
        }));

        setMealsByDate((currentMeals) => {
          const mealsForDate = currentMeals[dayKey] ?? [];
          // Only add meals that aren't already in state
          const existingIds = new Set(mealsForDate.map((m) => m.id));
          const uniqueNewMeals = newMeals.filter((m) => !existingIds.has(m.id));

          return {
            ...currentMeals,
            [dayKey]: [...mealsForDate, ...uniqueNewMeals],
          };
        });
      }
    } catch (error) {
      console.error('Error adding meal:', error);
      throw error;
    }
  }

  function setMealMade(mealId: string, wasMade: boolean) {
    setMealsByDate((currentMeals) => {
      const nextMealsByDate: MealsByDate = {};

      for (const [dateKey, meals] of Object.entries(currentMeals)) {
        nextMealsByDate[dateKey] = meals.map((meal) =>
          meal.id === mealId
            ? {
                ...meal,
                wasMade,
              }
            : meal
        );
      }

      return nextMealsByDate;
    });
  }

  async function addGroceryItem(name: string, category: GroceryListItem['category'], count: number) {
    const response = await api.createGroceryItem({
      name,
      category,
      count,
      isBought: false,
      derivedFromPlanner: false,
    });

    setGroceryShortages((currentItems) => [...currentItems, mapApiGroceryItem(response)]);
  }

  async function toggleGroceryItemBought(itemId: string) {
    const existingItem = groceryShortages.find((item) => item.id === itemId);

    if (!existingItem) {
      return;
    }

    const updatedItem = await api.updateGroceryItem(itemId, {
      isBought: !existingItem.isBought,
    });

    setGroceryShortages((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? mapApiGroceryItem(updatedItem) : item))
    );
  }

  async function updateGroceryItemCount(itemId: string, count: number) {
    const updatedItem = await api.updateGroceryItem(itemId, { count });

    setGroceryShortages((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? mapApiGroceryItem(updatedItem) : item))
    );
  }

  async function removeGroceryItem(itemId: string) {
    await api.deleteGroceryItem(itemId);
    setGroceryShortages((currentItems) => currentItems.filter((item) => item.id !== itemId));
  }

  async function updateKitchenFreeCount(itemId: string, freeCount: number) {
    const existingItem = kitchenInventory.find((item) => item.id === itemId);

    if (!existingItem) {
      return;
    }

    const updatedItem = await api.updateKitchenItem(itemId, {
      freeCount,
      allocatedCount: existingItem.allocatedCount,
      isBought: existingItem.isBought,
    });

    setKitchenInventory((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? mapApiKitchenItem(updatedItem) : item))
    );
  }

  async function updateKitchenAllocatedCount(itemId: string, allocatedCount: number) {
    const existingItem = kitchenInventory.find((item) => item.id === itemId);

    if (!existingItem) {
      return;
    }

    const updatedItem = await api.updateKitchenItem(itemId, {
      freeCount: existingItem.freeCount,
      allocatedCount,
      isBought: existingItem.isBought,
    });

    setKitchenInventory((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? mapApiKitchenItem(updatedItem) : item))
    );
  }

  async function addKitchenInventoryItem(name: string, category: KitchenCategory, freeCount: number) {
    const response = await api.createKitchenItem({
      name,
      category,
      freeCount,
      allocatedCount: 0,
      isBought: true,
    });

    setKitchenInventory((currentItems) => [...currentItems, mapApiKitchenItem(response)]);
  }

  async function removeKitchenInventoryItem(itemId: string) {
    await api.deleteKitchenItem(itemId);
    setKitchenInventory((currentItems) => currentItems.filter((item) => item.id !== itemId));
  }

  function updateMealInState(mealId: string) {
    for (const meals of Object.values(mealsByDate)) {
      const meal = meals.find((entry) => entry.id === mealId);

      if (meal) {
        return meal;
      }
    }

    return null;
  }

  return (
    <MealPlannerContext.Provider
      value={{
        addGroceryItem,
        addKitchenInventoryItem,
        addMeal,
        ensureMealsForMonth,
        groceryShortages,
        isLoading,
        kitchenInventory,
        mealsByDate,
        nextThreeDays,
        removeGroceryItem,
        removeKitchenInventoryItem,
        setMealMade,
        toggleGroceryItemBought,
        updateKitchenAllocatedCount,
        updateGroceryItemCount,
        updateKitchenFreeCount,
        updateMealInState,
      }}>
      {children}
    </MealPlannerContext.Provider>
  );
}

export function useMealPlanner() {
  const context = useContext(MealPlannerContext);

  if (!context) {
    throw new Error('useMealPlanner must be used within MealPlannerProvider');
  }

  return context;
}
