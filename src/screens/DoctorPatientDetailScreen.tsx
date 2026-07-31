import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { DOCTOR_VET_ID, appointments, doctorThreads, owners, pets } from '../data/mockData';
import { DoctorPatientsStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<DoctorPatientsStackParamList, 'PatientDetail'>;

const statusTone: Record<string, 'success' | 'neutral' | 'danger'> = {
  upcoming: 'neutral',
  completed: 'success',
  cancelled: 'danger',
};

export default function DoctorPatientDetailScreen({ route, navigation }: Props) {
  const pet = pets.find((p) => p.id === route.params.petId)!;
  const owner = owners.find((o) => o.id === pet.ownerId)!;
  const visits = appointments
    .filter((a) => a.petId === pet.id && a.vetId === DOCTOR_VET_ID)
    .slice()
    .reverse();
  const thread = doctorThreads.find((t) => t.petId === pet.id && t.vetId === DOCTOR_VET_ID);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Avatar initial={pet.initial} color={pet.color} size={76} uri={pet.photoUrl} />
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.meta}>{pet.species} · {pet.breed} · {pet.age} · {pet.weightKg} kg</Text>
      </View>

      <Text style={styles.sectionTitle}>Owner</Text>
      <View style={styles.ownerCard}>
        <View style={styles.ownerRow}>
          <Ionicons name="person-outline" size={18} color={colors.textMuted} />
          <Text style={styles.ownerText}>{owner.name}</Text>
        </View>
        <View style={styles.ownerRow}>
          <Ionicons name="call-outline" size={18} color={colors.textMuted} />
          <Text style={styles.ownerText}>{owner.phone}</Text>
        </View>
        <View style={styles.ownerRow}>
          <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
          <Text style={styles.ownerText}>{owner.email}</Text>
        </View>
      </View>

      {thread && (
        <Button
          label="Message Owner"
          variant="outline"
          onPress={() =>
            navigation.getParent()?.navigate('Messages', { screen: 'Chat', params: { threadId: thread.id } } as never)
          }
          style={styles.messageButton}
        />
      )}

      <Text style={styles.sectionTitle}>Visit history</Text>
      {visits.length === 0 ? (
        <Text style={styles.emptyText}>No visits recorded yet.</Text>
      ) : (
        visits.map((visit) => (
          <View key={visit.id} style={styles.visitCard}>
            <View style={styles.visitRow}>
              <Text style={styles.visitReason}>{visit.reason}</Text>
              <Badge label={visit.status} tone={statusTone[visit.status]} />
            </View>
            <Text style={styles.visitDate}>{visit.date} · {visit.time}</Text>
          </View>
        ))
      )}
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
  meta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  ownerCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 10,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ownerText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  messageButton: {
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  visitCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  visitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  visitReason: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  visitDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
