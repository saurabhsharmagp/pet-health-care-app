import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import PaymentView from '../components/PaymentView';
import { vets } from '../data/mockData';
import { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Payment'>;

export default function AppointmentPaymentScreen({ route, navigation }: Props) {
  const { vetId, petId, date, time, type, reason, amount } = route.params;
  const vet = vets.find((v) => v.id === vetId)!;

  return (
    <ScreenContainer>
      <PaymentView
        title={`Appointment with ${vet.name}`}
        subtitle={`${date} · ${time} · ${type === 'video' ? 'Video call' : 'In-clinic visit'}`}
        amount={amount}
        onPaySuccess={() =>
          navigation.replace('AppointmentConfirmation', { vetId, petId, date, time, type, reason })
        }
      />
    </ScreenContainer>
  );
}
