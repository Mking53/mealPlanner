import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { CARD_STYLES, COLORS } from '../constants/theme';

type CardWrapperProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
  noShadow?: boolean;
};

export function CardWrapper({
  children,
  style,
  noPadding = false,
  noShadow = false,
}: CardWrapperProps) {
  return (
    <View
      style={[
        styles.card,
        noPadding && styles.noPadding,
        noShadow && styles.noShadow,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: CARD_STYLES.borderRadius,
    backgroundColor: COLORS.background,
    padding: CARD_STYLES.padding,
    shadowColor: CARD_STYLES.shadowColor,
    shadowOpacity: CARD_STYLES.shadowOpacity,
    shadowOffset: CARD_STYLES.shadowOffset,
    shadowRadius: CARD_STYLES.shadowRadius,
    elevation: CARD_STYLES.elevation,
  },
  noPadding: {
    padding: 0,
  },
  noShadow: {
    shadowOpacity: 0,
    elevation: 0,
  },
});
