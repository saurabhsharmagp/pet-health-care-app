import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import Avatar from './Avatar';
import Badge from './Badge';

type WalkerJobWalk = {
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: string;
  date: string;
  time: string;
  address: string;
};

type WalkerJobPet = {
  initial: string;
  color: string;
  photoUrl?: string;
  name: string;
};

type WalkerJobOwner = {
  name: string;
};

type Props = {
  walk: WalkerJobWalk;
  pet: WalkerJobPet;
  owner: WalkerJobOwner;
  onPress: () => void;
};

const statusTone: Record<WalkerJobWalk['status'], 'success' | 'neutral' | 'danger'> = {
  upcoming: 'neutral',
  completed: 'success',
  cancelled: 'danger',
};

export default function WalkerJobCard({ walk, pet, owner, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.row}>
        <Avatar initial={pet.initial} color={pet.color} size={48} uri={pet.photoUrl} />
        <View style={styles.info}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.owner}>{owner.name} · {walk.duration}</Text>
        </View>
        <Badge label={walk.status} tone={statusTone[walk.status]} />
      </View>
      <View style={styles.divider} />
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={styles.footerText}>{walk.date} · {walk.time}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={styles.footerText} numberOfLines={1}>{walk.address}</Text>
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
    flexShrink: 1,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    flexShrink: 1,
  },
});
