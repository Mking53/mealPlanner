import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { PlannerFriendOption } from '@/src/components';

type ProfileFriendsScreenProps = {
  friends: PlannerFriendOption[];
  onBack: () => void;
};

export function ProfileFriendsScreen({ friends, onBack }: ProfileFriendsScreenProps) {
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
              <Text style={styles.title}>Friends</Text>
              <Text style={styles.subtitle}>See everyone you can invite into planner groups.</Text>
            </View>
          </View>

          {friends.length > 0 ? (
            <View style={styles.listCard}>
              {friends.map((friend) => (
                <View key={friend.id} style={styles.friendRow}>
                  <View style={styles.friendAvatar}>
                    <Text style={styles.friendAvatarText}>
                      {(friend.name?.trim().charAt(0) || '?').toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.friendCopy}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    {friend.email ? <Text style={styles.friendEmail}>{friend.email}</Text> : null}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No friends yet</Text>
              <Text style={styles.emptyText}>Add friends from Profile to start creating shared groups.</Text>
            </View>
          )}
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
  listCard: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 18,
    gap: 14,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  friendAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e7f4e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2f7d32',
  },
  friendCopy: {
    flex: 1,
    gap: 2,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#173222',
  },
  friendEmail: {
    fontSize: 13,
    color: '#5b6c61',
  },
  emptyCard: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#173222',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5b6c61',
  },
});
