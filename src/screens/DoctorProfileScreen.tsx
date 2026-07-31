import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import ScreenContainer from '../components/ScreenContainer';
import { DOCTOR_VET_ID, vets } from '../data/mockData';
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

export default function DoctorProfileScreen({ navigation }: Props) {
  const doctor = vets.find((v) => v.id === DOCTOR_VET_ID)!;

  const handleLogout = () => {
    (navigation.getParent()?.getParent() as any)?.reset({
      index: 0,
      routes: [{ name: 'Landing' }],
    });
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Avatar initial={doctor.initial} color={doctor.color} size={72} uri={doctor.photoUrl} />
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <View style={styles.badgeRow}>
          <Badge label={`⭐ ${doctor.rating} (${doctor.reviewsCount})`} />
          <Badge label={doctor.clinic} tone="neutral" />
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

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
