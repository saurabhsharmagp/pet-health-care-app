import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ConfirmBookingView from '../components/ConfirmBookingView';
import { createLabTestBooking } from '../api/bookings';
import { getLabTestPackage } from '../api/labTests';
import { useAuth } from '../lib/AuthContext';
import { formatDateLabel, formatTimeLabel } from '../lib/format';
import { LabTestPackage } from '../lib/database.types';
import { LabTestsStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<LabTestsStackParamList, 'ConfirmBooking'>;

export default function LabTestConfirmBookingScreen({ route, navigation }: Props) {
  const { profile } = useAuth();
  const { packageId, petId, slotAt, address, amount } = route.params;
  const [pkg, setPkg] = useState<LabTestPackage | null>(null);

  useEffect(() => {
    getLabTestPackage(packageId).then(setPkg);
  }, [packageId]);

  if (!pkg) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  const handleConfirm = async () => {
    if (!profile) return;
    const booking = await createLabTestBooking({
      packageId,
      petId,
      ownerId: profile.id,
      slotAt,
      address,
    });
    navigation.replace('LabTestConfirmation', { bookingId: booking.id });
  };

  return (
    <ScreenContainer>
      <ConfirmBookingView
        title={pkg.name}
        subtitle={`${formatDateLabel(slotAt)} · ${formatTimeLabel(slotAt)} · Home sample collection`}
        amount={amount}
        onConfirm={handleConfirm}
      />
    </ScreenContainer>
  );
}
