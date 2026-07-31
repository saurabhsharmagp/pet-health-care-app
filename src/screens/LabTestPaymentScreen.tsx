import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import PaymentView from '../components/PaymentView';
import { labTestPackages } from '../data/mockData';
import { LabTestsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<LabTestsStackParamList, 'Payment'>;

export default function LabTestPaymentScreen({ route, navigation }: Props) {
  const { packageId, petId, date, time, address, amount } = route.params;
  const pkg = labTestPackages.find((p) => p.id === packageId)!;

  return (
    <ScreenContainer>
      <PaymentView
        title={pkg.name}
        subtitle={`${date} · ${time} · Home sample collection`}
        amount={amount}
        onPaySuccess={() =>
          navigation.replace('LabTestConfirmation', { packageId, petId, date, time, address })
        }
      />
    </ScreenContainer>
  );
}
