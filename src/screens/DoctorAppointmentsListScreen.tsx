import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DoctorAppointmentCard from '../components/DoctorAppointmentCard';
import ScreenContainer from '../components/ScreenContainer';
import { DOCTOR_VET_ID, appointments, owners, pets } from '../data/mockData';
import { DoctorAppointmentsStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<DoctorAppointmentsStackParamList, 'AppointmentsMain'>;

const tabs: { key: 'upcoming' | 'past'; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

export default function DoctorAppointmentsListScreen({ navigation }: Props) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const doctorAppointments = useMemo(
    () => appointments.filter((a) => a.vetId === DOCTOR_VET_ID),
    []
  );

  const filtered = useMemo(
    () => doctorAppointments.filter((a) => (tab === 'upcoming' ? a.status === 'upcoming' : a.status !== 'upcoming')),
    [tab, doctorAppointments]
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>My Appointments</Text>

      <View style={styles.tabRow}>
        {tabs.map((t) => {
          const active = t.key === tab;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No {tab} appointments.</Text>
        </View>
      ) : (
        filtered.map((appointment) => {
          const pet = pets.find((p) => p.id === appointment.petId)!;
          const owner = owners.find((o) => o.id === pet.ownerId)!;
          return (
            <DoctorAppointmentCard
              key={appointment.id}
              appointment={appointment}
              pet={pet}
              owner={owner}
              onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: appointment.id })}
            />
          );
        })
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
