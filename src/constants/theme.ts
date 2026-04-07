const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/**
 * Centralized color palette for consistent styling across components
 */
export const COLORS = {
  // Primary brand colors
  primary: '#2f7d32',
  primaryLight: '#8eb591',
  primaryDark: '#27502a',

  // Background and surfaces
  background: '#ffffff',
  backgroundLight: '#f7f9f7',
  backgroundLighter: '#edf6ed',

  // Text colors
  textPrimary: '#173222',
  textSecondary: '#5b6c61',
  textTertiary: '#587067',
  textDisabled: '#8a9399',
  textInvert: '#ffffff',

  // Accents and states
  success: '#dcefd8',
  successDark: '#1e4e22',
  error: '#b6483d',
  errorLight: '#d14d41',
  errorBackground: '#fdebea',
  warning: '#66756d',

  // Borders and dividers
  border: '#d7dfda',
  borderLight: '#d7f0d5',

  // Shadows (backdrop)
  backdropText: 'rgba(15, 23, 42, 0.45)',
};

/**
 * Centralized card and shadow styles for consistent appearance
 */
export const CARD_STYLES = {
  borderRadius: 26,
  padding: 20,
  borderRadiusSmall: 14,
  borderRadiusMedium: 16,
  borderRadiusLarge: 28,
  shadowColor: '#184b1b',
  shadowOpacity: 0.14,
  shadowOffset: { width: 0, height: 10 },
  shadowRadius: 18,
  elevation: 8,
};

/**
 * Modal-specific styles
 */
export const MODAL_STYLES = {
  borderRadius: 26,
  padding: 20,
  gap: 18,
  maxWidth: 440,
};
