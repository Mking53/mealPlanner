import { useMemo, useState } from 'react';
import { Alert } from 'react-native';

import {
  AddFriendsModal,
  AddMealModal,
  AddSavedMealToDayModal,
  buildCurrentMonthDayOptions,
  createBlankMealIngredients,
  createMealIngredient,
  createSavedMealCardDraft,
  formatDateInputValue,
  getAvailableMealIngredientNames,
  getDefaultDayKey,
  getIngredientInputCount,
  getIngredientInputName,
  isValidIngredientCount,
  MOCK_PROFILE_IMAGE_URI,
  MOCK_SAVED_MEAL_CARDS,
  removeMealIngredient,
  upsertMealIngredient,
  type MealIngredient,
  type MealType,
  type SavedMealCard,
} from '@/src/components';
import { ProfileMealCardsScreen, ProfileScreen } from '@/src/screens';
import { useAuth, useMealPlanner } from '@/src/state';

type ProfileRoute = 'home' | 'allMeals';

export function ProfileNavigator() {
  const { signOut, userName } = useAuth();
  const [route, setRoute] = useState<ProfileRoute>('home');
  const [savedMeals, setSavedMeals] = useState<SavedMealCard[]>(MOCK_SAVED_MEAL_CARDS);
  const [isAddFriendsVisible, setIsAddFriendsVisible] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [pendingInviteEmails, setPendingInviteEmails] = useState<string[]>([]);
  const [mealToAdd, setMealToAdd] = useState<SavedMealCard | null>(null);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [isAddingToPlanner, setIsAddingToPlanner] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftType, setDraftType] = useState<MealType | ''>('');
  const [draftRecipe, setDraftRecipe] = useState('');
  const [draftIngredients, setDraftIngredients] = useState<MealIngredient[]>(createBlankMealIngredients);
  const [draftIngredientName, setDraftIngredientName] = useState('');
  const [draftIngredientCount, setDraftIngredientCount] = useState('1');
  const [editingIngredientIndex, setEditingIngredientIndex] = useState<number | null>(null);
  const [draftNutritionalBreakdown, setDraftNutritionalBreakdown] = useState('');
  const { addMeal, isLoading, kitchenInventory } = useMealPlanner();

  const dayOptions = useMemo(() => buildCurrentMonthDayOptions(new Date()), []);
  const availableIngredientNames = useMemo(
    () => getAvailableMealIngredientNames(kitchenInventory),
    [kitchenInventory]
  );
  const isIngredientCountDraftValid = isValidIngredientCount(draftIngredientCount);
  const editingMeal = editingMealId ? savedMeals.find((meal) => meal.id === editingMealId) ?? null : null;
  const normalizedEmailDraft = emailDraft.trim().toLowerCase();
  const isInviteEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmailDraft);
  const canAddInviteEmail =
    isInviteEmailValid && !pendingInviteEmails.includes(normalizedEmailDraft);

  function resetIngredientDraft() {
    setDraftIngredientName('');
    setDraftIngredientCount('1');
    setEditingIngredientIndex(null);
  }

  function closeEditMealModal() {
    setEditingMealId(null);
    setDraftName('');
    setDraftType('');
    setDraftRecipe('');
    setDraftIngredients(createBlankMealIngredients());
    resetIngredientDraft();
    setDraftNutritionalBreakdown('');
  }

  function handleOpenMealEditor(meal: SavedMealCard) {
    const mealDraft = createSavedMealCardDraft(meal);

    setEditingMealId(meal.id);
    setDraftName(mealDraft.name);
    setDraftType(mealDraft.type);
    setDraftRecipe(mealDraft.recipe);
    setDraftIngredients(mealDraft.ingredients);
    resetIngredientDraft();
    setDraftNutritionalBreakdown(mealDraft.nutritionalBreakdown);
  }

  function handleSaveMealEdits() {
    if (!editingMealId || draftName.trim().length === 0) {
      return;
    }

    setSavedMeals((currentMeals) =>
      currentMeals.map((meal) =>
        meal.id === editingMealId
          ? {
              ...meal,
              name: draftName.trim(),
              type: draftType || 'Dinner',
              recipe: draftRecipe.trim().length > 0 ? draftRecipe.trim() : 'None',
              ingredients: draftIngredients
                .map((ingredient) => ({
                  name: ingredient.name.trim(),
                  count: ingredient.count,
                }))
                .filter((ingredient) => ingredient.name.length > 0),
              nutritionalBreakdown:
                draftNutritionalBreakdown.trim().length > 0 ? draftNutritionalBreakdown.trim() : 'None',
            }
          : meal
      )
    );

    closeEditMealModal();
  }

  function handleOpenAddToDay(meal: SavedMealCard) {
    setMealToAdd(meal);
    setSelectedDayKey(getDefaultDayKey(new Date(), dayOptions));
  }

  function handleCloseAddToDayModal() {
    if (isAddingToPlanner) {
      return;
    }

    setMealToAdd(null);
    setSelectedDayKey(null);
  }

  async function handleConfirmAddMeal() {
    if (!mealToAdd || !selectedDayKey || isAddingToPlanner) {
      return;
    }

    const selectedOption = dayOptions.find((option) => option.dayKey === selectedDayKey);

    if (!selectedOption) {
      return;
    }

    setIsAddingToPlanner(true);

    try {
      await addMeal(selectedOption.dayKey, selectedOption.fullDateLabel, {
        name: mealToAdd.name,
        type: mealToAdd.type,
        recipe: mealToAdd.recipe,
        ingredients: mealToAdd.ingredients,
        nutritionalBreakdown: mealToAdd.nutritionalBreakdown,
      });

      setMealToAdd(null);
      setSelectedDayKey(null);
      Alert.alert('Meal added', `${mealToAdd.name} was added to ${selectedOption.fullDateLabel}.`);
    } finally {
      setIsAddingToPlanner(false);
    }
  }

  function handleAddIngredient() {
    if (!isIngredientCountDraftValid) {
      return;
    }

    const trimmedName = draftIngredientName.trim();

    if (!trimmedName) {
      return;
    }

    setDraftIngredients((currentIngredients) =>
      upsertMealIngredient(
        currentIngredients,
        createMealIngredient(trimmedName, Number(draftIngredientCount)).name,
        Number(draftIngredientCount),
        editingIngredientIndex
      )
    );
    resetIngredientDraft();
  }

  function handleEditIngredient(index: number) {
    const ingredient = draftIngredients[index];

    if (!ingredient) {
      return;
    }

    setDraftIngredientName(ingredient.name);
    setDraftIngredientCount(String(ingredient.count));
    setEditingIngredientIndex(index);
  }

  function closeAddFriendsModal() {
    setIsAddFriendsVisible(false);
    setEmailDraft('');
    setPendingInviteEmails([]);
  }

  function handleAddInviteEmail() {
    if (!canAddInviteEmail) {
      return;
    }

    setPendingInviteEmails((currentEmails) => [...currentEmails, normalizedEmailDraft]);
    setEmailDraft('');
  }

  function handleRemoveInviteEmail(email: string) {
    setPendingInviteEmails((currentEmails) => currentEmails.filter((currentEmail) => currentEmail !== email));
  }

  function handleSendInvites() {
    if (pendingInviteEmails.length === 0) {
      return;
    }

    const inviteCount = pendingInviteEmails.length;
    closeAddFriendsModal();
    Alert.alert(
      'Invites Sent',
      `${inviteCount} invite${inviteCount === 1 ? '' : 's'} ready to send by email.`
    );
  }

  return (
    <>
      {route === 'home' ? (
        <ProfileScreen
          isLoading={isLoading}
          savedMeals={savedMeals}
          userName={userName}
          userImageUri={MOCK_PROFILE_IMAGE_URI}
          onEditMeal={handleOpenMealEditor}
          onAddToDay={handleOpenAddToDay}
          onShowAllMeals={() => {
            setRoute('allMeals');
          }}
          onAddFriends={() => {
            setIsAddFriendsVisible(true);
          }}
          onLogout={() => {
            signOut();
          }}
        />
      ) : (
        <ProfileMealCardsScreen
          meals={savedMeals}
          onBack={() => {
            setRoute('home');
          }}
          onEditMeal={handleOpenMealEditor}
          onAddToDay={handleOpenAddToDay}
        />
      )}

      <AddSavedMealToDayModal
        visible={mealToAdd !== null}
        mealName={mealToAdd?.name ?? ''}
        dayOptions={dayOptions}
        selectedDayKey={selectedDayKey}
        isSaving={isAddingToPlanner}
        onSelectDay={setSelectedDayKey}
        onClose={handleCloseAddToDayModal}
        onConfirm={() => {
          void handleConfirmAddMeal();
        }}
      />

      <AddMealModal
        visible={editingMeal !== null}
        modalTitle="Edit Meal Card"
        saveButtonLabel="Save Changes"
        showDateField={false}
        draftDate={formatDateInputValue(new Date())}
        draftName={draftName}
        draftType={draftType}
        draftRecipe={draftRecipe}
        draftIngredients={draftIngredients}
        draftIngredientName={draftIngredientName}
        draftIngredientCount={draftIngredientCount}
        editingIngredientIndex={editingIngredientIndex}
        draftNutritionalBreakdown={draftNutritionalBreakdown}
        availableIngredientNames={availableIngredientNames}
        isDateValid
        isIngredientCountValid={isIngredientCountDraftValid}
        isSaving={false}
        onChangeDate={() => {}}
        onChangeName={setDraftName}
        onChangeType={(value) => {
          setDraftType(value);
        }}
        onChangeRecipe={setDraftRecipe}
        onChangeIngredientName={(value) => {
          setDraftIngredientName(getIngredientInputName(value));
        }}
        onChangeIngredientCount={(value) => {
          setDraftIngredientCount(getIngredientInputCount(value));
        }}
        onChangeNutritionalBreakdown={setDraftNutritionalBreakdown}
        onAddIngredient={handleAddIngredient}
        onEditIngredient={handleEditIngredient}
        onRemoveIngredient={(index) => {
          setDraftIngredients((currentIngredients) => removeMealIngredient(currentIngredients, index));

          if (editingIngredientIndex === index) {
            resetIngredientDraft();
          }
        }}
        onClose={closeEditMealModal}
        onSave={handleSaveMealEdits}
      />

      <AddFriendsModal
        visible={isAddFriendsVisible}
        emailDraft={emailDraft}
        pendingEmails={pendingInviteEmails}
        isEmailValid={isInviteEmailValid}
        canAddEmail={canAddInviteEmail}
        canSendInvites={pendingInviteEmails.length > 0}
        onChangeEmail={setEmailDraft}
        onAddEmail={handleAddInviteEmail}
        onRemoveEmail={handleRemoveInviteEmail}
        onClose={closeAddFriendsModal}
        onSend={handleSendInvites}
      />
    </>
  );
}
