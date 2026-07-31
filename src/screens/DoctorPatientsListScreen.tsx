import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text } from 'react-native';
import PatientCard from '../components/PatientCard';
import ScreenContainer from '../components/ScreenContainer';
import { DOCTOR_VET_ID, appointments, owners, pets } from '../data/mockData';
import { DoctorPatientsStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<DoctorPatientsStackParamList, 'PatientsMain'>;

export default function DoctorPatientsListScreen({ navigation }: Props) {
  const doctorAppointments = appointments.filter((a) => a.vetId === DOCTOR_VET_ID);
  const patientIds = Array.from(new Set(doctorAppointments.map((a) => a.petId)));

  return (
    <ScreenContainer>
      <Text style={styles.title}>My Patients</Text>
      <Text style={styles.subtitle}>{patientIds.length} patients under your care</Text>

      {patientIds.map((petId) => {
        const pet = pets.find((p) => p.id === petId)!;
        const owner = owners.find((o) => o.id === pet.ownerId)!;
        const petAppointments = doctorAppointments.filter((a) => a.petId === petId);
        const lastVisit = petAppointments[petAppointments.length - 1]?.date;
        return (
          <PatientCard
            key={petId}
            pet={pet}
            owner={owner}
            lastVisit={lastVisit}
            onPress={() => navigation.navigate('PatientDetail', { petId })}
          />
        );
      })}
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
