import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

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
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={() => {}} style={styles.card}>
          <Text style={styles.title}>Add Group</Text>
          <Text style={styles.subtitle}>
            Choose friends from your invited list. This is mock UI for now and is not connected yet.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              placeholder="Enter group name"
              placeholderTextColor="#8a9399"
              style={styles.input}
              value={draftGroupName}
              onChangeText={onChangeGroupName}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Friends</Text>
            <ScrollView contentContainerStyle={styles.friendList} showsVerticalScrollIndicator={false}>
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
                      <Text style={[styles.friendName, isSelected && styles.friendNameSelected]}>
                        {friend.name}
                      </Text>
                    </View>

                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected ? <MaterialIcons name="check" size={16} color="#ffffff" /> : null}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={isCreateDisabled}
              onPress={onCreateGroup}
              style={({ pressed }) => [
                styles.primaryButton,
                isCreateDisabled && styles.primaryButtonDisabled,
                pressed && !isCreateDisabled && styles.buttonPressed,
              ]}>
              <Text style={styles.primaryButtonText}>Create Group</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '86%',
    borderRadius: 26,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#173222',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5b6c61',
  },
  fieldGroup: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#54635b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d7dfda',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#13222a',
  },
  friendList: {
    gap: 10,
  },
  friendRow: {
    borderWidth: 1,
    borderColor: '#dbe6dc',
    borderRadius: 18,
    backgroundColor: '#f8fbf7',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  friendRowSelected: {
    borderColor: '#2f7d32',
    backgroundColor: '#e7f4e5',
  },
  friendCopy: {
    flex: 1,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#173222',
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
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: '#2f7d32',
    backgroundColor: '#2f7d32',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#eef2ef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#405249',
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#2f7d32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#8eb591',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  buttonPressed: {
    opacity: 0.84,
  },
});
