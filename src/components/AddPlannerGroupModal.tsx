import { useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, CARD_STYLES } from '../constants/theme';
import { ModalWrapper } from './ModalWrapper';

import type { PlannerFriendOption } from './plannerGroupModels';

type AddPlannerGroupModalProps = {
  actionLabel?: string;
  draftGroupName: string;
  friends: PlannerFriendOption[];
  isCreateDisabled: boolean;
  onChangeGroupName: (value: string) => void;
  onClose: () => void;
  onCreateGroup: () => void;
  subtitle?: string;
  title?: string;
  onToggleFriend: (friendId: string) => void;
  selectedFriendIds: string[];
  visible: boolean;
};

export function AddPlannerGroupModal({
  actionLabel = 'Create Group',
  draftGroupName,
  friends,
  isCreateDisabled,
  onChangeGroupName,
  onClose,
  onCreateGroup,
  subtitle = 'Choose friends from your connected list to create a planner group.',
  title = 'Add Group',
  onToggleFriend,
  selectedFriendIds,
  visible,
}: AddPlannerGroupModalProps) {
  const [friendSearch, setFriendSearch] = useState('');
  const normalizedFriendSearch = friendSearch.trim().toLowerCase();
  const filteredFriends = useMemo(
    () =>
      friends.filter((friend) => {
        if (!normalizedFriendSearch) {
          return true;
        }

        const searchable = `${friend.name} ${friend.email ?? ''}`.toLowerCase();
        return searchable.includes(normalizedFriendSearch);
      }),
    [friends, normalizedFriendSearch]
  );

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      primaryAction={{
        label: actionLabel,
        onPress: onCreateGroup,
        disabled: isCreateDisabled,
      }}
      secondaryAction={{
        label: 'Cancel',
        onPress: onClose,
      }}>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Group Name</Text>
        <TextInput
          placeholder="Enter group name"
          placeholderTextColor={COLORS.textDisabled}
          style={styles.input}
          value={draftGroupName}
          onChangeText={onChangeGroupName}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Friends</Text>
        <TextInput
          placeholder="Search friends"
          placeholderTextColor={COLORS.textDisabled}
          style={styles.input}
          value={friendSearch}
          onChangeText={setFriendSearch}
        />
        <Text style={styles.helperText}>
          Select multiple friends to add them to the group at the same time.
        </Text>
        <ScrollView
          contentContainerStyle={styles.friendList}
          showsVerticalScrollIndicator={false}>
          {filteredFriends.map((friend) => {
            const isSelected = selectedFriendIds.includes(friend.id);

            return (
              <Pressable
                key={friend.id}
                accessibilityRole="button"
                onPress={() => {
                  onToggleFriend(friend.id);
                }}
                style={({ pressed }) => [
                  styles.friendRow,
                  isSelected && styles.friendRowSelected,
                  pressed && styles.buttonPressed,
                ]}>
                <View style={styles.friendCopy}>
                  <Text
                    style={[
                      styles.friendName,
                      isSelected && styles.friendNameSelected,
                    ]}>
                    {friend.name}
                  </Text>
                  {friend.email ? <Text style={styles.friendEmail}>{friend.email}</Text> : null}
                </View>

                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}>
                  {isSelected ? (
                    <MaterialIcons name="check" size={16} color={COLORS.textInvert} />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
          {filteredFriends.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No friends match your search.</Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: CARD_STYLES.borderRadiusSmall,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  friendList: {
    gap: 10,
  },
  friendRow: {
    borderWidth: 1,
    borderColor: '#dbe6dc',
    borderRadius: CARD_STYLES.borderRadiusMedium,
    backgroundColor: '#f8fbf7',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  friendRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#e7f4e5',
  },
  friendCopy: {
    flex: 1,
    gap: 2,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  friendNameSelected: {
    color: '#215c25',
  },
  friendEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#c5d4c7',
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  buttonPressed: {
    opacity: 0.84,
  },
  emptyState: {
    borderRadius: CARD_STYLES.borderRadiusMedium,
    backgroundColor: COLORS.backgroundLight,
    padding: 14,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
