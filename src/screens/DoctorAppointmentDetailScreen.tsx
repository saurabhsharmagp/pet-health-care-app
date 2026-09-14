import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { getAppointment, updateAppointmentStatus } from '../api/bookings';
import { getPet } from '../api/pets';
import { getProfile } from '../api/profiles';
import { Appointment, Pet, Profile } from '../lib/database.types';
import { formatDateLabel, formatTimeLabel } from '../lib/format';
import { petToCardView } from '../lib/viewModels';
import { DoctorAppointmentsStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<DoctorAppointmentsStackParamList, 'AppointmentDetail'>;

export default function DoctorAppointmentDetailScreen({ route, navigation }: Props) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    (async () => {
      const a = await getAppointment(route.params.appointmentId);
      if (!a) {
        setLoading(false);
        return;
      }
      const p = await getPet(a.pet_id);
      const o = p ? await getProfile(p.owner_id) : null;
      setAppointment(a);
      setPet(p);
      setOwner(o);
      setLoading(false);
    })();
  }, [route.params.appointmentId]);

  const handleStatusChange = async (status: 'completed' | 'cancelled') => {
    if (!appointment || updating) return;
    setUpdating(true);
    await updateAppointmentStatus(appointment.id, status);
    setAppointment({ ...appointment, status });
    setUpdating(false);
  };

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  if (!appointment || !pet || !owner) {
    return (
      <ScreenContainer>
        <Text>Appointment not found.</Text>
      </ScreenContainer>
    );
  }

  const view = petToCardView(pet);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Avatar initial={view.initial} color={view.color} size={64} uri={view.photoUrl} />
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petMeta}>{pet.species} · {pet.breed ?? ''}</Text>
        <Badge
          label={appointment.status}
          tone={appointment.status === 'completed' ? 'success' : appointment.status === 'cancelled' ? 'danger' : 'neutral'}
        />
      </View>

      <TouchableOpacity
        style={styles.ownerCard}
        onPress={() => navigation.navigate('PatientDetail', { petId: pet.id })}
      >
        <Ionicons name="person-circle-outline" size={22} color={colors.textMuted} />
        <View style={styles.ownerInfo}>
          <Text style={styles.ownerName}>{owner.name}</Text>
          <Text style={styles.ownerContact}>{owner.phone ?? owner.email}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>

      <View style={styles.card}>
        <DetailRow icon="calendar-outline" label="Date" value={formatDateLabel(appointment.slot_at)} />
        <DetailRow icon="time-outline" label="Time" value={formatTimeLabel(appointment.slot_at)} />
        <DetailRow
          icon={appointment.type === 'video' ? 'videocam-outline' : 'location-outline'}
          label="Type"
          value={appointment.type === 'video' ? 'Video call' : 'In-clinic visit'}
        />
        <DetailRow icon="document-text-outline" label="Reason" value={appointment.reason ?? ''} />
      </View>

      {appointment.status === 'upcoming' && (
        <View style={styles.actions}>
          <Button
            label="Mark as Completed"
            onPress={() => handleStatusChange('completed')}
            loading={updating}
            style={styles.actionButton}
          />
          <Button
            label="Cancel Visit"
            variant="secondary"
            onPress={() => handleStatusChange('cancelled')}
            loading={updating}
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
