import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import WalkCard from '../components/WalkCard';
import { listMyWalkBookings } from '../api/bookings';
import { listWalkers, WalkerDirectoryEntry } from '../api/professionals';
import { useAuth } from '../lib/AuthContext';
import { WalkBooking } from '../lib/database.types';
import { walkBookingToCardView, walkerToCardView } from '../lib/viewModels';
import { WalkingStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<WalkingStackParamList, 'WalkingMain'>;

const tabs: { key: 'upcoming' | 'past'; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

export default function WalkingMainScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [walkBookings, setWalkBookings] = useState<WalkBooking[]>([]);
  const [walkers, setWalkers] = useState<WalkerDirectoryEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let active = true;
      (async () => {
        const [bookings, walkerList] = await Promise.all([listMyWalkBookings(profile.id), listWalkers()]);
        if (!active) return;
        setWalkBookings(bookings);
        setWalkers(walkerList);
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [profile])
  );

  const filtered = useMemo(
    () => walkBookings.filter((w) => (tab === 'upcoming' ? w.status === 'upcoming' : w.status !== 'upcoming')),
    [tab, walkBookings]
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>Dog Walking</Text>
      <Text style={styles.subtitle}>Book trusted, background-checked walkers near you</Text>

      <Button
        label="Find a Walker"
        onPress={() => navigation.navigate('WalkerList')}
        style={styles.findButton}
      />

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>My Walks</Text>
      </View>

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
          <Ionicons name="paw-outline" size={28} color={colors.textMuted} />
          <Text style={styles.emptyText}>No {tab} walks yet.</Text>
        </View>
      ) : (
        filtered.map((walk) => {
          const walker = walkers.find((w) => w.id === walk.walker_id);
          if (!walker) return null;
          return (
            <WalkCard
              key={walk.id}
              walk={walkBookingToCardView(walk)}
              walker={walkerToCardView(walker)}
              onPress={() => navigation.navigate('WalkDetail', { walkId: walk.id })}
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
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  findButton: {
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
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
    paddingTop: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
