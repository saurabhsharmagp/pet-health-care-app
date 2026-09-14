import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import Avatar from './Avatar';
import Badge from './Badge';

type DoctorCardAppointment = {
  status: 'upcoming' | 'completed' | 'cancelled';
  reason: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
};

type DoctorCardPet = {
  initial: string;
  color: string;
  photoUrl?: string;
  name: string;
};

type DoctorCardOwner = {
  name: string;
};

type Props = {
  appointment: DoctorCardAppointment;
  pet: DoctorCardPet;
  owner: DoctorCardOwner;
  onPress: () => void;
};

const statusTone: Record<DoctorCardAppointment['status'], 'success' | 'neutral' | 'danger'> = {
  upcoming: 'neutral',
  completed: 'success',
  cancelled: 'danger',
};

export default function DoctorAppointmentCard({ appointment, pet, owner, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.row}>
        <Avatar initial={pet.initial} color={pet.color} size={48} uri={pet.photoUrl} />
        <View style={styles.info}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.owner}>{owner.name} · {appointment.reason}</Text>
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
  owner: {
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
