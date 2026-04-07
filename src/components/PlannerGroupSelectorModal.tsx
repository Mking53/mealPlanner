import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';
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
              <MaterialIcons name="close" size={20} color={COLORS.textPrimary} />
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
                    {isSelected ? <MaterialIcons name="check" size={16} color={COLORS.textInvert} /> : null}
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
              <MaterialIcons name="group-add" size={20} color={COLORS.primary} />
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
    backgroundColor: COLORS.background,
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
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundLighter,
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
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  groupRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  groupCopy: {
    flex: 1,
    gap: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  groupNameSelected: {
    color: COLORS.success,
  },
  groupMeta: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },
  groupMetaSelected: {
    color: COLORS.success,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 16,
    gap: 12,
  },
  addGroupButton: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.backgroundLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addGroupButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  doneButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textInvert,
  },
  buttonPressed: {
    opacity: 0.84,
  },
});
