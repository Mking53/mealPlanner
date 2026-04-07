import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SavedMealCardRow, type SavedMealCard } from '@/src/components';

type ProfileMealCardsScreenProps = {
  meals: SavedMealCard[];
  onAddToDay: (meal: SavedMealCard) => void;
  onBack: () => void;
  onEditMeal: (meal: SavedMealCard) => void;
};

export function ProfileMealCardsScreen({
  meals,
  onAddToDay,
  onBack,
  onEditMeal,
}: ProfileMealCardsScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              onPress={onBack}
              style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}>
              <MaterialIcons name="arrow-back" size={20} color="#173222" />
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>

            <View style={styles.headerCopy}>
              <Text style={styles.title}>All Meal Cards</Text>
              <Text style={styles.subtitle}>Browse, edit, and reuse your full saved meal library.</Text>
            </View>
          </View>

          <View style={styles.list}>
            {meals.map((meal) => (
              <SavedMealCardRow
                key={meal.id}
                meal={meal}
                onPress={onEditMeal}
                onAddToDay={onAddToDay}
              />
            ))}
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
  header: {
    gap: 14,
  },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 40,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buttonPressed: {
    opacity: 0.84,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#173222',
  },
  headerCopy: {
    gap: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#173222',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5b6c61',
  },
  list: {
    gap: 14,
  },
});
