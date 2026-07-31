import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import PaymentView from '../components/PaymentView';
import { vets } from '../data/mockData';
import { ConsultStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<ConsultStackParamList, 'Payment'>;

export default function ConsultPaymentScreen({ route, navigation }: Props) {
  const { vetId, mode, amount } = route.params;
  const vet = vets.find((v) => v.id === vetId)!;

  return (
    <ScreenContainer>
      <PaymentView
        title={mode === 'video' ? 'Video Consultation' : 'Chat Consultation'}
        subtitle={`With ${vet.name} · ${vet.specialty}`}
        amount={amount}
        onPaySuccess={() =>
          navigation.replace(mode === 'video' ? 'VideoCall' : 'Chat', { vetId })
        }
      />
    </ScreenContainer>
  );
}
