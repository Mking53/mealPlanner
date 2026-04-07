import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { getInitials } from './profileModels';

type AvatarSize = 'small' | 'medium' | 'large';

type AvatarProps = {
  imageUri?: string;
  initials: string;
  size?: AvatarSize;
  onImageError?: () => void;
};

const SIZE_MAP = {
  small: 44,
  medium: 56,
  large: 68,
};

export function Avatar({ imageUri, initials, size = 'large', onImageError }: AvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowImage = Boolean(imageUri) && !hasImageError;
  const sizePixels = SIZE_MAP[size];
  const borderRadius = sizePixels / 2;

  const handleImageError = () => {
    setHasImageError(true);
    onImageError?.();
  };

  return shouldShowImage ? (
    <Image
      source={{ uri: imageUri }}
      style={[
        styles.image,
        { width: sizePixels, height: sizePixels, borderRadius },
      ]}
      onError={handleImageError}
    />
  ) : (
    <View
      style={[
        styles.fallback,
        { width: sizePixels, height: sizePixels, borderRadius },
      ]}>
      <Text style={[styles.initials, { fontSize: sizePixels * 0.35 }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  fallback: {
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: '800',
    color: COLORS.successDark,
  },
});
