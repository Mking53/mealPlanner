import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { CARD_STYLES, COLORS } from '../constants/theme';
import { ModalWrapper } from './ModalWrapper';

export type SelectableItem = {
  id: string;
  [key: string]: any;
};

type SelectableListModalProps<T extends SelectableItem> = {
  items: T[];
  selectedIds: string[];
  onToggle: (itemId: string) => void;
  onClose: () => void;
  visible: boolean;
  title?: string;
  subtitle?: string;
  renderItem: (
    item: T,
    isSelected: boolean,
    onPress: () => void,
  ) => React.ReactNode;
  renderCheckbox?: (isSelected: boolean) => React.ReactNode;
  primaryAction?: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
  };
  maxHeight?: number | string;
};

export function SelectableListModal<T extends SelectableItem>({
  items,
  selectedIds,
  onToggle,
  onClose,
  visible,
  title,
  subtitle,
  renderItem,
  renderCheckbox,
  primaryAction,
  maxHeight = 400,
}: SelectableListModalProps<T>) {
  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      primaryAction={
        primaryAction || {
          label: 'Done',
          onPress: onClose,
        }
      }
      secondaryAction={{
        label: 'Cancel',
        onPress: onClose,
      }}>
      <View style={[styles.container, { maxHeight: maxHeight as number }]}>
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);

            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => {
                  onToggle(item.id);
                }}
                style={({ pressed }) => [
                  styles.row,
                  isSelected && styles.rowSelected,
                  pressed && styles.rowPressed,
                ]}>
                <View style={styles.rowContent}>
                  {renderItem(item, isSelected, () => onToggle(item.id))}
                </View>
                {renderCheckbox && (
                  <View style={styles.checkboxContainer}>
                    {renderCheckbox(isSelected)}
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: CARD_STYLES.borderRadiusMedium,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  listContent: {
    gap: 10,
    padding: 4,
  },
  row: {
    borderRadius: CARD_STYLES.borderRadiusMedium,
    borderWidth: 1,
    borderColor: '#dbe6dc',
    backgroundColor: '#f8fbf7',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  rowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#e7f4e5',
  },
  rowPressed: {
    opacity: 0.84,
  },
  rowContent: {
    flex: 1,
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
