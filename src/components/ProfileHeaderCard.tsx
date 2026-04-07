import { StyleSheet, Text, View } from 'react-native';
import { CARD_STYLES, COLORS } from '../constants/theme';
import { Avatar } from './Avatar';
import { getInitials } from './profileModels';

type ProfileHeaderCardProps = {
  imageUri?: string;
  subtitle: string;
  userName: string;
};

export function ProfileHeaderCard({
  imageUri,
  subtitle,
  userName,
}: ProfileHeaderCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.copyColumn}>
        <Text style={styles.eyebrow}>Your Profile</Text>
        <Text style={styles.title}>{userName}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <Avatar
        imageUri={imageUri}
        initials={getInitials(userName)}
        size="large"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: CARD_STYLES.borderRadiusLarge,
    paddingHorizontal: 20,
    paddingVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: CARD_STYLES.shadowColor,
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
    color: COLORS.textInvert,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#e7f5e7',
  },
});
