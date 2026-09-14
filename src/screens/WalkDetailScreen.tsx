import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { getWalkBooking, updateWalkBookingStatus } from '../api/bookings';
import { getPet } from '../api/pets';
import { getWalker, WalkerDirectoryEntry } from '../api/professionals';
import { Pet, WalkBooking } from '../lib/database.types';
import { formatDateLabel, formatTimeLabel } from '../lib/format';
import { walkerToCardView } from '../lib/viewModels';
import { WalkingStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<WalkingStackParamList, 'WalkDetail'>;

export default function WalkDetailScreen({ route, navigation }: Props) {
  const [walk, setWalk] = useState<WalkBooking | null>(null);
  const [walker, setWalker] = useState<WalkerDirectoryEntry | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

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

  const handleCancel = async () => {
    if (!walk || cancelling) return;
    setCancelling(true);
    await updateWalkBookingStatus(walk.id, 'cancelled');
    setWalk({ ...walk, status: 'cancelled' });
    setCancelling(false);
  };

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
      <View style={styles.header}>
        <Avatar initial={view.initial} color={view.color} size={64} uri={view.photoUrl} />
        <Text style={styles.walkerName}>{view.name}</Text>
        <Text style={styles.walkerMeta}>{view.priceLabel}</Text>
        <Badge
          label={walk.status}
          tone={walk.status === 'completed' ? 'success' : walk.status === 'cancelled' ? 'danger' : 'neutral'}
        />
      </View>

      <View style={styles.card}>
        <DetailRow icon="paw-outline" label="Pet" value={`${pet.name} (${pet.breed ?? ''})`} />
        <DetailRow icon="calendar-outline" label="Date" value={formatDateLabel(walk.slot_at)} />
        <DetailRow icon="time-outline" label="Time" value={formatTimeLabel(walk.slot_at)} />
        <DetailRow icon="walk-outline" label="Service" value={walk.duration_label} />
        <DetailRow icon="location-outline" label="Address" value={walk.address} />
      </View>

      {walk.status === 'upcoming' && (
        <View style={styles.actions}>
          <Button
            label="Book Another Walker"
            variant="outline"
            onPress={() => navigation.navigate('WalkerList')}
            style={styles.actionButton}
          />
          <Button
            label={cancelling ? 'Cancelling…' : 'Cancel walk'}
            variant="secondary"
            onPress={handleCancel}
            loading={cancelling}
            style={styles.actionButton}
          />
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
  walkerName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
  },
  walkerMeta: {
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
