import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import ScreenContainer from '../components/ScreenContainer';
import { getVet, VetDirectoryEntry } from '../api/professionals';
import { useAuth } from '../lib/AuthContext';
import { vetToCardView } from '../lib/viewModels';
import { DoctorDashboardStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<DoctorDashboardStackParamList, 'Profile'>;

const menuItems: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'person-outline', label: 'Personal information' },
  { icon: 'business-outline', label: 'Clinic details' },
  { icon: 'card-outline', label: 'Payout settings' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'help-circle-outline', label: 'Help & support' },
];

export default function DoctorProfileScreen({}: Props) {
  const { profile, signOut } = useAuth();
  const [vet, setVet] = useState<VetDirectoryEntry | null>(null);

  useEffect(() => {
    if (!profile) return;
    getVet(profile.id).then(setVet);
  }, [profile]);

  if (!profile || !vet) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  const view = vetToCardView(vet);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Avatar initial={view.initial} color={view.color} size={72} uri={view.photoUrl} />
        <Text style={styles.name}>{view.name}</Text>
        <Text style={styles.specialty}>{view.specialty}</Text>
        <View style={styles.badgeRow}>
          <Badge label={`⭐ ${view.rating} (${view.reviewsCount})`} />
          <Badge label={view.clinic} tone="neutral" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.menuCard}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuRow, idx !== menuItems.length - 1 && styles.menuRowBorder]}
          >
            <Ionicons name={item.icon} size={20} color={colors.textMuted} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
  },
  specialty: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: spacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  logoutText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 14,
  },
});
