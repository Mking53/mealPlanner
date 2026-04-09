import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, StyleSheet, Text, View } from 'react-native';

import {
  AddFriendsModal,
  AddMealModal,
  AddPlannerGroupModal,
  AddSavedMealToDayModal,
  buildCurrentMonthDayOptions,
  createBlankMealIngredients,
  createMealIngredient,
  createSavedMealCardDraft,
  formatDateInputValue,
  getDateKeyFromDateInput,
  getAvailableMealIngredientNames,
  getDefaultDayKey,
  getIngredientInputCount,
  getIngredientInputName,
  isValidIngredientCount,
  ModalWrapper,
  MOCK_PROFILE_IMAGE_URI,
  parseDateInputValue,
  removeMealIngredient,
  upsertMealIngredient,
  type MealIngredient,
  type PlannerGroup,
  type MealType,
  type PlannerFriendOption,
  type SavedMealCard,
} from '@/src/components';
import { ProfileFriendsScreen, ProfileGroupsScreen, ProfileMealCardsScreen, ProfileScreen } from '@/src/screens';
import { useAuth, useMealPlanner } from '@/src/state';
import { api, ApiError } from '@/src/api/mealPlannerApi';
import { getMealCardNameConflictMessage, isMealCardNameConflictError } from '@/src/utils/mealCardErrors';
import { mapApiMealCardToSavedMealCard, mapApiMealCardsToSavedMealCards } from '@/src/utils/savedMealCards';

type ProfileRoute = 'home' | 'allMeals' | 'friends' | 'groups';
const PROFILE_ROUTE_STORAGE_KEY = 'meal_planner_profile_route';

function getStoredProfileRoute(): ProfileRoute {
  if (typeof localStorage === 'undefined') {
    return 'home';
  }

  const savedRoute = localStorage.getItem(PROFILE_ROUTE_STORAGE_KEY);
  return savedRoute === 'allMeals' || savedRoute === 'friends' || savedRoute === 'groups'
    ? savedRoute
    : 'home';
}

export function ProfileNavigator() {
  const { signOut, userName } = useAuth();
  const [route, setRoute] = useState<ProfileRoute>(getStoredProfileRoute);
  const [savedMeals, setSavedMeals] = useState<SavedMealCard[]>([]);
  const [friends, setFriends] = useState<PlannerFriendOption[]>([]);
  const [groups, setGroups] = useState<PlannerGroup[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);
  const [isAddFriendsVisible, setIsAddFriendsVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState<PlannerGroup | null>(null);
  const [draftGroupName, setDraftGroupName] = useState('');
  const [selectedGroupFriendIds, setSelectedGroupFriendIds] = useState<string[]>([]);
  const [isSavingGroup, setIsSavingGroup] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [pendingInviteEmails, setPendingInviteEmails] = useState<string[]>([]);
  const [mealToAdd, setMealToAdd] = useState<SavedMealCard | null>(null);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [addToDayDateDraft, setAddToDayDateDraft] = useState(formatDateInputValue(new Date()));
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
  const [isSavingMeal, setIsSavingMeal] = useState(false);
  const [isCreatingMeal, setIsCreatingMeal] = useState(false);
  const [removingMealId, setRemovingMealId] = useState<string | null>(null);
  const [mealPendingRemoval, setMealPendingRemoval] = useState<SavedMealCard | null>(null);
  const { isLoading, kitchenInventory } = useMealPlanner();

  const loadSavedMeals = useCallback(async () => {
    try {
      setIsLoadingMeals(true);
      const [mealCardsResponse, friendsResponse, plannerGroupsResponse] = await Promise.all([
        api.getMealCards(),
        api.getFriends(),
        api.getPlannerGroups(),
      ]);
      const meals = mapApiMealCardsToSavedMealCards(mealCardsResponse);
      setSavedMeals(meals);
      setFriends(Array.isArray(friendsResponse) ? friendsResponse : []);
      setGroups(Array.isArray(plannerGroupsResponse) ? plannerGroupsResponse : []);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
      Alert.alert('Error', 'Failed to load your profile data');
    } finally {
      setIsLoadingMeals(false);
    }
  }, []);

  useEffect(() => {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(PROFILE_ROUTE_STORAGE_KEY, route);
  }, [route]);

  useEffect(() => {
    let isMounted = true;

    async function fetchMeals() {
      await loadSavedMeals();
    }

    if (isMounted) {
      void fetchMeals();
    }

    return () => {
      isMounted = false;
    };
  }, [loadSavedMeals]);

  useFocusEffect(
    useCallback(() => {
      void loadSavedMeals();
    }, [loadSavedMeals])
  );

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
    setIsCreatingMeal(false);
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
    setIsCreatingMeal(false);
    setDraftName(mealDraft.name);
    setDraftType(mealDraft.type);
    setDraftRecipe(mealDraft.recipe);
    setDraftIngredients(mealDraft.ingredients);
    resetIngredientDraft();
    setDraftNutritionalBreakdown(mealDraft.nutritionalBreakdown);
  }

  function handleCreateNewMeal() {
    setIsCreatingMeal(true);
    setEditingMealId(null);
    setDraftName('');
    setDraftType('');
    setDraftRecipe('');
    setDraftIngredients(createBlankMealIngredients());
    resetIngredientDraft();
    setDraftNutritionalBreakdown('');
  }

  async function handleSaveMealEdits() {
    if (draftName.trim().length === 0) {
      return;
    }

    setIsSavingMeal(true);

    try {
      const ingredientNames = draftIngredients
        .map((ingredient) => ingredient.name.trim())
        .filter((name) => name.length > 0);

      if (isCreatingMeal) {
        // Create new meal
        const newMeal = await api.createMealCard({
          name: draftName.trim(),
          mealType: draftType || 'Dinner',
          recipe: draftRecipe.trim().length > 0 ? draftRecipe.trim() : 'None',
          nutritionalBreakdown:
            draftNutritionalBreakdown.trim().length > 0 ? draftNutritionalBreakdown.trim() : 'None',
          ingredients: ingredientNames,
        });

        // Transform and add to local state
        const transformedMeal = mapApiMealCardToSavedMealCard(newMeal);
        setSavedMeals((currentMeals) => [transformedMeal, ...currentMeals]);
        Alert.alert('Success', 'Meal card created');
      } else if (editingMealId) {
        // Update existing meal
        await api.updateMealCard(editingMealId, {
          name: draftName.trim(),
          mealType: draftType || 'Dinner',
          recipe: draftRecipe.trim().length > 0 ? draftRecipe.trim() : 'None',
          nutritionalBreakdown:
            draftNutritionalBreakdown.trim().length > 0 ? draftNutritionalBreakdown.trim() : 'None',
          ingredients: ingredientNames,
        });

        // Update local state
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

        Alert.alert('Success', 'Meal card updated');
      }

      closeEditMealModal();
    } catch (error) {
      console.error('Failed to save meal:', error);

      if (isMealCardNameConflictError(error)) {
        Alert.alert('Choose a different name', getMealCardNameConflictMessage(draftName));
      } else {
        Alert.alert('Error', 'Failed to save meal card');
      }
    } finally {
      setIsSavingMeal(false);
    }
  }

  function handleRemoveMeal(meal: SavedMealCard) {
    if (removingMealId) {
      return;
    }

    setMealPendingRemoval(meal);
  }

  function handleCloseRemoveMealModal() {
    if (removingMealId) {
      return;
    }

    setMealPendingRemoval(null);
  }

  async function handleConfirmRemoveMeal() {
    if (!mealPendingRemoval || removingMealId) {
      return;
    }

    try {
      setRemovingMealId(mealPendingRemoval.id);
      await api.deleteMealCard(mealPendingRemoval.id);
      setSavedMeals((currentMeals) =>
        currentMeals.filter((currentMeal) => currentMeal.id !== mealPendingRemoval.id)
      );

      if (editingMealId === mealPendingRemoval.id) {
        closeEditMealModal();
      }

      if (mealToAdd?.id === mealPendingRemoval.id) {
        handleCloseAddToDayModal();
      }

      setMealPendingRemoval(null);
      Alert.alert('Removed', `${mealPendingRemoval.name} was removed from My Meal Cards.`);
    } catch (error) {
      const apiError = error as ApiError;
      Alert.alert('Error', apiError.message || 'Failed to remove meal card.');
    } finally {
      setRemovingMealId(null);
    }
  }

  function handleOpenAddToDay(meal: SavedMealCard) {
    const defaultDayKey = getDefaultDayKey(new Date(), dayOptions);

    setMealToAdd(meal);
    setSelectedDayKey(defaultDayKey);
    setAddToDayDateDraft(formatDateInputValue(new Date()));
  }

  function handleCloseAddToDayModal() {
    if (isAddingToPlanner) {
      return;
    }

    setMealToAdd(null);
    setSelectedDayKey(null);
    setAddToDayDateDraft(formatDateInputValue(new Date()));
  }

  function handleChangeAddToDayDate(value: string) {
    setAddToDayDateDraft(value);

    const typedDayKey = getDateKeyFromDateInput(value);
    setSelectedDayKey(typedDayKey);
  }

  function handleSelectSavedMealDay(dayKey: string) {
    setSelectedDayKey(dayKey);
    setAddToDayDateDraft(formatDateInputValue(new Date(`${dayKey}T12:00:00`)));
  }

  async function handleConfirmAddMeal() {
    const parsedDate = parseDateInputValue(addToDayDateDraft);
    const targetDayKey = getDateKeyFromDateInput(addToDayDateDraft) ?? selectedDayKey;

    if (!mealToAdd || !parsedDate || !targetDayKey || isAddingToPlanner) {
      return;
    }

    setIsAddingToPlanner(true);

    try {
      const ingredientNames = mealToAdd.ingredients
        .map((ingredient) => ingredient.name.trim())
        .filter((name) => name.length > 0);

      await api.createPlannedMeal({
        name: mealToAdd.name,
        mealType: mealToAdd.type,
        plannedDate: targetDayKey,
        recipe: mealToAdd.recipe,
        nutritionalBreakdown: mealToAdd.nutritionalBreakdown,
        ingredients: ingredientNames,
      });

      setMealToAdd(null);
      setSelectedDayKey(null);
      setAddToDayDateDraft(formatDateInputValue(new Date()));
      Alert.alert(
        'Meal added',
        `${mealToAdd.name} was added to ${parsedDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}.`
      );
    } catch (error) {
      console.error('Failed to add meal:', error);
      Alert.alert('Error', 'Failed to add meal to planner');
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

  function closeEditGroupModal() {
    if (isSavingGroup) {
      return;
    }

    setEditingGroup(null);
    setDraftGroupName('');
    setSelectedGroupFriendIds([]);
  }

  function handleOpenEditGroup(group: PlannerGroup) {
    setEditingGroup(group);
    setDraftGroupName(group.name);
    setSelectedGroupFriendIds(group.memberIds);
  }

  function handleToggleGroupFriend(friendId: string) {
    setSelectedGroupFriendIds((currentFriendIds) =>
      currentFriendIds.includes(friendId)
        ? currentFriendIds.filter((currentFriendId) => currentFriendId !== friendId)
        : [...currentFriendIds, friendId]
    );
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

    void (async () => {
      try {
        const inviteCount = pendingInviteEmails.length;
        const response = await api.createFriendInvites(pendingInviteEmails);
        closeAddFriendsModal();

        const matchedCount = response.matchedUsers.length;
        const summary =
          matchedCount > 0
            ? `${inviteCount} invite${inviteCount === 1 ? '' : 's'} sent. ${matchedCount} friend${matchedCount === 1 ? '' : 's'} matched an existing account and can be used in groups now.`
            : `${inviteCount} invite${inviteCount === 1 ? '' : 's'} sent.`;

        Alert.alert('Invites Sent', summary);
      } catch (error) {
        const apiError = error as ApiError;
        Alert.alert('Error', apiError.message || 'Failed to send invites.');
      }
    })();
  }

  async function handleSaveGroupEdits() {
    if (!editingGroup || draftGroupName.trim().length === 0 || isSavingGroup) {
      return;
    }

    setIsSavingGroup(true);

    try {
      const updatedGroup = await api.updatePlannerGroup(
        editingGroup.id,
        draftGroupName.trim(),
        selectedGroupFriendIds
      );

      setGroups((currentGroups) =>
        currentGroups.map((group) => (group.id === updatedGroup.id ? updatedGroup : group))
      );
      closeEditGroupModal();
      Alert.alert('Group updated', `${updatedGroup.name} was saved successfully.`);
    } catch (error) {
      const apiError = error as ApiError;
      Alert.alert('Error', apiError.message || 'Failed to update the group.');
    } finally {
      setIsSavingGroup(false);
    }
  }

  return (
    <>
      {route === 'home' ? (
        <ProfileScreen
          friends={friends}
          groups={groups}
          isLoading={isLoadingMeals || isLoading}
          removingMealId={removingMealId}
          savedMeals={savedMeals}
          userName={userName}
          userImageUri={MOCK_PROFILE_IMAGE_URI}
          onEditMeal={handleOpenMealEditor}
          onAddMeal={handleCreateNewMeal}
          onAddToDay={handleOpenAddToDay}
          onRemoveMeal={handleRemoveMeal}
          onShowAllMeals={() => {
            setRoute('allMeals');
          }}
          onShowFriends={() => {
            setRoute('friends');
          }}
          onShowGroups={() => {
            setRoute('groups');
          }}
          onAddFriends={() => {
            setIsAddFriendsVisible(true);
          }}
          onLogout={() => {
            signOut();
          }}
        />
      ) : route === 'allMeals' ? (
        <ProfileMealCardsScreen
          meals={savedMeals}
          onBack={() => {
            setRoute('home');
          }}
          onEditMeal={handleOpenMealEditor}
          onAddToDay={handleOpenAddToDay}
          onRemoveMeal={handleRemoveMeal}
          removingMealId={removingMealId}
        />
      ) : route === 'friends' ? (
        <ProfileFriendsScreen
          friends={friends}
          onBack={() => {
            setRoute('home');
          }}
        />
      ) : (
        <ProfileGroupsScreen
          groups={groups}
          onEditGroup={(group) => {
            handleOpenEditGroup(group);
          }}
          onBack={() => {
            setRoute('home');
          }}
        />
      )}

      <AddSavedMealToDayModal
        visible={mealToAdd !== null}
        mealName={mealToAdd?.name ?? ''}
        draftDate={addToDayDateDraft}
        isDateValid={parseDateInputValue(addToDayDateDraft) !== null}
        dayOptions={dayOptions}
        selectedDayKey={selectedDayKey}
        isSaving={isAddingToPlanner}
        onChangeDate={handleChangeAddToDayDate}
        onSelectDay={handleSelectSavedMealDay}
        onClose={handleCloseAddToDayModal}
        onConfirm={() => {
          void handleConfirmAddMeal();
        }}
      />

      <ModalWrapper
        visible={mealPendingRemoval !== null}
        onClose={handleCloseRemoveMealModal}
        title="Remove meal card"
        subtitle={
          mealPendingRemoval
            ? `Are you sure you want to remove ${mealPendingRemoval.name} from My Meal Cards?`
            : 'Are you sure you want to remove this meal card?'
        }
        primaryAction={{
          label: removingMealId ? 'Removing...' : 'Remove',
          onPress: () => {
            void handleConfirmRemoveMeal();
          },
          disabled: removingMealId !== null,
        }}
        secondaryAction={{
          label: 'Cancel',
          onPress: handleCloseRemoveMealModal,
        }}>
        <View style={styles.removeMealContent}>
          <Text style={styles.removeMealWarning}>
            This will delete the saved meal card from your library.
          </Text>
        </View>
      </ModalWrapper>

      <AddMealModal
        visible={editingMeal !== null || isCreatingMeal}
        modalTitle={isCreatingMeal ? 'Create New Meal Card' : 'Edit Meal Card'}
        saveButtonLabel={isCreatingMeal ? 'Create Meal' : 'Save Changes'}
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
        isSaving={isSavingMeal}
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

      <AddPlannerGroupModal
        visible={editingGroup !== null}
        title="Edit Group"
        subtitle="Search for friends and update this group with multiple people at the same time."
        actionLabel={isSavingGroup ? 'Saving...' : 'Save Group'}
        draftGroupName={draftGroupName}
        friends={friends}
        isCreateDisabled={draftGroupName.trim().length === 0 || isSavingGroup}
        onChangeGroupName={setDraftGroupName}
        onClose={closeEditGroupModal}
        onCreateGroup={() => {
          void handleSaveGroupEdits();
        }}
        onToggleFriend={handleToggleGroupFriend}
        selectedFriendIds={selectedGroupFriendIds}
      />
    </>
  );
}

const styles = StyleSheet.create({
  removeMealContent: {
    gap: 8,
  },
  removeMealWarning: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5b6c61',
  },
});
