export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';
export type MealIngredient = {
  name: string;
  count: number;
};

export type MealItem = {
  id: string;
  name: string;
  dateKey: string;
  dateMade: string;
  type: MealType;
  recipe: string;
  ingredients: MealIngredient[];
  nutritionalBreakdown: string;
  wasMade: boolean;
};

export type NewMealDraft = {
  name: string;
  type?: MealType | '';
  recipe?: string;
  ingredients?: MealIngredient[];
  nutritionalBreakdown?: string;
};

export type DayMeals = {
  dayKey: string;
  dayLabel: string;
  dateLabel: string;
  fullDateLabel: string;
  meals: MealItem[];
};

export type CalendarDayCell = {
  key: string;
  day: number | null;
  dateKey: string | null;
  isPlaceholder: boolean;
};

export type MealsByDate = Record<string, MealItem[]>;
export type GroceryListCategory = 'Produce' | 'General';
export type KitchenCategory = 'Fridge' | 'Frozen' | 'Pantry';
export type ItemCategory = GroceryListCategory | KitchenCategory;
export type WeekMealsDay = {
  date: Date;
  dateKey: string;
  dayLabel: string;
  fullDateLabel: string;
  meals: MealItem[];
};

export type GroceryListItem = {
  id: string;
  name: string;
  category: GroceryListCategory;
  count: number;
  isBought: boolean;
};

export type KitchenItem = {
  id: string;
  name: string;
  category: KitchenCategory;
  freeCount: number;
  allocatedCount: number;
  isBought: boolean;
};

export type CategorizedItem = GroceryListItem | KitchenItem;
export type RecipeIngredientRequirement = {
  category: GroceryListCategory;
  count: number;
  kitchenCategory: KitchenCategory;
  name: string;
};
export type MealInventoryState = {
  groceryShortages: GroceryListItem[];
  kitchenInventory: KitchenItem[];
  mealsByDate: MealsByDate;
};

type MealSeed = {
  name: string;
  type: MealType;
};

type GrocerySeed = {
  name: string;
  category: 'Protein' | 'Grains' | 'Produce';
};

const PLACEHOLDER_DELAY_MS = 350;

export const PLACEHOLDER_RECIPE = 'Recipe test';
export const PLACEHOLDER_NUTRITION = 'Nutritional Breakdown test';
export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const GROCERY_LIST_CATEGORIES: GroceryListCategory[] = ['Produce', 'General'];
export const KITCHEN_CATEGORIES: KitchenCategory[] = ['Fridge', 'Frozen', 'Pantry'];
export const MEAL_TYPES: MealType[] = ['Breakfast', 'Lunch', 'Dinner'];
export const EMPTY_MEAL_FIELD_VALUE = 'None';

function createDateAtNoon(baseDate: Date, day = 1) {
  return new Date(baseDate.getFullYear(), baseDate.getMonth(), day, 12, 0, 0, 0);
}

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(baseDate: Date, dayOffset: number) {
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + dayOffset);
  return nextDate;
}

function formatMonthDayYear(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatFullDateLabel(referenceDate: Date) {
  return formatMonthDayYear(referenceDate);
}

export function formatDateInputValue(referenceDate: Date) {
  return referenceDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
}

export function parseDateInputValue(value: string) {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    return null;
  }

  const [, monthValue, dayValue, yearValue] = match;
  const month = Number(monthValue);
  const day = Number(dayValue);
  const year = Number(yearValue);

  if (month < 1 || month > 12 || day < 1) {
    return null;
  }

  const parsedDate = new Date(year, month - 1, day, 12, 0, 0, 0);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  return parsedDate;
}

export function getDateKeyFromDateInput(value: string) {
  const parsedDate = parseDateInputValue(value);

  return parsedDate ? getDateKey(parsedDate) : null;
}

function createMealItem(
  id: string,
  name: string,
  dateKey: string,
  dateMade: string,
  type: MealType
): MealItem {
  const ingredients = getGrocerySeedsForMeal(name).map((item) => ({
    name: item.name,
    count: 1,
  }));

  return {
    id,
    name,
    dateKey,
    dateMade,
    type,
    recipe: PLACEHOLDER_RECIPE,
    ingredients,
    nutritionalBreakdown: PLACEHOLDER_NUTRITION,
    wasMade: false,
  };
}

function getMealFieldValue(value?: string) {
  const trimmedValue = value?.trim();

  return trimmedValue && trimmedValue.length > 0 ? trimmedValue : EMPTY_MEAL_FIELD_VALUE;
}

function createCustomMealItem(
  id: string,
  dateKey: string,
  dateMade: string,
  mealDraft: NewMealDraft,
  fallbackType: MealType = 'Dinner'
): MealItem {
  return {
    id,
    name: mealDraft.name.trim(),
    dateKey,
    dateMade,
    type: mealDraft.type || fallbackType,
    recipe: getMealFieldValue(mealDraft.recipe),
    ingredients: (mealDraft.ingredients ?? [])
      .map((ingredient) => ({
        name: ingredient.name.trim(),
        count: ingredient.count,
      }))
      .filter((ingredient) => ingredient.name.length > 0),
    nutritionalBreakdown: getMealFieldValue(mealDraft.nutritionalBreakdown),
    wasMade: false,
  };
}

function formatShortMonthDay(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatWeekdayLabel(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function mergeMealsByDate(...mealMaps: MealsByDate[]) {
  return mealMaps.reduce<MealsByDate>((combinedMeals, mealMap) => {
    for (const [dateKey, meals] of Object.entries(mealMap)) {
      combinedMeals[dateKey] = meals;
    }

    return combinedMeals;
  }, {});
}

function buildNextThreeDays(referenceDate: Date): DayMeals[] {
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate(), 12, 0, 0, 0);

  return Array.from({ length: 3 }, (_, index) => {
    const date = addDays(today, index);

    return {
      dayKey: getDateKey(date),
      dayLabel: formatWeekdayLabel(date),
      dateLabel: formatShortMonthDay(date),
      fullDateLabel: formatMonthDayYear(date),
      meals: [],
    };
  });
}

function getThreeDayMealSeeds(dayIndex: number): MealSeed[] {
  return (
    [
      [
        { name: 'Avocado Toast', type: 'Breakfast' as MealType },
        { name: 'Salmon Rice Bowl', type: 'Dinner' as MealType },
      ],
      [
        { name: 'Greek Yogurt Parfait', type: 'Breakfast' as MealType },
        { name: 'Chicken Pesto Pasta', type: 'Lunch' as MealType },
      ],
      [
        { name: 'Berry Oatmeal', type: 'Breakfast' as MealType },
        { name: 'Turkey Wrap', type: 'Lunch' as MealType },
      ],
    ][dayIndex] ?? [{ name: 'Chef Special', type: 'Dinner' as MealType }]
  );
}

function getAllSeededMealNames() {
  const mealNames = new Set<string>();

  for (let index = 0; index < 3; index += 1) {
    for (const meal of getThreeDayMealSeeds(index)) {
      mealNames.add(meal.name);
    }
  }

  for (const day of [3, 8, 14, 23, 27]) {
    for (const meal of getMealSeedsForDay(day)) {
      mealNames.add(meal.name);
    }
  }

  return Array.from(mealNames);
}

function getGrocerySeedsForMeal(mealName: string): GrocerySeed[] {
  const groceryMap: Record<string, GrocerySeed[]> = {
    'Avocado Toast': [
      { name: 'Eggs', category: 'Protein' },
      { name: 'Sourdough Bread', category: 'Grains' },
      { name: 'Avocados', category: 'Produce' },
    ],
    'Salmon Rice Bowl': [
      { name: 'Salmon Fillets', category: 'Protein' },
      { name: 'Jasmine Rice', category: 'Grains' },
      { name: 'Cucumbers', category: 'Produce' },
    ],
    'Greek Yogurt Parfait': [
      { name: 'Greek Yogurt', category: 'Protein' },
      { name: 'Granola', category: 'Grains' },
      { name: 'Blueberries', category: 'Produce' },
    ],
    'Chicken Pesto Pasta': [
      { name: 'Chicken Breast', category: 'Protein' },
      { name: 'Penne Pasta', category: 'Grains' },
      { name: 'Cherry Tomatoes', category: 'Produce' },
    ],
    'Berry Oatmeal': [
      { name: 'Rolled Oats', category: 'Grains' },
      { name: 'Strawberries', category: 'Produce' },
    ],
    'Turkey Wrap': [
      { name: 'Sliced Turkey', category: 'Protein' },
      { name: 'Flour Tortillas', category: 'Grains' },
      { name: 'Romaine Lettuce', category: 'Produce' },
    ],
    'Spinach Omelet': [
      { name: 'Eggs', category: 'Protein' },
      { name: 'Spinach', category: 'Produce' },
    ],
    'Chicken Caesar Wrap': [
      { name: 'Chicken Breast', category: 'Protein' },
      { name: 'Wraps', category: 'Grains' },
      { name: 'Romaine Lettuce', category: 'Produce' },
    ],
    'Garlic Shrimp Pasta': [
      { name: 'Shrimp', category: 'Protein' },
      { name: 'Linguine', category: 'Grains' },
      { name: 'Garlic', category: 'Produce' },
    ],
    'Blueberry Pancakes': [
      { name: 'Eggs', category: 'Protein' },
      { name: 'Pancake Mix', category: 'Grains' },
      { name: 'Blueberries', category: 'Produce' },
    ],
    'Mediterranean Bowl': [
      { name: 'Chickpeas', category: 'Protein' },
      { name: 'Quinoa', category: 'Grains' },
      { name: 'Cucumbers', category: 'Produce' },
    ],
    'Lemon Herb Salmon': [
      { name: 'Salmon Fillets', category: 'Protein' },
      { name: 'Couscous', category: 'Grains' },
      { name: 'Lemons', category: 'Produce' },
    ],
    'Chia Berry Parfait': [
      { name: 'Greek Yogurt', category: 'Protein' },
      { name: 'Granola', category: 'Grains' },
      { name: 'Mixed Berries', category: 'Produce' },
    ],
    'Turkey Club Sandwich': [
      { name: 'Sliced Turkey', category: 'Protein' },
      { name: 'Sandwich Bread', category: 'Grains' },
      { name: 'Tomatoes', category: 'Produce' },
    ],
    'Veggie Stir Fry': [
      { name: 'Tofu', category: 'Protein' },
      { name: 'Brown Rice', category: 'Grains' },
      { name: 'Bell Peppers', category: 'Produce' },
    ],
    'Apple Cinnamon Oats': [
      { name: 'Rolled Oats', category: 'Grains' },
      { name: 'Apples', category: 'Produce' },
    ],
    'Caprese Panini': [
      { name: 'Mozzarella', category: 'Protein' },
      { name: 'Ciabatta Rolls', category: 'Grains' },
      { name: 'Basil', category: 'Produce' },
    ],
    'Steak and Potatoes': [
      { name: 'Sirloin Steak', category: 'Protein' },
      { name: 'Potatoes', category: 'Produce' },
    ],
    'Chef Special': [
      { name: 'Chicken Breast', category: 'Protein' },
      { name: 'Rice', category: 'Grains' },
      { name: 'Broccoli', category: 'Produce' },
    ],
  };

  return groceryMap[mealName] ?? [];
}

function mapGrocerySeedToListCategory(category: GrocerySeed['category']): GroceryListCategory {
  return category === 'Produce' ? 'Produce' : 'General';
}

function mapGroceryItemToKitchenCategory(item: GroceryListItem): KitchenCategory {
  const normalizedName = item.name.toLowerCase();

  if (
    normalizedName.includes('ice cream') ||
    normalizedName.includes('frozen') ||
    normalizedName.includes('shrimp') ||
    normalizedName.includes('berries')
  ) {
    return 'Frozen';
  }

  if (
    normalizedName.includes('milk') ||
    normalizedName.includes('yogurt') ||
    normalizedName.includes('egg') ||
    normalizedName.includes('chicken') ||
    normalizedName.includes('salmon') ||
    normalizedName.includes('turkey') ||
    normalizedName.includes('steak') ||
    normalizedName.includes('mozzarella') ||
    normalizedName.includes('tofu') ||
    normalizedName.includes('avocado') ||
    normalizedName.includes('cucumber') ||
    normalizedName.includes('lettuce') ||
    normalizedName.includes('spinach') ||
    normalizedName.includes('tomato') ||
    normalizedName.includes('bell pepper') ||
    normalizedName.includes('lemon') ||
    normalizedName.includes('broccoli')
  ) {
    return 'Fridge';
  }

  return 'Pantry';
}

function mapIngredientNameToKitchenCategory(name: string): KitchenCategory {
  return mapGroceryItemToKitchenCategory({
    id: name.toLowerCase(),
    name,
    category: 'General',
    count: 1,
    isBought: false,
  });
}

function mapIngredientNameToGroceryCategory(name: string): GroceryListCategory {
  const normalizedName = name.toLowerCase();

  if (
    normalizedName.includes('avocado') ||
    normalizedName.includes('cucumber') ||
    normalizedName.includes('blueberr') ||
    normalizedName.includes('strawberr') ||
    normalizedName.includes('romaine') ||
    normalizedName.includes('spinach') ||
    normalizedName.includes('garlic') ||
    normalizedName.includes('lemon') ||
    normalizedName.includes('mixed berries') ||
    normalizedName.includes('tomato') ||
    normalizedName.includes('bell pepper') ||
    normalizedName.includes('apple') ||
    normalizedName.includes('basil') ||
    normalizedName.includes('potato') ||
    normalizedName.includes('broccoli')
  ) {
    return 'Produce';
  }

  return 'General';
}

function getMealSeedsForDay(dayOfMonth: number): MealSeed[] {
  const seededMeals: Record<number, MealSeed[]> = {
    3: [
      { name: 'Spinach Omelet', type: 'Breakfast' },
      { name: 'Chicken Caesar Wrap', type: 'Lunch' },
      { name: 'Garlic Shrimp Pasta', type: 'Dinner' },
    ],
    8: [
      { name: 'Blueberry Pancakes', type: 'Breakfast' },
      { name: 'Mediterranean Bowl', type: 'Lunch' },
      { name: 'Lemon Herb Salmon', type: 'Dinner' },
    ],
    14: [
      { name: 'Chia Berry Parfait', type: 'Breakfast' },
      { name: 'Turkey Club Sandwich', type: 'Lunch' },
      { name: 'Veggie Stir Fry', type: 'Dinner' },
    ],
    23: [
      { name: 'Avocado Toast', type: 'Breakfast' },
      { name: 'Chicken Pesto Pasta', type: 'Lunch' },
      { name: 'Salmon Rice Bowl', type: 'Dinner' },
    ],
    27: [
      { name: 'Apple Cinnamon Oats', type: 'Breakfast' },
      { name: 'Caprese Panini', type: 'Lunch' },
      { name: 'Steak and Potatoes', type: 'Dinner' },
    ],
  };

  return seededMeals[dayOfMonth] ?? [];
}

export function formatMonthLabel(referenceDate: Date) {
  return referenceDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function formatSelectedDayTitle(referenceDate: Date) {
  return `${referenceDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })} - Meals`;
}

export function formatWeekRange(referenceDate: Date) {
  const current = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    12,
    0,
    0,
    0
  );
  const dayOfWeek = current.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = addDays(current, diffToMonday);
  const weekEnd = addDays(weekStart, 6);

  const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const endYear = weekEnd.getFullYear();

  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${startMonth} ${startDay}-${endDay}, ${endYear}`;
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
}

export function getSundayStartOfWeek(referenceDate: Date) {
  const current = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    12,
    0,
    0,
    0
  );

  return addDays(current, -current.getDay());
}

export function getWeekDates(referenceDate: Date) {
  const weekStart = getSundayStartOfWeek(referenceDate);

  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function formatSelectedWeekTitle(referenceDate: Date) {
  return `${formatWeekRangeSundayStart(referenceDate)} - Meals`;
}

export function formatWeekRangeSundayStart(referenceDate: Date) {
  const weekDates = getWeekDates(referenceDate);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const endYear = weekEnd.getFullYear();

  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${startMonth} ${startDay}-${endDay}, ${endYear}`;
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
}

export async function loadMealsForNextThreeDays(): Promise<DayMeals[]> {
  const today = new Date();
  const days = buildNextThreeDays(today);

  await new Promise((resolve) => setTimeout(resolve, PLACEHOLDER_DELAY_MS + 100));

  return days.map((day, index) => ({
    ...day,
    meals: getThreeDayMealSeeds(index).map((meal, mealIndex) =>
      createMealItem(`${day.dayKey}-seed-${mealIndex}`, meal.name, day.dayKey, day.fullDateLabel, meal.type)
    ),
  }));
}

export function shiftMonth(referenceDate: Date, delta: number) {
  return new Date(referenceDate.getFullYear(), referenceDate.getMonth() + delta, 1, 12, 0, 0, 0);
}

export function buildCalendarGrid(referenceDate: Date): CalendarDayCell[] {
  const monthStart = createDateAtNoon(referenceDate, 1);
  const daysInMonth = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0,
    12,
    0,
    0,
    0
  ).getDate();
  const leadingPlaceholders = monthStart.getDay();
  const cells: CalendarDayCell[] = [];

  for (let index = 0; index < leadingPlaceholders; index += 1) {
    cells.push({
      key: `placeholder-start-${index}`,
      day: null,
      dateKey: null,
      isPlaceholder: true,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = createDateAtNoon(referenceDate, day);
    cells.push({
      key: getDateKey(date),
      day,
      dateKey: getDateKey(date),
      isPlaceholder: false,
    });
  }

  const trailingPlaceholders = (7 - (cells.length % 7)) % 7;

  for (let index = 0; index < trailingPlaceholders; index += 1) {
    cells.push({
      key: `placeholder-end-${index}`,
      day: null,
      dateKey: null,
      isPlaceholder: true,
    });
  }

  return cells;
}

export async function loadMealsForMonth(referenceDate: Date): Promise<MealsByDate> {
  const monthStart = createDateAtNoon(referenceDate, 1);
  const daysInMonth = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0,
    12,
    0,
    0,
    0
  ).getDate();

  await new Promise((resolve) => setTimeout(resolve, PLACEHOLDER_DELAY_MS));

  const mealsByDate: MealsByDate = {};

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = createDateAtNoon(referenceDate, day);
    const seeds = getMealSeedsForDay(day);

    if (seeds.length === 0) {
      continue;
    }

    const dateKey = getDateKey(date);
    const fullDateLabel = formatMonthDayYear(date);

    mealsByDate[dateKey] = seeds.map((meal, index) =>
      createMealItem(`${dateKey}-seed-${index}`, meal.name, dateKey, fullDateLabel, meal.type)
    );
  }

  return mealsByDate;
}

export async function loadMealsForPlannerView(referenceDate: Date): Promise<MealsByDate> {
  const [previousMonthMeals, currentMonthMeals, nextMonthMeals] = await Promise.all([
    loadMealsForMonth(shiftMonth(referenceDate, -1)),
    loadMealsForMonth(referenceDate),
    loadMealsForMonth(shiftMonth(referenceDate, 1)),
  ]);

  return mergeMealsByDate(previousMonthMeals, currentMonthMeals, nextMonthMeals);
}

export function getDefaultSelectedDate(referenceDate: Date, mealsByDate: MealsByDate) {
  const monthStart = createDateAtNoon(referenceDate, 1);
  const seededDateKeys = Object.keys(mealsByDate)
    .filter((dateKey) => {
      const date = new Date(`${dateKey}T12:00:00`);

      return (
        date.getFullYear() === referenceDate.getFullYear() &&
        date.getMonth() === referenceDate.getMonth()
      );
    })
    .sort();
  const preferredDateKey = seededDateKeys.find((dateKey) => dateKey.endsWith('-23'));
  const seededDateKey = preferredDateKey ?? seededDateKeys[0];

  if (seededDateKey) {
    return new Date(`${seededDateKey}T12:00:00`);
  }

  return monthStart;
}

export function getMealsForDate(mealsByDate: MealsByDate, referenceDate: Date) {
  return mealsByDate[getDateKey(referenceDate)] ?? [];
}

export function getMealsForWeek(mealsByDate: MealsByDate, referenceDate: Date): WeekMealsDay[] {
  return getWeekDates(referenceDate).map((date) => ({
    date,
    dateKey: getDateKey(date),
    dayLabel: formatWeekdayLabel(date),
    fullDateLabel: formatMonthDayYear(date),
    meals: getMealsForDate(mealsByDate, date),
  }));
}

export function hasMealsForDate(mealsByDate: MealsByDate, dateKey: string | null) {
  if (!dateKey) {
    return false;
  }

  return Boolean(mealsByDate[dateKey]?.length);
}

export async function addMealForDay(
  dayKey: string,
  dateMade: string,
  mealTypeOrDraft: MealType | NewMealDraft
): Promise<MealItem> {
  await new Promise((resolve) => setTimeout(resolve, PLACEHOLDER_DELAY_MS));

  if (typeof mealTypeOrDraft === 'string') {
    return createMealItem(
      `${dayKey}-${mealTypeOrDraft.toLowerCase()}-custom`,
      `${mealTypeOrDraft} Meal`,
      dayKey,
      dateMade,
      mealTypeOrDraft
    );
  }

  return createCustomMealItem(`${dayKey}-custom`, dayKey, dateMade, mealTypeOrDraft);
}

export async function addMealForThreeDayPlan(
  dayKey: string,
  dateMade: string,
  nextMealNumber: number,
  mealDraft?: NewMealDraft
): Promise<MealItem> {
  await new Promise((resolve) => setTimeout(resolve, PLACEHOLDER_DELAY_MS));

  if (mealDraft) {
    return createCustomMealItem(`${dayKey}-added-${nextMealNumber}`, dayKey, dateMade, mealDraft);
  }

  return createMealItem(
    `${dayKey}-added-${nextMealNumber}`,
    `Meal ${nextMealNumber}`,
    dayKey,
    dateMade,
    'Dinner'
  );
}

export async function loadGroceryItemsFromMeals(): Promise<GroceryListItem[]> {
  await new Promise((resolve) => setTimeout(resolve, PLACEHOLDER_DELAY_MS));

  const groceryMap = new Map<string, GroceryListItem>();

  for (const mealName of getAllSeededMealNames()) {
    for (const item of getGrocerySeedsForMeal(mealName)) {
      const category = mapGrocerySeedToListCategory(item.category);
      const key = `${category}:${item.name.toLowerCase()}`;

      if (!groceryMap.has(key)) {
        groceryMap.set(key, {
          id: key.replace(/[^a-z0-9:]/gi, '-'),
          name: item.name,
          category,
          count: 1,
          isBought: false,
        });
      }
    }
  }

  return Array.from(groceryMap.values()).sort((left, right) => {
    const categoryDiff =
      GROCERY_LIST_CATEGORIES.indexOf(left.category) - GROCERY_LIST_CATEGORIES.indexOf(right.category);

    if (categoryDiff !== 0) {
      return categoryDiff;
    }

    return left.name.localeCompare(right.name);
  });
}

export function groupGroceryItemsByCategory(items: GroceryListItem[]) {
  return GROCERY_LIST_CATEGORIES.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  }));
}

export function countRemainingGroceryItems(items: GroceryListItem[]) {
  return items.filter((item) => !item.isBought).length;
}

export async function loadKitchenItemsFromMeals(): Promise<KitchenItem[]> {
  const groceryItems = await loadGroceryItemsFromMeals();

  return groceryItems.map((item, index) => ({
    id: `kitchen-${item.id}`,
    name: item.name,
    category: mapGroceryItemToKitchenCategory(item),
    freeCount: item.count,
    allocatedCount: 0,
    isBought: index % 3 !== 0,
  }));
}

export function groupKitchenItemsByCategory(items: KitchenItem[]) {
  return KITCHEN_CATEGORIES.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  }));
}

export function countKitchenItemsInStock(items: KitchenItem[]) {
  return items.filter((item) => item.freeCount > 0 || item.allocatedCount > 0).length;
}

export function parseMealIngredients(meal: MealItem): RecipeIngredientRequirement[] {
  return meal.ingredients
    .filter((ingredient) => ingredient.name.trim().length > 0 && ingredient.count > 0)
    .map((ingredient) => ({
      name: ingredient.name,
      count: ingredient.count,
      category: mapIngredientNameToGroceryCategory(ingredient.name),
      kitchenCategory: mapIngredientNameToKitchenCategory(ingredient.name),
    }));
}

export function getMealIngredientSummary(ingredients: MealIngredient[]) {
  if (ingredients.length === 0) {
    return EMPTY_MEAL_FIELD_VALUE;
  }

  return ingredients
    .map((ingredient) => `${ingredient.name} (${ingredient.count})`)
    .join(', ');
}

export function isValidIngredientCount(value: string) {
  return /^\d+$/.test(value.trim()) && Number(value.trim()) > 0;
}

export function getAvailableMealIngredientNames(kitchenInventory: KitchenItem[]) {
  return Array.from(
    new Set(
      kitchenInventory
        .map((item) => item.name.trim())
        .filter((name) => name.length > 0)
    )
  ).sort((left, right) => left.localeCompare(right));
}

export function getFilteredMealIngredientNames(
  availableIngredientNames: string[],
  typedValue: string,
  selectedIngredients: MealIngredient[],
  editingIngredientIndex: number | null = null
) {
  const normalizedTypedValue = typedValue.trim().toLowerCase();

  if (normalizedTypedValue.length === 0) {
    return [];
  }

  const editingIngredientName =
    editingIngredientIndex !== null ? selectedIngredients[editingIngredientIndex]?.name.toLowerCase() ?? null : null;

  const selectedIngredientNames = new Set(
    selectedIngredients
      .filter((_, index) => index !== editingIngredientIndex)
      .map((ingredient) => ingredient.name.trim().toLowerCase())
  );

  return availableIngredientNames
    .filter((name) => {
      const normalizedName = name.toLowerCase();

      if (!normalizedName.includes(normalizedTypedValue)) {
        return false;
      }

      if (editingIngredientName && normalizedName === editingIngredientName) {
        return true;
      }

      return !selectedIngredientNames.has(normalizedName);
    })
    .sort((left, right) => left.localeCompare(right));
}

export function upsertMealIngredient(
  ingredients: MealIngredient[],
  name: string,
  count: number,
  ingredientIndex?: number | null
) {
  const trimmedName = name.trim();

  if (trimmedName.length === 0 || count <= 0) {
    return ingredients;
  }

  const nextIngredients = [...ingredients];

  if (ingredientIndex !== null && ingredientIndex !== undefined && nextIngredients[ingredientIndex]) {
    nextIngredients[ingredientIndex] = {
      name: trimmedName,
      count,
    };

    return nextIngredients;
  }

  const existingIndex = nextIngredients.findIndex(
    (ingredient) => ingredient.name.toLowerCase() === trimmedName.toLowerCase()
  );

  if (existingIndex >= 0) {
    nextIngredients[existingIndex] = {
      name: trimmedName,
      count,
    };

    return nextIngredients;
  }

  return [
    ...nextIngredients,
    {
      name: trimmedName,
      count,
    },
  ];
}

export function removeMealIngredient(ingredients: MealIngredient[], ingredientIndex: number) {
  return ingredients.filter((_, index) => index !== ingredientIndex);
}

export function formatMealIngredientCount(count: number) {
  return `${count}`;
}

export function createBlankMealIngredients(): MealIngredient[] {
  return [];
}

export function createMealIngredient(name: string, count: number): MealIngredient {
  return {
    name: name.trim(),
    count,
  };
}

export function formatMealIngredientOptionLabel(name: string) {
  return name;
}

export function getIngredientInputName(value: string) {
  return value.trimStart();
}

export function getIngredientInputCount(value: string) {
  return value.trim();
}

export function getMealIngredientCountValue(value: string) {
  return value.trim();
}

export function getMealIngredientDraftName(value: string) {
  return value.trimStart();
}

export function getMealIngredientDraftCount(value: string) {
  return value.trim();
}

export function getMealIngredientsForDraft(ingredients: MealIngredient[]) {
  return ingredients.map((ingredient) => ({
    name: ingredient.name,
    count: ingredient.count,
  }));
}

export function isPastMealDate(dateKey: string, referenceDate: Date = new Date()) {
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    12,
    0,
    0,
    0
  );
  const mealDate = new Date(`${dateKey}T12:00:00`);

  return mealDate.getTime() < today.getTime();
}

export function isFutureMealDate(dateKey: string, referenceDate: Date = new Date()) {
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    12,
    0,
    0,
    0
  );
  const mealDate = new Date(`${dateKey}T12:00:00`);

  return mealDate.getTime() > today.getTime();
}

export function getAllMeals(mealsByDate: MealsByDate) {
  return Object.values(mealsByDate).flat();
}

export function getNextThreeDayMeals(mealsByDate: MealsByDate, referenceDate: Date): DayMeals[] {
  return buildNextThreeDays(referenceDate).map((day) => ({
    ...day,
    meals: mealsByDate[day.dayKey] ?? [],
  }));
}

export function buildInventoryState(
  mealsByDate: MealsByDate,
  baseKitchenInventory: KitchenItem[],
  referenceDate: Date = new Date()
): MealInventoryState {
  const inventoryMap = new Map<string, KitchenItem>();

  for (const item of baseKitchenInventory) {
    inventoryMap.set(item.name.toLowerCase(), {
      ...item,
      allocatedCount: 0,
    });
  }

  const shortageMap = new Map<string, GroceryListItem>();

  for (const meal of getAllMeals(mealsByDate)) {
    const requirements = parseMealIngredients(meal);

    if (isFutureMealDate(meal.dateKey, referenceDate)) {
      for (const requirement of requirements) {
        const key = requirement.name.toLowerCase();
        const existingInventory = inventoryMap.get(key);

        if (existingInventory) {
          inventoryMap.set(key, {
            ...existingInventory,
            allocatedCount: existingInventory.allocatedCount + requirement.count,
          });
        } else {
          inventoryMap.set(key, {
            id: `inventory-${key.replace(/[^a-z0-9]/gi, '-')}`,
            name: requirement.name,
            category: requirement.kitchenCategory,
            freeCount: 0,
            allocatedCount: requirement.count,
            isBought: true,
          });
        }
      }
    }

    if (isPastMealDate(meal.dateKey, referenceDate) && meal.wasMade) {
      for (const requirement of requirements) {
        const key = requirement.name.toLowerCase();
        const existingInventory = inventoryMap.get(key);

        if (existingInventory) {
          inventoryMap.set(key, {
            ...existingInventory,
            freeCount: Math.max(0, existingInventory.freeCount - requirement.count),
          });
        }
      }
    }
  }

  for (const item of inventoryMap.values()) {
    const shortage = Math.max(0, item.allocatedCount - item.freeCount);

    if (shortage > 0) {
      shortageMap.set(item.name.toLowerCase(), {
        id: `shortage-${item.id}`,
        name: item.name,
        category: item.category === 'Pantry' ? 'General' : item.category === 'Fridge' && mapIngredientNameToGroceryCategory(item.name) === 'Produce' ? 'Produce' : mapIngredientNameToGroceryCategory(item.name),
        count: shortage,
        isBought: false,
      });
    }
  }

  return {
    mealsByDate,
    kitchenInventory: Array.from(inventoryMap.values()).sort((left, right) => left.name.localeCompare(right.name)),
    groceryShortages: Array.from(shortageMap.values()).sort((left, right) => {
      const categoryDiff =
        GROCERY_LIST_CATEGORIES.indexOf(left.category) - GROCERY_LIST_CATEGORIES.indexOf(right.category);

      if (categoryDiff !== 0) {
        return categoryDiff;
      }

      return left.name.localeCompare(right.name);
    }),
  };
}
