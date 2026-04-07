import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { getInitials } from './profileModels';

type ProfileHeaderCardProps = {
  imageUri?: string;
  subtitle: string;
  userName: string;
};

export function ProfileHeaderCard({ imageUri, subtitle, userName }: ProfileHeaderCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowImage = Boolean(imageUri) && !hasImageError;

  return (
    <View style={styles.card}>
      <View style={styles.copyColumn}>
        <Text style={styles.eyebrow}>Your Profile</Text>
        <Text style={styles.title}>{userName}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {shouldShowImage ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.avatarImage}
          onError={() => {
            setHasImageError(true);
          }}
        />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarInitials}>{getInitials(userName)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2f7d32',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#184b1b',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 8,
  },
  copyColumn: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    color: '#d7f0d5',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#e7f5e7',
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  avatarFallback: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#dcefd8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e4e22',
  },
});
