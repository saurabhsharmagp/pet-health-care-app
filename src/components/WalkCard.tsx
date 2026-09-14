import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import Avatar from './Avatar';
import Badge from './Badge';

type WalkCardWalk = {
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: string;
  date: string;
  time: string;
  address: string;
};

type WalkCardWalker = {
  initial: string;
  color: string;
  photoUrl?: string;
  name: string;
};

type Props = {
  walk: WalkCardWalk;
  walker: WalkCardWalker;
  onPress: () => void;
};

const statusTone: Record<WalkCardWalk['status'], 'success' | 'neutral' | 'danger'> = {
  upcoming: 'neutral',
  completed: 'success',
  cancelled: 'danger',
};

export default function WalkCard({ walk, walker, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.row}>
        <Avatar initial={walker.initial} color={walker.color} size={48} uri={walker.photoUrl} />
        <View style={styles.info}>
          <Text style={styles.name}>{walker.name}</Text>
          <Text style={styles.reason}>{walk.duration}</Text>
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
    flexShrink: 1,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    flexShrink: 1,
  },
});
