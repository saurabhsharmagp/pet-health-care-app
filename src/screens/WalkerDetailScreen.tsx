import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { getWalker, getWalkerSlots, SlotGroup, WalkerDirectoryEntry } from '../api/professionals';
import { walkerToCardView } from '../lib/viewModels';
import { WalkingStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<WalkingStackParamList, 'WalkerDetail'>;

export default function WalkerDetailScreen({ route, navigation }: Props) {
  const [walker, setWalker] = useState<WalkerDirectoryEntry | null>(null);
  const [slots, setSlots] = useState<SlotGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getWalker(route.params.walkerId), getWalkerSlots(route.params.walkerId)]).then(([w, s]) => {
      setWalker(w);
      setSlots(s);
      setLoading(false);
    });
  }, [route.params.walkerId]);

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  if (!walker) {
    return (
      <ScreenContainer>
        <Text>Walker not found.</Text>
      </ScreenContainer>
    );
  }

  const view = walkerToCardView(walker);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Avatar initial={view.initial} color={view.color} size={72} uri={view.photoUrl} />
        <Text style={styles.name}>{view.name}</Text>
        <Text style={styles.walkTypes}>{view.walkTypes.join(' · ')}</Text>
        <View style={styles.badgeRow}>
          <Badge label={`⭐ ${view.rating} (${view.reviewsCount})`} />
          <Badge label={view.priceLabel} tone="success" />
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color={colors.textMuted} />
          <Text style={styles.infoText}>{view.distanceKm} km away</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.bio}>{view.bio}</Text>

      <Text style={styles.sectionTitle}>Next available slots</Text>
      {slots.length === 0 ? (
        <Text style={styles.emptyText}>No upcoming slots — check back soon.</Text>
      ) : (
        slots.map((slot) => (
          <View key={slot.date} style={styles.slotRow}>
            <Text style={styles.slotDate}>{slot.date}</Text>
            <View style={styles.slotTimes}>
              {slot.times.map((time) => (
                <View key={time.id} style={styles.timePill}>
                  <Text style={styles.timeText}>{time.label}</Text>
                </View>
              ))}
            </View>
          </View>
        ))
      )}

      <Button
        label="Book a Walk"
        onPress={() => navigation.navigate('BookWalk', { walkerId: walker.id })}
        style={styles.bookButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
  },
  walkTypes: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 10,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bio: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  slotRow: {
    marginBottom: spacing.sm,
  },
  slotDate: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  slotTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  bookButton: {
    marginTop: spacing.lg,
  },
});
