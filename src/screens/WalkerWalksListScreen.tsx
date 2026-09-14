import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WalkerJobCard from '../components/WalkerJobCard';
import ScreenContainer from '../components/ScreenContainer';
import { listWalkerBookings } from '../api/bookings';
import { getPet } from '../api/pets';
import { getProfile } from '../api/profiles';
import { useAuth } from '../lib/AuthContext';
import { Pet, Profile, WalkBooking } from '../lib/database.types';
import { walkBookingToCardView, petToCardView } from '../lib/viewModels';
import { WalkerWalksStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<WalkerWalksStackParamList, 'WalksMain'>;

type Row = { walk: WalkBooking; pet: Pet; owner: Profile };

const tabs: { key: 'upcoming' | 'past'; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

export default function WalkerWalksListScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let active = true;
      (async () => {
        const walks = await listWalkerBookings(profile.id);
        const built = await Promise.all(
          walks.map(async (walk) => {
            const pet = await getPet(walk.pet_id);
            if (!pet) return null;
            const owner = await getProfile(pet.owner_id);
            if (!owner) return null;
            return { walk, pet, owner };
          })
        );
        if (!active) return;
        setRows(built.filter((r): r is Row => r !== null));
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [profile])
  );

  const filtered = useMemo(
    () => rows.filter((r) => (tab === 'upcoming' ? r.walk.status === 'upcoming' : r.walk.status !== 'upcoming')),
    [tab, rows]
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>My Walks</Text>

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
          <Text style={styles.emptyText}>No {tab} walks.</Text>
        </View>
      ) : (
        filtered.map(({ walk, pet, owner }) => (
          <WalkerJobCard
            key={walk.id}
            walk={walkBookingToCardView(walk)}
            pet={petToCardView(pet)}
            owner={{ name: owner.name }}
            onPress={() => navigation.navigate('WalkDetail', { walkId: walk.id })}
          />
        ))
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
