import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import DoctorAppointmentCard from '../components/DoctorAppointmentCard';
import RevenueBarChart from '../components/RevenueBarChart';
import StatTile from '../components/StatTile';
import { DOCTOR_VET_ID, appointments, doctorRevenue, owners, pets, vets } from '../data/mockData';
import { DoctorDashboardStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<DoctorDashboardStackParamList, 'DashboardMain'>;

export default function DoctorDashboardScreen({ navigation }: Props) {
  const doctor = vets.find((v) => v.id === DOCTOR_VET_ID)!;
  const doctorAppointments = appointments.filter((a) => a.vetId === DOCTOR_VET_ID);
  const upcoming = doctorAppointments.filter((a) => a.status === 'upcoming');
  const uniquePatients = new Set(doctorAppointments.map((a) => a.petId));

  const currentMonth = doctorRevenue[doctorRevenue.length - 1];
  const previousMonth = doctorRevenue[doctorRevenue.length - 2];
  const changePct = Math.round(((currentMonth.amount - previousMonth.amount) / previousMonth.amount) * 100);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {doctor.name} 👋</Text>
            <Text style={styles.subGreeting}>{doctor.specialty}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar initial={doctor.initial} color={doctor.color} size={44} uri={doctor.photoUrl} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatTile icon="people-outline" label="Patients" value={String(uniquePatients.size)} />
          <StatTile icon="calendar-outline" label="Upcoming" value={String(upcoming.length)} color={colors.accent} />
          <StatTile icon="checkmark-done-outline" label="This month" value={String(currentMonth.appointments)} color={colors.success} />
        </View>

        <View style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <View>
              <Text style={styles.revenueLabel}>Revenue this month</Text>
              <Text style={styles.revenueValue}>₹{currentMonth.amount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={[styles.changeBadge, changePct >= 0 ? styles.changeUp : styles.changeDown]}>
              <Ionicons name={changePct >= 0 ? 'trending-up' : 'trending-down'} size={14} color={changePct >= 0 ? colors.success : colors.danger} />
              <Text style={[styles.changeText, { color: changePct >= 0 ? colors.success : colors.danger }]}>
                {Math.abs(changePct)}%
              </Text>
            </View>
          </View>
          <RevenueBarChart data={doctorRevenue} />
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Upcoming appointments</Text>
          <TouchableOpacity onPress={() => navigation.getParent()?.navigate('Appointments' as never)}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {upcoming.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming appointments.</Text>
        ) : (
          upcoming.slice(0, 3).map((appointment) => {
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
  },
  subGreeting: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  revenueCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  revenueLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  revenueValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  changeUp: {
    backgroundColor: colors.successLight,
  },
  changeDown: {
    backgroundColor: colors.dangerLight,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
