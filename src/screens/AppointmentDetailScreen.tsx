import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { appointments, pets, vets } from '../data/mockData';
import { AppointmentsStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<AppointmentsStackParamList, 'AppointmentDetail'>;

export default function AppointmentDetailScreen({ route, navigation }: Props) {
  const appointment = appointments.find((a) => a.id === route.params.appointmentId)!;
  const vet = vets.find((v) => v.id === appointment.vetId)!;
  const pet = pets.find((p) => p.id === appointment.petId)!;
  const [cancelled, setCancelled] = useState(false);

  const status = cancelled ? 'cancelled' : appointment.status;

  const handleCancel = () => {
    setCancelled(true);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Avatar initial={vet.initial} color={vet.color} size={64} uri={vet.photoUrl} />
        <Text style={styles.vetName}>{vet.name}</Text>
        <Text style={styles.vetSpecialty}>{vet.specialty}</Text>
        <Badge
          label={status}
          tone={status === 'completed' ? 'success' : status === 'cancelled' ? 'danger' : 'neutral'}
        />
      </View>

      <View style={styles.card}>
        <DetailRow icon="paw-outline" label="Pet" value={`${pet.name} (${pet.breed})`} />
        <DetailRow icon="calendar-outline" label="Date" value={appointment.date} />
        <DetailRow icon="time-outline" label="Time" value={appointment.time} />
        <DetailRow
          icon={appointment.type === 'video' ? 'videocam-outline' : 'location-outline'}
          label="Type"
          value={appointment.type === 'video' ? 'Video call' : `In-clinic · ${vet.clinic}`}
        />
        <DetailRow icon="document-text-outline" label="Reason" value={appointment.reason} />
      </View>

      {status === 'upcoming' && (
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
          <Button label="Cancel appointment" variant="secondary" onPress={handleCancel} style={styles.actionButton} />
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
