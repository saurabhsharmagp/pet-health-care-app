import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { getAppointment, updateAppointmentStatus } from '../api/bookings';
import { getPet } from '../api/pets';
import { getVet, VetDirectoryEntry } from '../api/professionals';
import { Appointment, Pet } from '../lib/database.types';
import { formatDateLabel, formatTimeLabel } from '../lib/format';
import { vetToCardView } from '../lib/viewModels';
import { AppointmentsStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<AppointmentsStackParamList, 'AppointmentDetail'>;

export default function AppointmentDetailScreen({ route, navigation }: Props) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [vet, setVet] = useState<VetDirectoryEntry | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    (async () => {
      const a = await getAppointment(route.params.appointmentId);
      if (!a) {
        setLoading(false);
        return;
      }
      const [v, p] = await Promise.all([getVet(a.vet_id), getPet(a.pet_id)]);
      setAppointment(a);
      setVet(v);
      setPet(p);
      setLoading(false);
    })();
  }, [route.params.appointmentId]);

  const handleCancel = async () => {
    if (!appointment || cancelling) return;
    setCancelling(true);
    await updateAppointmentStatus(appointment.id, 'cancelled');
    setAppointment({ ...appointment, status: 'cancelled' });
    setCancelling(false);
  };

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  if (!appointment || !vet || !pet) {
    return (
      <ScreenContainer>
        <Text>Appointment not found.</Text>
      </ScreenContainer>
    );
  }

  const view = vetToCardView(vet);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Avatar initial={view.initial} color={view.color} size={64} uri={view.photoUrl} />
        <Text style={styles.vetName}>{view.name}</Text>
        <Text style={styles.vetSpecialty}>{view.specialty}</Text>
        <Badge
          label={appointment.status}
          tone={appointment.status === 'completed' ? 'success' : appointment.status === 'cancelled' ? 'danger' : 'neutral'}
        />
      </View>

      <View style={styles.card}>
        <DetailRow icon="paw-outline" label="Pet" value={`${pet.name} (${pet.breed ?? ''})`} />
        <DetailRow icon="calendar-outline" label="Date" value={formatDateLabel(appointment.slot_at)} />
        <DetailRow icon="time-outline" label="Time" value={formatTimeLabel(appointment.slot_at)} />
        <DetailRow
          icon={appointment.type === 'video' ? 'videocam-outline' : 'location-outline'}
          label="Type"
          value={appointment.type === 'video' ? 'Video call' : `In-clinic · ${view.clinic}`}
        />
        <DetailRow icon="document-text-outline" label="Reason" value={appointment.reason ?? ''} />
      </View>

      {appointment.status === 'upcoming' && (
        <View style={styles.actions}>
          {appointment.type === 'video' && (
            <Button
              label="Join video call"
              onPress={() => navigation.getParent()?.navigate('Consult', { screen: 'VideoCall', params: { vetId: vet.id } } as never)}
              style={styles.actionButton}
            />
          )}
          <Button
            label="Reschedule"
            variant="outline"
            onPress={() => navigation.navigate('VetDetail', { vetId: vet.id })}
            style={styles.actionButton}
          />
          <Button
            label={cancelling ? 'Cancelling…' : 'Cancel appointment'}
            variant="secondary"
            onPress={handleCancel}
            loading={cancelling}
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
    marginBottom: spacing.lg,
  },
  vetName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
  },
  vetSpecialty: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
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
