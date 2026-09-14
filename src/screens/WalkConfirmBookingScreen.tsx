import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ConfirmBookingView from '../components/ConfirmBookingView';
import { createWalkBooking } from '../api/bookings';
import { getWalker, WalkerDirectoryEntry } from '../api/professionals';
import { useAuth } from '../lib/AuthContext';
import { formatDateLabel, formatTimeLabel } from '../lib/format';
import { WalkingStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<WalkingStackParamList, 'ConfirmBooking'>;

export default function WalkConfirmBookingScreen({ route, navigation }: Props) {
  const { profile } = useAuth();
  const { walkerId, petId, slotId, slotAt, durationLabel, address, amount } = route.params;
  const [walker, setWalker] = useState<WalkerDirectoryEntry | null>(null);

  useEffect(() => {
    getWalker(walkerId).then(setWalker);
  }, [walkerId]);

  if (!walker) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  const handleConfirm = async () => {
    if (!profile) return;
    const walk = await createWalkBooking({
      walkerId,
      petId,
      ownerId: profile.id,
      slotId,
      slotAt,
      durationLabel,
      address,
    });
    navigation.replace('WalkConfirmation', { walkId: walk.id });
  };

  return (
    <ScreenContainer>
      <ConfirmBookingView
        title={`Walk with ${walker.name}`}
        subtitle={`${formatDateLabel(slotAt)} · ${formatTimeLabel(slotAt)} · ${durationLabel}`}
        amount={amount}
        onConfirm={handleConfirm}
      />
    </ScreenContainer>
  );
}
