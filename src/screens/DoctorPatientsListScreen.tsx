import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import PatientCard from '../components/PatientCard';
import ScreenContainer from '../components/ScreenContainer';
import { listVetAppointments } from '../api/bookings';
import { getPet } from '../api/pets';
import { getProfile } from '../api/profiles';
import { useAuth } from '../lib/AuthContext';
import { Pet, Profile } from '../lib/database.types';
import { formatDateLabel } from '../lib/format';
import { petToCardView } from '../lib/viewModels';
import { DoctorPatientsStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<DoctorPatientsStackParamList, 'PatientsMain'>;

type PatientRow = { pet: Pet; owner: Profile; lastVisit: string | undefined };

export default function DoctorPatientsListScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<PatientRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let active = true;
      (async () => {
        const appointments = await listVetAppointments(profile.id);
        const petIds = Array.from(new Set(appointments.map((a) => a.pet_id)));
        const rows = await Promise.all(
          petIds.map(async (petId) => {
            const pet = await getPet(petId);
            if (!pet) return null;
            const owner = await getProfile(pet.owner_id);
            if (!owner) return null;
            const petAppointments = appointments
              .filter((a) => a.pet_id === petId)
              .sort((a, b) => a.slot_at.localeCompare(b.slot_at));
            const lastVisit = petAppointments[petAppointments.length - 1]
              ? formatDateLabel(petAppointments[petAppointments.length - 1].slot_at)
              : undefined;
            return { pet, owner, lastVisit };
          })
        );
        if (!active) return;
        setPatients(rows.filter((r): r is PatientRow => r !== null));
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [profile])
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>My Patients</Text>
      <Text style={styles.subtitle}>{patients.length} patients under your care</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        patients.map(({ pet, owner, lastVisit }) => (
          <PatientCard
            key={pet.id}
            pet={petToCardView(pet)}
            owner={{ name: owner.name }}
            lastVisit={lastVisit}
            onPress={() => navigation.navigate('PatientDetail', { petId: pet.id })}
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
