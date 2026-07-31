import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { labTestPackages, pets } from '../data/mockData';
import { LabTestsStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<LabTestsStackParamList, 'LabTestConfirmation'>;

export default function LabTestConfirmationScreen({ route, navigation }: Props) {
  const { packageId, petId, date, time, address } = route.params;
  const pkg = labTestPackages.find((p) => p.id === packageId)!;
  const pet = pets.find((p) => p.id === petId)!;

  return (
    <ScreenContainer>
      <View style={styles.iconWrap}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={40} color="#fff" />
        </View>
        <Text style={styles.title}>Sample Collection Booked!</Text>
        <Text style={styles.subtitle}>We'll send a technician to collect {pet.name}'s sample.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.pkgName}>{pkg.name}</Text>
        <Text style={styles.pkgCategory}>{pkg.category}</Text>
        <View style={styles.divider} />
        <DetailRow icon="paw-outline" label="Pet" value={pet.name} />
        <DetailRow icon="calendar-outline" label="Date" value={date} />
        <DetailRow icon="time-outline" label="Time" value={time} />
        <DetailRow icon="location-outline" label="Address" value={address} />
        <DetailRow icon="cash-outline" label="Paid" value={`₹${pkg.price.toLocaleString('en-IN')}`} />
      </View>

      <Button label="Back to Lab Tests" onPress={() => navigation.popToTop()} style={styles.button} />
    </ScreenContainer>
  );
}

function DetailRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={18} color={colors.textMuted} style={styles.detailIcon} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  pkgName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  pkgCategory: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  detailIcon: {
    marginTop: 2,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textMuted,
    width: 70,
  },
  detailValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  button: {
    marginBottom: spacing.sm,
  },
});
