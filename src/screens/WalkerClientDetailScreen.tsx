import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { listWalkerBookings } from '../api/bookings';
import { getOrCreateThread } from '../api/chat';
import { getPet } from '../api/pets';
import { getProfile } from '../api/profiles';
import { useAuth } from '../lib/AuthContext';
import { Pet, Profile, WalkBooking } from '../lib/database.types';
import { formatDateLabel, formatTimeLabel } from '../lib/format';
import { petToCardView } from '../lib/viewModels';
import { WalkerClientsStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<WalkerClientsStackParamList, 'ClientDetail'>;

const statusTone: Record<string, 'success' | 'neutral' | 'danger'> = {
  upcoming: 'neutral',
  completed: 'success',
  cancelled: 'danger',
};

export default function WalkerClientDetailScreen({ route, navigation }: Props) {
  const { profile } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [walks, setWalks] = useState<WalkBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [messaging, setMessaging] = useState(false);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const p = await getPet(route.params.petId);
      if (!p) {
        setLoading(false);
        return;
      }
      const [o, allWalks] = await Promise.all([getProfile(p.owner_id), listWalkerBookings(profile.id)]);
      setPet(p);
      setOwner(o);
      setWalks(allWalks.filter((w) => w.pet_id === p.id).sort((a, b) => b.slot_at.localeCompare(a.slot_at)));
      setLoading(false);
    })();
  }, [route.params.petId, profile]);

  const handleMessageOwner = async () => {
    if (!profile || !pet || !owner || messaging) return;
    setMessaging(true);
    const thread = await getOrCreateThread(owner.id, profile.id, pet.id);
    setMessaging(false);
    navigation.getParent()?.navigate('Messages', { screen: 'Chat', params: { threadId: thread.id } } as never);
  };

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  if (!pet || !owner) {
    return (
      <ScreenContainer>
        <Text>Client not found.</Text>
      </ScreenContainer>
    );
  }

  const view = petToCardView(pet);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Avatar initial={view.initial} color={view.color} size={76} uri={view.photoUrl} />
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.meta}>
          {pet.species} · {pet.breed ?? '—'} · {pet.age ?? '—'} · {pet.weight_kg ?? '—'} kg
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Owner</Text>
      <View style={styles.ownerCard}>
        <View style={styles.ownerRow}>
          <Ionicons name="person-outline" size={18} color={colors.textMuted} />
          <Text style={styles.ownerText}>{owner.name}</Text>
        </View>
        {owner.phone && (
          <View style={styles.ownerRow}>
            <Ionicons name="call-outline" size={18} color={colors.textMuted} />
            <Text style={styles.ownerText}>{owner.phone}</Text>
          </View>
        )}
        <View style={styles.ownerRow}>
          <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
          <Text style={styles.ownerText}>{owner.email}</Text>
        </View>
      </View>

      <Button
        label="Message Owner"
        variant="outline"
        onPress={handleMessageOwner}
        loading={messaging}
        style={styles.messageButton}
      />

      <Text style={styles.sectionTitle}>Walk history</Text>
      {walks.length === 0 ? (
        <Text style={styles.emptyText}>No walks recorded yet.</Text>
      ) : (
        walks.map((walk) => (
          <View key={walk.id} style={styles.visitCard}>
            <View style={styles.visitRow}>
              <Text style={styles.visitReason}>{walk.duration_label}</Text>
              <Badge label={walk.status} tone={statusTone[walk.status]} />
            </View>
            <Text style={styles.visitDate}>
              {formatDateLabel(walk.slot_at)} · {formatTimeLabel(walk.slot_at)}
            </Text>
          </View>
        ))
      )}
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
  meta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  ownerCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 10,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ownerText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  messageButton: {
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  visitCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  visitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  visitReason: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  visitDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
