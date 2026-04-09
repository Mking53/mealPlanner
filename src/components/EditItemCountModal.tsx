import { ModalWrapper } from './ModalWrapper';
import { ValidatedInput } from './ValidatedInput';

type EditItemCountModalProps = {
  draftCount: string;
  fieldLabel?: string;
  isCountValid: boolean;
  itemName: string;
  onChangeCount: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  title?: string;
  visible: boolean;
};

export function EditItemCountModal({
  draftCount,
  fieldLabel = 'Count',
  isCountValid,
  itemName,
  onChangeCount,
  onClose,
  onSave,
  title = 'Edit Count',
  visible,
}: EditItemCountModalProps) {
  const isSaveDisabled = draftCount.trim().length === 0 || !isCountValid;

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title={title}
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
        label={fieldLabel}
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
