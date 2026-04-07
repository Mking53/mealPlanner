import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, CARD_STYLES, MODAL_STYLES } from '../constants/theme';

type ModalAction = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

type ModalWrapperProps = {
  children: React.ReactNode;
  onClose: () => void;
  visible: boolean;
  title?: string;
  subtitle?: string;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  animationType?: 'fade' | 'slide' | 'none';
};

export function ModalWrapper({
  children,
  onClose,
  visible,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  animationType = 'fade',
}: ModalWrapperProps) {
  const showActions = primaryAction || secondaryAction;

  return (
    <Modal animationType={animationType} transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={() => {}} style={styles.card}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          <View style={styles.content}>{children}</View>

          {showActions && (
            <View style={styles.actions}>
              {secondaryAction && (
                <Pressable
                  accessibilityRole="button"
                  onPress={secondaryAction.onPress}
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && styles.buttonPressed,
                  ]}>
                  <Text style={styles.secondaryButtonText}>
                    {secondaryAction.label}
                  </Text>
                </Pressable>
              )}
              {primaryAction && (
                <Pressable
                  accessibilityRole="button"
                  disabled={primaryAction.disabled}
                  onPress={primaryAction.onPress}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    primaryAction.disabled && styles.primaryButtonDisabled,
                    pressed && primaryAction.disabled === false && styles.buttonPressed,
                  ]}>
                  <Text style={styles.primaryButtonText}>
                    {primaryAction.label}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.backdropText,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: MODAL_STYLES.maxWidth as number,
    borderRadius: MODAL_STYLES.borderRadius,
    backgroundColor: COLORS.background,
    padding: MODAL_STYLES.padding,
    gap: MODAL_STYLES.gap,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  content: {
    gap: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: CARD_STYLES.borderRadiusMedium,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.primaryLight,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textInvert,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: CARD_STYLES.borderRadiusMedium,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#405249',
  },
  buttonPressed: {
    opacity: 0.84,
  },
});
