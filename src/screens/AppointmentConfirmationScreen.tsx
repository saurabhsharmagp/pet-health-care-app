import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { pets, vets } from '../data/mockData';
import { HomeStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'AppointmentConfirmation'>;

export default function AppointmentConfirmationScreen({ route, navigation }: Props) {
  const { vetId, petId, date, time, type, reason } = route.params;
  const vet = vets.find((v) => v.id === vetId)!;
  const pet = pets.find((p) => p.id === petId)!;

  return (
    <ScreenContainer>
      <View style={styles.iconWrap}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={40} color="#fff" />
        </View>
        <Text style={styles.title}>Appointment Confirmed!</Text>
        <Text style={styles.subtitle}>
          A confirmation has been sent for {pet.name}'s visit.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Avatar initial={vet.initial} color={vet.color} size={48} uri={vet.photoUrl} />
          <View style={styles.info}>
            <Text style={styles.vetName}>{vet.name}</Text>
            <Text style={styles.vetSpecialty}>{vet.specialty}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <DetailRow icon="paw-outline" label="Pet" value={pet.name} />
        <DetailRow icon="calendar-outline" label="Date" value={date} />
        <DetailRow icon="time-outline" label="Time" value={time} />
        <DetailRow
          icon={type === 'video' ? 'videocam-outline' : 'location-outline'}
          label="Type"
          value={type === 'video' ? 'Video call' : `In-clinic · ${vet.clinic}`}
        />
        <DetailRow icon="document-text-outline" label="Reason" value={reason} />
      </View>

      <Button
        label="View my appointments"
        onPress={() => navigation.getParent()?.navigate('Appointments' as never)}
        style={styles.button}
      />
      <Button
        label="Back to home"
        variant="outline"
        onPress={() => navigation.popToTop()}
        style={styles.button}
      />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: spacing.md,
  },
  vetName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  vetSpecialty: {
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
    width: 60,
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
