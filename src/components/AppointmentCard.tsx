import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Appointment, Vet } from '../data/mockData';
import { colors, radius, spacing } from '../theme/colors';
import Avatar from './Avatar';
import Badge from './Badge';

type Props = {
  appointment: Appointment;
  vet: Vet;
  onPress: () => void;
};

const statusTone: Record<Appointment['status'], 'success' | 'neutral' | 'danger'> = {
  upcoming: 'neutral',
  completed: 'success',
  cancelled: 'danger',
};

export default function AppointmentCard({ appointment, vet, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.row}>
        <Avatar initial={vet.initial} color={vet.color} size={48} uri={vet.photoUrl} />
        <View style={styles.info}>
          <Text style={styles.name}>{vet.name}</Text>
          <Text style={styles.reason}>{appointment.reason}</Text>
        </View>
        <Badge label={appointment.status} tone={statusTone[appointment.status]} />
      </View>
      <View style={styles.divider} />
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={styles.footerText}>{appointment.date} · {appointment.time}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons
            name={appointment.type === 'video' ? 'videocam-outline' : 'location-outline'}
            size={14}
            color={colors.textMuted}
          />
          <Text style={styles.footerText}>{appointment.type === 'video' ? 'Video call' : 'In-clinic'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  reason: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
