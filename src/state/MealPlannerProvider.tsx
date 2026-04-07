import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  addMealForThreeDayPlan,
  buildInventoryState,
  getNextThreeDayMeals,
  type GroceryListItem,
  type KitchenCategory,
  type KitchenItem,
  loadKitchenItemsFromMeals,
  loadMealsForNextThreeDays,
  loadMealsForPlannerView,
  type MealsByDate,
  type MealItem,
  type NewMealDraft,
} from '@/src/components';

type MealPlannerContextValue = {
  addKitchenInventoryItem: (name: string, category: KitchenCategory, freeCount: number) => void;
  addMeal: (dayKey: string, dateMade: string, mealDraft: NewMealDraft) => Promise<void>;
  groceryShortages: GroceryListItem[];
  isLoading: boolean;
  kitchenInventory: KitchenItem[];
  mealsByDate: MealsByDate;
  nextThreeDays: ReturnType<typeof getNextThreeDayMeals>;
  removeKitchenInventoryItem: (itemId: string) => void;
  setMealMade: (mealId: string, wasMade: boolean) => void;
  updateKitchenFreeCount: (itemId: string, freeCount: number) => void;
  updateMealInState: (mealId: string) => MealItem | null;
};

const MealPlannerContext = createContext<MealPlannerContextValue | null>(null);

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

export function MealPlannerProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mealsByDate, setMealsByDate] = useState<MealsByDate>({});
  const [baseKitchenInventory, setBaseKitchenInventory] = useState<KitchenItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialState() {
      const [homeDays, plannerMeals, kitchenInventory] = await Promise.all([
        loadMealsForNextThreeDays(),
        loadMealsForPlannerView(new Date()),
        loadKitchenItemsFromMeals(),
      ]);

      if (!isMounted) {
        return;
      }

      const homeMeals: MealsByDate = homeDays.reduce<MealsByDate>((map, day) => {
        map[day.dayKey] = day.meals;
        return map;
      }, {});

      setMealsByDate(mergeMealsByDate(homeMeals, plannerMeals));
      setBaseKitchenInventory(kitchenInventory);
      setIsLoading(false);
    }

    void loadInitialState();

    return () => {
      isMounted = false;
    };
  }, []);

  const inventoryState = useMemo(
    () => buildInventoryState(mealsByDate, baseKitchenInventory, new Date()),
    [baseKitchenInventory, mealsByDate]
  );

  const nextThreeDays = useMemo(
    () => getNextThreeDayMeals(mealsByDate, new Date()),
    [mealsByDate]
  );

  async function addMeal(dayKey: string, dateMade: string, mealDraft: NewMealDraft) {
    const nextMealNumber = (mealsByDate[dayKey]?.length ?? 0) + 1;
    const meal = await addMealForThreeDayPlan(dayKey, dateMade, nextMealNumber, mealDraft);

    setMealsByDate((currentMeals) => ({
      ...currentMeals,
      [dayKey]: [...(currentMeals[dayKey] ?? []), meal],
    }));
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

  function updateKitchenFreeCount(itemId: string, freeCount: number) {
    setBaseKitchenInventory((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === itemId);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                freeCount,
              }
            : item
        );
      }

      const derivedItem = inventoryState.kitchenInventory.find((item) => item.id === itemId);

      if (!derivedItem) {
        return currentItems;
      }

      return [
        ...currentItems,
        {
          ...derivedItem,
          freeCount,
          allocatedCount: 0,
        },
      ];
    });
  }

  function addKitchenInventoryItem(name: string, category: KitchenCategory, freeCount: number) {
    setBaseKitchenInventory((currentItems) => [
      ...currentItems,
      {
        id: `inventory-${category.toLowerCase()}-${Date.now()}`,
        name,
        category,
        freeCount,
        allocatedCount: 0,
        isBought: true,
      },
    ]);
  }

  function removeKitchenInventoryItem(itemId: string) {
    setBaseKitchenInventory((currentItems) => currentItems.filter((item) => item.id !== itemId));
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
        addKitchenInventoryItem,
        addMeal,
        groceryShortages: inventoryState.groceryShortages,
        isLoading,
        kitchenInventory: inventoryState.kitchenInventory,
        mealsByDate,
        nextThreeDays,
        removeKitchenInventoryItem,
        setMealMade,
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
