import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import PatientCard from '../components/PatientCard';
import ScreenContainer from '../components/ScreenContainer';
import { listWalkerBookings } from '../api/bookings';
import { getPet } from '../api/pets';
import { getProfile } from '../api/profiles';
import { useAuth } from '../lib/AuthContext';
import { Pet, Profile } from '../lib/database.types';
import { formatDateLabel } from '../lib/format';
import { petToCardView } from '../lib/viewModels';
import { WalkerClientsStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<WalkerClientsStackParamList, 'ClientsMain'>;

type ClientRow = { pet: Pet; owner: Profile; lastWalk: string | undefined };

export default function WalkerClientsListScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let active = true;
      (async () => {
        const walks = await listWalkerBookings(profile.id);
        const petIds = Array.from(new Set(walks.map((w) => w.pet_id)));
        const rows = await Promise.all(
          petIds.map(async (petId) => {
            const pet = await getPet(petId);
            if (!pet) return null;
            const owner = await getProfile(pet.owner_id);
            if (!owner) return null;
            const petWalks = walks.filter((w) => w.pet_id === petId).sort((a, b) => a.slot_at.localeCompare(b.slot_at));
            const lastWalk = petWalks[petWalks.length - 1]
              ? formatDateLabel(petWalks[petWalks.length - 1].slot_at)
              : undefined;
            return { pet, owner, lastWalk };
          })
        );
        if (!active) return;
        setClients(rows.filter((r): r is ClientRow => r !== null));
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [profile])
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>My Clients</Text>
      <Text style={styles.subtitle}>{clients.length} pets under your care</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        clients.map(({ pet, owner, lastWalk }) => (
          <PatientCard
            key={pet.id}
            pet={petToCardView(pet)}
            owner={{ name: owner.name }}
            lastVisit={lastWalk}
            onPress={() => navigation.navigate('ClientDetail', { petId: pet.id })}
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
});
