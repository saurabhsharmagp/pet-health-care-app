import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { getWalkBooking } from '../api/bookings';
import { getPet } from '../api/pets';
import { getWalker, WalkerDirectoryEntry } from '../api/professionals';
import { Pet, WalkBooking } from '../lib/database.types';
import { formatDateLabel, formatTimeLabel } from '../lib/format';
import { walkerToCardView } from '../lib/viewModels';
import { WalkingStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<WalkingStackParamList, 'WalkConfirmation'>;

export default function WalkConfirmationScreen({ route, navigation }: Props) {
  const [walk, setWalk] = useState<WalkBooking | null>(null);
  const [walker, setWalker] = useState<WalkerDirectoryEntry | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const w = await getWalkBooking(route.params.walkId);
      if (!w) {
        setLoading(false);
        return;
      }
      const [walkerData, petData] = await Promise.all([getWalker(w.walker_id), getPet(w.pet_id)]);
      setWalk(w);
      setWalker(walkerData);
      setPet(petData);
      setLoading(false);
    })();
  }, [route.params.walkId]);

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  if (!walk || !walker || !pet) {
    return (
      <ScreenContainer>
        <Text>Walk not found.</Text>
      </ScreenContainer>
    );
  }

  const view = walkerToCardView(walker);

  return (
    <ScreenContainer>
      <View style={styles.iconWrap}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={40} color="#fff" />
        </View>
        <Text style={styles.title}>Walk Booked!</Text>
        <Text style={styles.subtitle}>{view.name} will pick up {pet.name} for the walk.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Avatar initial={view.initial} color={view.color} size={48} uri={view.photoUrl} />
          <View style={styles.info}>
            <Text style={styles.walkerName}>{view.name}</Text>
            <Text style={styles.walkerMeta}>{view.priceLabel}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <DetailRow icon="paw-outline" label="Pet" value={pet.name} />
        <DetailRow icon="calendar-outline" label="Date" value={formatDateLabel(walk.slot_at)} />
        <DetailRow icon="time-outline" label="Time" value={formatTimeLabel(walk.slot_at)} />
        <DetailRow icon="walk-outline" label="Service" value={walk.duration_label} />
        <DetailRow icon="location-outline" label="Address" value={walk.address} />
      </View>

      <Button label="View My Walks" onPress={() => navigation.popToTop()} style={styles.button} />
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
  iconWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: spacing.md,
  },
  walkerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  walkerMeta: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
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
    width: 70,
  },
  detailValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  button: {
    marginBottom: spacing.sm,
  },
});
