import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

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
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={() => {}} style={styles.card}>
          <Text style={styles.title}>Add Friends</Text>
          <Text style={styles.subtitle}>
            Add one or more email addresses to send meal planning invites.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Friend Email</Text>
            <TextInput
              placeholder="friend@example.com"
              placeholderTextColor="#8a9399"
              style={[styles.input, hasEmailDraft && !isEmailValid && styles.inputInvalid]}
              value={emailDraft}
              onChangeText={onChangeEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Text style={[styles.helperText, hasEmailDraft && !isEmailValid && styles.helperTextWarning]}>
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
            <MaterialIcons name="person-add-alt-1" size={18} color="#ffffff" />
            <Text style={styles.addEmailButtonText}>Add Email</Text>
          </Pressable>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Pending Invites</Text>

            {pendingEmails.length > 0 ? (
              <ScrollView contentContainerStyle={styles.emailList} showsVerticalScrollIndicator={false}>
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
                      style={({ pressed }) => [styles.removeButton, pressed && styles.buttonPressed]}>
                      <MaterialIcons name="close" size={16} color="#b6483d" />
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

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={!canSendInvites}
              onPress={onSend}
              style={({ pressed }) => [
                styles.primaryButton,
                !canSendInvites && styles.primaryButtonDisabled,
                pressed && canSendInvites && styles.buttonPressed,
              ]}>
              <Text style={styles.primaryButtonText}>Send Invites</Text>
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
    maxHeight: '84%',
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
  inputInvalid: {
    borderColor: '#d14d41',
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#66756d',
  },
  helperTextWarning: {
    color: '#b6483d',
  },
  addEmailButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#2f7d32',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addEmailButtonDisabled: {
    backgroundColor: '#8eb591',
  },
  addEmailButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  emailList: {
    gap: 10,
  },
  emailChip: {
    borderRadius: 16,
    backgroundColor: '#f7f9f7',
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
    color: '#173222',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fdebea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    borderRadius: 16,
    backgroundColor: '#f7f9f7',
    padding: 14,
    gap: 6,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#173222',
  },
  emptyStateText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#587067',
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
