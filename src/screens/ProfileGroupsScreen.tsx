import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { PlannerGroup } from '@/src/components';

type ProfileGroupsScreenProps = {
  groups: PlannerGroup[];
  onBack: () => void;
  onEditGroup: (group: PlannerGroup) => void;
};

export function ProfileGroupsScreen({ groups, onBack, onEditGroup }: ProfileGroupsScreenProps) {
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
              <Text style={styles.title}>Groups</Text>
              <Text style={styles.subtitle}>Review your planner groups and update who belongs to each one.</Text>
            </View>
          </View>

          {groups.length > 0 ? (
            <View style={styles.listCard}>
              {groups.map((group) => {
                const memberSummary =
                  group.memberNamesPreview && group.memberNamesPreview.length > 0
                    ? group.memberNamesPreview.join(', ')
                    : `${group.memberIds.length} friend${group.memberIds.length === 1 ? '' : 's'}`;

                return (
                  <Pressable
                    key={group.id}
                    accessibilityRole="button"
                    onPress={() => {
                      onEditGroup(group);
                    }}
                    style={({ pressed }) => [styles.groupRow, pressed && styles.buttonPressed]}>
                    <View style={styles.groupCopy}>
                      <Text style={styles.groupName}>{group.name}</Text>
                      <Text style={styles.groupMembers}>{memberSummary}</Text>
                    </View>
                    <Text style={styles.groupAction}>Edit</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No groups yet</Text>
              <Text style={styles.emptyText}>Create a group in Planner to start sharing meals with friends.</Text>
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
  groupRow: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dfe7dd',
    backgroundColor: '#f8fbf7',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  groupCopy: {
    flex: 1,
    gap: 4,
  },
  groupName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#173222',
  },
  groupMembers: {
    fontSize: 13,
    lineHeight: 18,
    color: '#5b6c61',
  },
  groupAction: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2f7d32',
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
