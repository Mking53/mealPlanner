import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, CARD_STYLES } from '../constants/theme';
import { ModalWrapper } from './ModalWrapper';

type AddFriendsModalProps = {
  canAddEmail: boolean;
  canSendInvites: boolean;
  emailDraft: string;
  isEmailValid: boolean;
  onAddEmail: () => void;
  onChangeEmail: (value: string) => void;
  onClose: () => void;
  onRemoveEmail: (email: string) => void;
  onSend: () => void;
  pendingEmails: string[];
  visible: boolean;
};

export function AddFriendsModal({
  canAddEmail,
  canSendInvites,
  emailDraft,
  isEmailValid,
  onAddEmail,
  onChangeEmail,
  onClose,
  onRemoveEmail,
  onSend,
  pendingEmails,
  visible,
}: AddFriendsModalProps) {
  const hasEmailDraft = emailDraft.trim().length > 0;

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Add Friends"
      subtitle="Add one or more email addresses to send meal planning invites."
      primaryAction={{
        label: 'Send Invites',
        onPress: onSend,
        disabled: !canSendInvites,
      }}
      secondaryAction={{
        label: 'Cancel',
        onPress: onClose,
      }}>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Friend Email</Text>
        <TextInput
          placeholder="friend@example.com"
          placeholderTextColor={COLORS.textDisabled}
          style={[styles.input, hasEmailDraft && !isEmailValid && styles.inputInvalid]}
          value={emailDraft}
          onChangeText={onChangeEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text
          style={[styles.helperText, hasEmailDraft && !isEmailValid && styles.helperTextWarning]}>
          {hasEmailDraft && !isEmailValid
            ? 'Enter a valid email address that has not already been added.'
            : 'You can add multiple email addresses before sending invites.'}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={!canAddEmail}
        onPress={onAddEmail}
        style={({ pressed }) => [
          styles.addEmailButton,
          !canAddEmail && styles.addEmailButtonDisabled,
          pressed && canAddEmail && styles.buttonPressed,
        ]}>
        <MaterialIcons name="person-add-alt-1" size={18} color={COLORS.textInvert} />
        <Text style={styles.addEmailButtonText}>Add Email</Text>
      </Pressable>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Pending Invites</Text>

        {pendingEmails.length > 0 ? (
          <ScrollView
            contentContainerStyle={styles.emailList}
            showsVerticalScrollIndicator={false}>
            {pendingEmails.map((email) => (
              <View key={email} style={styles.emailChip}>
                <Text numberOfLines={1} style={styles.emailChipText}>
                  {email}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    onRemoveEmail(email);
                  }}
                  style={({ pressed }) => [
                    styles.removeButton,
                    pressed && styles.buttonPressed,
                  ]}>
                  <MaterialIcons name="close" size={16} color={COLORS.error} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No invites added yet</Text>
            <Text style={styles.emptyStateText}>
              Add email addresses above, then send them together.
            </Text>
          </View>
        )}
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
  inputInvalid: {
    borderColor: COLORS.errorLight,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.warning,
  },
  helperTextWarning: {
    color: COLORS.error,
  },
  addEmailButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addEmailButtonDisabled: {
    backgroundColor: COLORS.primaryLight,
  },
  addEmailButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textInvert,
  },
  emailList: {
    gap: 10,
  },
  emailChip: {
    borderRadius: 16,
    backgroundColor: COLORS.backgroundLight,
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  emailChipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textPrimary,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.errorBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    borderRadius: CARD_STYLES.borderRadiusMedium,
    backgroundColor: COLORS.backgroundLight,
    padding: 14,
    gap: 6,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptyStateText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textTertiary,
  },
  buttonPressed: {
    opacity: 0.84,
  },
});
