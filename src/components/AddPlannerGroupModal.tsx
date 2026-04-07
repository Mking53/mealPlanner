import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, CARD_STYLES } from '../constants/theme';
import { ModalWrapper } from './ModalWrapper';

import type { PlannerFriendOption } from './plannerGroupModels';

type AddPlannerGroupModalProps = {
  draftGroupName: string;
  friends: PlannerFriendOption[];
  isCreateDisabled: boolean;
  onChangeGroupName: (value: string) => void;
  onClose: () => void;
  onCreateGroup: () => void;
  onToggleFriend: (friendId: string) => void;
  selectedFriendIds: string[];
  visible: boolean;
};

export function AddPlannerGroupModal({
  draftGroupName,
  friends,
  isCreateDisabled,
  onChangeGroupName,
  onClose,
  onCreateGroup,
  onToggleFriend,
  selectedFriendIds,
  visible,
}: AddPlannerGroupModalProps) {
  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Add Group"
      subtitle="Choose friends from your invited list. This is mock UI for now and is not connected yet."
      primaryAction={{
        label: 'Create Group',
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
        <ScrollView
          contentContainerStyle={styles.friendList}
          showsVerticalScrollIndicator={false}>
          {friends.map((friend) => {
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
  },
  friendName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  friendNameSelected: {
    color: '#215c25',
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
});
