import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppointmentCard from '../components/AppointmentCard';
import ScreenContainer from '../components/ScreenContainer';
import { appointments, vets } from '../data/mockData';
import { AppointmentsStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<AppointmentsStackParamList, 'AppointmentsMain'>;

const tabs: { key: 'upcoming' | 'past'; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

export default function AppointmentsListScreen({ navigation }: Props) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const filtered = useMemo(() => {
    return appointments.filter((a) => (tab === 'upcoming' ? a.status === 'upcoming' : a.status !== 'upcoming'));
  }, [tab]);

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
          <Text style={styles.emptyText}>No {tab} appointments yet.</Text>
        </View>
      ) : (
        filtered.map((appointment) => {
          const vet = vets.find((v) => v.id === appointment.vetId)!;
          return (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              vet={vet}
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
