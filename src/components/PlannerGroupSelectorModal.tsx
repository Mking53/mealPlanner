import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { PlannerGroup } from './plannerGroupModels';

type PlannerGroupSelectorModalProps = {
  groups: PlannerGroup[];
  onAddGroup: () => void;
  onClose: () => void;
  onToggleGroup: (groupId: string) => void;
  selectedGroupIds: string[];
  visible: boolean;
};

export function PlannerGroupSelectorModal({
  groups,
  onAddGroup,
  onClose,
  onToggleGroup,
  selectedGroupIds,
  visible,
}: PlannerGroupSelectorModalProps) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={() => {}} style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>Groups Selected</Text>
              <Text style={styles.subtitle}>Choose one or more groups to keep in view.</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.buttonPressed]}>
              <MaterialIcons name="close" size={20} color="#173222" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.groupList} showsVerticalScrollIndicator={false}>
            {groups.map((group) => {
              const isSelected = selectedGroupIds.includes(group.id);

              return (
                <Pressable
                  key={group.id}
                  accessibilityRole="button"
                  onPress={() => {
                    onToggleGroup(group.id);
                  }}
                  style={({ pressed }) => [
                    styles.groupRow,
                    isSelected && styles.groupRowSelected,
                    pressed && styles.buttonPressed,
                  ]}>
                  <View style={styles.groupCopy}>
                    <Text style={[styles.groupName, isSelected && styles.groupNameSelected]}>
                      {group.name}
                    </Text>
                    <Text style={[styles.groupMeta, isSelected && styles.groupMetaSelected]}>
                      {group.memberNamesPreview?.join(', ') ?? `${group.memberIds.length} members`}
                    </Text>
                  </View>

                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected ? <MaterialIcons name="check" size={16} color="#ffffff" /> : null}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              onPress={onAddGroup}
              style={({ pressed }) => [styles.addGroupButton, pressed && styles.buttonPressed]}>
              <MaterialIcons name="group-add" size={20} color="#2f7d32" />
              <Text style={styles.addGroupButtonText}>Add Group</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.doneButton, pressed && styles.buttonPressed]}>
              <Text style={styles.doneButtonText}>Done</Text>
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
    backgroundColor: 'rgba(17, 24, 28, 0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    maxHeight: '72%',
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#173222',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5b6c61',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef2ef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupList: {
    gap: 12,
    paddingBottom: 4,
  },
  groupRow: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dbe6dc',
    backgroundColor: '#f8fbf7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  groupRowSelected: {
    borderColor: '#2f7d32',
    backgroundColor: '#e7f4e5',
  },
  groupCopy: {
    flex: 1,
    gap: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#173222',
  },
  groupNameSelected: {
    color: '#215c25',
  },
  groupMeta: {
    fontSize: 13,
    lineHeight: 18,
    color: '#5b6c61',
  },
  groupMetaSelected: {
    color: '#39713d',
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
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#ecf1ec',
    paddingTop: 16,
    gap: 12,
  },
  addGroupButton: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#2f7d32',
    backgroundColor: '#f7fbf7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addGroupButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2f7d32',
  },
  doneButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#2f7d32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  buttonPressed: {
    opacity: 0.84,
  },
});
