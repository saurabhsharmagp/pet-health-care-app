import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppointmentCard from '../components/AppointmentCard';
import ScreenContainer from '../components/ScreenContainer';
import { listMyAppointments } from '../api/bookings';
import { listVets, VetDirectoryEntry } from '../api/professionals';
import { useAuth } from '../lib/AuthContext';
import { Appointment } from '../lib/database.types';
import { appointmentToCardView, vetToCardView } from '../lib/viewModels';
import { AppointmentsStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<AppointmentsStackParamList, 'AppointmentsMain'>;

const tabs: { key: 'upcoming' | 'past'; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

export default function AppointmentsListScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vets, setVets] = useState<VetDirectoryEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let active = true;
      (async () => {
        const [myAppointments, vetList] = await Promise.all([listMyAppointments(profile.id), listVets()]);
        if (!active) return;
        setAppointments(myAppointments);
        setVets(vetList);
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [profile])
  );

  const filtered = useMemo(() => {
    return appointments.filter((a) => (tab === 'upcoming' ? a.status === 'upcoming' : a.status !== 'upcoming'));
  }, [tab, appointments]);

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

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No {tab} appointments yet.</Text>
        </View>
      ) : (
        filtered.map((appointment) => {
          const vet = vets.find((v) => v.id === appointment.vet_id);
          if (!vet) return null;
          return (
            <AppointmentCard
              key={appointment.id}
              appointment={appointmentToCardView(appointment)}
              vet={vetToCardView(vet)}
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
