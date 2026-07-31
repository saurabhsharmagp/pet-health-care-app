import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text } from 'react-native';
import LabTestCard from '../components/LabTestCard';
import ScreenContainer from '../components/ScreenContainer';
import { labTestPackages } from '../data/mockData';
import { LabTestsStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<LabTestsStackParamList, 'LabTestsMain'>;

export default function LabTestsListScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Lab Tests</Text>
      <Text style={styles.subtitle}>Book a home sample collection — results reviewed by a vet</Text>

      {labTestPackages.map((pkg) => (
        <LabTestCard
          key={pkg.id}
          labTest={pkg}
          onPress={() => navigation.navigate('LabTestDetail', { packageId: pkg.id })}
        />
      ))}
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
