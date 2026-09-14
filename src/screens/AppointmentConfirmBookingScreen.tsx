import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ConfirmBookingView from '../components/ConfirmBookingView';
import { createAppointment } from '../api/bookings';
import { getVet, VetDirectoryEntry } from '../api/professionals';
import { useAuth } from '../lib/AuthContext';
import { formatDateLabel, formatTimeLabel } from '../lib/format';
import { HomeStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'ConfirmBooking'>;

export default function AppointmentConfirmBookingScreen({ route, navigation }: Props) {
  const { profile } = useAuth();
  const { vetId, petId, slotId, slotAt, type, reason, amount } = route.params;
  const [vet, setVet] = useState<VetDirectoryEntry | null>(null);

  useEffect(() => {
    getVet(vetId).then(setVet);
  }, [vetId]);

  if (!vet) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  const handleConfirm = async () => {
    if (!profile) return;
    const appointment = await createAppointment({
      vetId,
      petId,
      ownerId: profile.id,
      slotId,
      slotAt,
      reason,
      type,
    });
    navigation.replace('AppointmentConfirmation', { appointmentId: appointment.id });
  };

  return (
    <ScreenContainer>
      <ConfirmBookingView
        title={`Appointment with ${vet.name}`}
        subtitle={`${formatDateLabel(slotAt)} · ${formatTimeLabel(slotAt)} · ${
          type === 'video' ? 'Video call' : 'In-clinic visit'
        }`}
        amount={amount}
        onConfirm={handleConfirm}
      />
    </ScreenContainer>
  );
}
