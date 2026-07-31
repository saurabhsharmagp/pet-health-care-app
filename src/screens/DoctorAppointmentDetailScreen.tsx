import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { appointments, owners, pets } from '../data/mockData';
import { DoctorAppointmentsStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<DoctorAppointmentsStackParamList, 'AppointmentDetail'>;

export default function DoctorAppointmentDetailScreen({ route, navigation }: Props) {
  const appointment = appointments.find((a) => a.id === route.params.appointmentId)!;
  const pet = pets.find((p) => p.id === appointment.petId)!;
  const owner = owners.find((o) => o.id === pet.ownerId)!;
  const [localStatus, setLocalStatus] = useState<typeof appointment.status | null>(null);

  const status = localStatus ?? appointment.status;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Avatar initial={pet.initial} color={pet.color} size={64} uri={pet.photoUrl} />
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petMeta}>{pet.species} · {pet.breed}</Text>
        <Badge
          label={status}
          tone={status === 'completed' ? 'success' : status === 'cancelled' ? 'danger' : 'neutral'}
        />
      </View>

      <TouchableOpacity
        style={styles.ownerCard}
        onPress={() => navigation.navigate('PatientDetail', { petId: pet.id })}
      >
        <Ionicons name="person-circle-outline" size={22} color={colors.textMuted} />
        <View style={styles.ownerInfo}>
          <Text style={styles.ownerName}>{owner.name}</Text>
          <Text style={styles.ownerContact}>{owner.phone}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>

      <View style={styles.card}>
        <DetailRow icon="calendar-outline" label="Date" value={appointment.date} />
        <DetailRow icon="time-outline" label="Time" value={appointment.time} />
        <DetailRow
          icon={appointment.type === 'video' ? 'videocam-outline' : 'location-outline'}
          label="Type"
          value={appointment.type === 'video' ? 'Video call' : 'In-clinic visit'}
        />
        <DetailRow icon="document-text-outline" label="Reason" value={appointment.reason} />
      </View>

      {status === 'upcoming' && (
        <View style={styles.actions}>
          <Button label="Mark as Completed" onPress={() => setLocalStatus('completed')} style={styles.actionButton} />
          <Button
            label="Cancel Visit"
            variant="secondary"
            onPress={() => setLocalStatus('cancelled')}
            style={styles.actionButton}
          />
        </View>
      )}
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
  header: {
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  petName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
  },
  petMeta: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  ownerContact: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
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
  actions: {
    gap: spacing.sm,
  },
  actionButton: {},
});
