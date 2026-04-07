import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

type AuthMode = 'createAccount' | 'signIn';

type AuthScreenProps = {
  onCreateAccount: (name: string, email: string, password: string) => void;
  onSignIn: (email: string, password: string) => void;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function AuthScreen({ onCreateAccount, onSignIn }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const isEmailValid = isValidEmail(trimmedEmail);
  const isPasswordValid = password.trim().length >= 6;
  const doPasswordsMatch = password === confirmPassword;

  const validationMessage = useMemo(() => {
    if (!isEmailValid && trimmedEmail.length > 0) {
      return 'Enter a valid email address.';
    }

    if (!isPasswordValid && password.length > 0) {
      return 'Password must be at least 6 characters.';
    }

    if (mode === 'createAccount' && confirmPassword.length > 0 && !doPasswordsMatch) {
      return 'Passwords must match.';
    }

    return null;
  }, [confirmPassword.length, doPasswordsMatch, isEmailValid, isPasswordValid, mode, password.length, trimmedEmail.length]);

  const isSubmitDisabled =
    !isEmailValid ||
    !isPasswordValid ||
    (mode === 'createAccount' && (trimmedName.length === 0 || !doPasswordsMatch));

  function handleSubmit() {
    if (isSubmitDisabled) {
      return;
    }

    if (mode === 'signIn') {
      onSignIn(trimmedEmail, password);
      return;
    }

    onCreateAccount(trimmedName, trimmedEmail, password);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Welcome Back</Text>
          <Text style={styles.title}>Meal Planner</Text>
          <Text style={styles.subtitle}>
            Sign in or create an account to keep your meals, groups, and planning flow in one place.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setMode('signIn');
              }}
              style={({ pressed }) => [
                styles.toggleButton,
                mode === 'signIn' && styles.toggleButtonSelected,
                pressed && styles.buttonPressed,
              ]}>
              <Text style={[styles.toggleButtonText, mode === 'signIn' && styles.toggleButtonTextSelected]}>
                Sign In
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setMode('createAccount');
              }}
              style={({ pressed }) => [
                styles.toggleButton,
                mode === 'createAccount' && styles.toggleButtonSelected,
                pressed && styles.buttonPressed,
              ]}>
              <Text
                style={[
                  styles.toggleButtonText,
                  mode === 'createAccount' && styles.toggleButtonTextSelected,
                ]}>
                Create Account
              </Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            {mode === 'createAccount' ? (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  placeholder="Your full name"
                  placeholderTextColor="#8a9399"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="you@example.com"
                placeholderTextColor="#8a9399"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#8a9399"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {mode === 'createAccount' ? (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  placeholder="Re-enter password"
                  placeholderTextColor="#8a9399"
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            ) : null}

            <Text style={[styles.helperText, validationMessage ? styles.helperTextWarning : null]}>
              {validationMessage ??
                (mode === 'signIn'
                  ? 'Use any valid email and a password with 6+ characters.'
                  : 'Create your account with a name, valid email, and matching password.')}
            </Text>

            <Pressable
              accessibilityRole="button"
              disabled={isSubmitDisabled}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.primaryButton,
                isSubmitDisabled && styles.primaryButtonDisabled,
                pressed && !isSubmitDisabled && styles.buttonPressed,
              ]}>
              <Text style={styles.primaryButtonText}>
                {mode === 'signIn' ? 'Sign In' : 'Create Account'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f6ef',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  hero: {
    gap: 8,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2f7d32',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#173222',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5b6c61',
  },
  card: {
    borderRadius: 28,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 20,
    shadowColor: '#16301c',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    borderRadius: 18,
    backgroundColor: '#edf5ee',
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonSelected: {
    backgroundColor: '#2f7d32',
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2f7d32',
  },
  toggleButtonTextSelected: {
    color: '#ffffff',
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
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
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#66756d',
  },
  helperTextWarning: {
    color: '#b6483d',
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#2f7d32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#8eb591',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  buttonPressed: {
    opacity: 0.84,
  },
});
