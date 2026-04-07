import { COLORS } from '../constants/theme';
import { ModalWrapper } from './ModalWrapper';
import { ValidatedInput } from './ValidatedInput';

type EditItemCountModalProps = {
  draftCount: string;
  isCountValid: boolean;
  itemName: string;
  onChangeCount: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  visible: boolean;
};

export function EditItemCountModal({
  draftCount,
  isCountValid,
  itemName,
  onChangeCount,
  onClose,
  onSave,
  visible,
}: EditItemCountModalProps) {
  const isSaveDisabled = draftCount.trim().length === 0 || !isCountValid;

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Edit Count"
      subtitle={itemName}
      primaryAction={{
        label: 'Save',
        onPress: onSave,
        disabled: isSaveDisabled,
      }}
      secondaryAction={{
        label: 'Cancel',
        onPress: onClose,
      }}>
      <ValidatedInput
        label="Count"
        placeholder="Enter count"
        value={draftCount}
        onChangeText={onChangeCount}
        isValid={isCountValid}
        helperText={
          draftCount.trim().length > 0 && !isCountValid
            ? 'Please enter a valid count'
            : undefined
        }
        keyboardType="number-pad"
      />
    </ModalWrapper>
  );
}
