import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ProfileHeaderCard,
  SavedMealCardRow,
  SettingsActionRow,
  type PlannerFriendOption,
  type PlannerGroup,
  type SavedMealCard,
} from '@/src/components';

type ProfileScreenProps = {
  friends: PlannerFriendOption[];
  groups: PlannerGroup[];
  onAddFriends: () => void;
  onAddMeal: () => void;
  isLoading: boolean;
  onAddToDay: (meal: SavedMealCard) => void;
  onEditMeal: (meal: SavedMealCard) => void;
  onRemoveMeal: (meal: SavedMealCard) => void;
  removingMealId?: string | null;
  onLogout: () => void;
  onShowFriends: () => void;
  onShowGroups: () => void;
  onShowAllMeals: () => void;
  savedMeals: SavedMealCard[];
  userImageUri?: string;
  userName: string;
};

const PREVIEW_MEAL_COUNT = 3;

export function ProfileScreen({
  friends,
  groups,
  onAddFriends,
  onAddMeal,
  isLoading,
  onAddToDay,
  onEditMeal,
  onRemoveMeal,
  removingMealId = null,
  onLogout,
  onShowFriends,
  onShowGroups,
  onShowAllMeals,
  savedMeals,
  userImageUri,
  userName,
}: ProfileScreenProps) {
  const previewMeals = savedMeals.slice(0, PREVIEW_MEAL_COUNT);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ProfileHeaderCard
            userName={userName}
            imageUri={userImageUri}
            subtitle="Reuse favorite meals, update their details, and drop them onto your planner."
          />

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderCopy}>
                <Text style={styles.sectionTitle}>My Meal Cards</Text>
                <Text style={styles.sectionHint}>Tap a card to edit it, or use Add to Day to plan it.</Text>
              </View>

              <View style={styles.buttonGroup}>
                <Pressable
                  accessibilityRole="button"
                  onPress={onAddMeal}
                  style={({ pressed }) => [styles.viewAllButton, pressed && styles.buttonPressed]}>
                  <Text style={styles.viewAllText}>Add</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={onShowAllMeals}
                  style={({ pressed }) => [styles.viewAllButton, pressed && styles.buttonPressed]}>
                  <Text style={styles.viewAllText}>View All</Text>
                </Pressable>
              </View>
            </View>

            {isLoading ? (
              <View style={styles.loadingCard}>
                <ActivityIndicator size="small" color="#2f7d32" />
                <Text style={styles.loadingText}>Syncing your meal planner before reusing saved meals...</Text>
              </View>
            ) : (
              <View style={styles.mealList}>
                {previewMeals.map((meal) => (
                  <SavedMealCardRow
                    key={meal.id}
                    isRemoving={removingMealId === meal.id}
                    meal={meal}
                    onRemove={onRemoveMeal}
                    onPress={onEditMeal}
                    onAddToDay={onAddToDay}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderCopy}>
              <Text style={styles.sectionTitle}>Settings</Text>
              <Text style={styles.sectionHint}>Manage your people and account actions here.</Text>
            </View>

            <View style={styles.settingsList}>
              <SettingsActionRow iconName="group-add" label="Add Friends" onPress={onAddFriends} />
              <SettingsActionRow
                iconName="groups"
                label={`Friends${friends.length > 0 ? ` (${friends.length})` : ''}`}
                onPress={onShowFriends}
              />
              <SettingsActionRow
                iconName="diversity-3"
                label={`Groups${groups.length > 0 ? ` (${groups.length})` : ''}`}
                onPress={onShowGroups}
              />
              <SettingsActionRow iconName="logout" label="Log Out" onPress={onLogout} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f8f4',
  },
  scrollContent: {
    paddingBottom: 32,
    backgroundColor: '#f6f8f4',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 20,
  },
  section: {
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  sectionHeaderCopy: {
    flex: 1,
    gap: 6,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#173222',
  },
  sectionHint: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5b6c61',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  viewAllButton: {
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2f7d32',
  },
  buttonPressed: {
    opacity: 0.84,
  },
  loadingCard: {
    minHeight: 180,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#587067',
    textAlign: 'center',
  },
  mealList: {
    gap: 14,
  },
  settingsList: {
    gap: 12,
  },
});
