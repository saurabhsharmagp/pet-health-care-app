import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import StatTile from '../components/StatTile';
import WalkerJobCard from '../components/WalkerJobCard';
import { listWalkerBookings } from '../api/bookings';
import { getPet } from '../api/pets';
import { getProfile } from '../api/profiles';
import { useAuth } from '../lib/AuthContext';
import { Pet, Profile, WalkBooking } from '../lib/database.types';
import { walkBookingToCardView, petToCardView } from '../lib/viewModels';
import { WalkerDashboardStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<WalkerDashboardStackParamList, 'DashboardMain'>;

type UpcomingRow = { walk: WalkBooking; pet: Pet; owner: Profile };

export default function WalkerDashboardScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [walks, setWalks] = useState<WalkBooking[]>([]);
  const [upcomingRows, setUpcomingRows] = useState<UpcomingRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let active = true;
      (async () => {
        const all = await listWalkerBookings(profile.id);
        if (!active) return;
        setWalks(all);

        const upcoming = all.filter((w) => w.status === 'upcoming').slice(0, 3);
        const rows = await Promise.all(
          upcoming.map(async (walk) => {
            const pet = await getPet(walk.pet_id);
            if (!pet) return null;
            const owner = await getProfile(pet.owner_id);
            if (!owner) return null;
            return { walk, pet, owner };
          })
        );
        if (!active) return;
        setUpcomingRows(rows.filter((r): r is UpcomingRow => r !== null));
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [profile])
  );

  if (!profile) return null;

  const upcomingCount = walks.filter((w) => w.status === 'upcoming').length;
  const uniqueClients = new Set(walks.map((w) => w.pet_id));
  const now = new Date();
  const thisMonthCount = walks.filter((w) => {
    const d = new Date(w.slot_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {profile.name} 👋</Text>
            <Text style={styles.subGreeting}>Your walks at a glance</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar initial={profile.name.charAt(0).toUpperCase()} color={colors.primary} size={44} uri={profile.avatar_url ?? undefined} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            <View style={styles.statsRow}>
              <StatTile icon="people-outline" label="Clients" value={String(uniqueClients.size)} />
              <StatTile icon="calendar-outline" label="Upcoming" value={String(upcomingCount)} color={colors.accent} />
              <StatTile icon="checkmark-done-outline" label="This month" value={String(thisMonthCount)} color={colors.success} />
            </View>

            <View style={styles.noticeCard}>
              <Ionicons name="cash-outline" size={18} color={colors.textMuted} />
              <Text style={styles.noticeText}>
                Earnings tracking will appear here once online payments are enabled.
              </Text>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Upcoming walks</Text>
              <TouchableOpacity onPress={() => navigation.getParent()?.navigate('Walks' as never)}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>

            {upcomingRows.length === 0 ? (
              <Text style={styles.emptyText}>No upcoming walks.</Text>
            ) : (
              upcomingRows.map(({ walk, pet, owner }) => (
                <WalkerJobCard
                  key={walk.id}
                  walk={walkBookingToCardView(walk)}
                  pet={petToCardView(pet)}
                  owner={{ name: owner.name }}
                  onPress={() => navigation.navigate('WalkDetail', { walkId: walk.id })}
                />
              ))
            )}
          </>
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
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
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
