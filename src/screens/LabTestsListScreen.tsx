import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import LabTestCard from '../components/LabTestCard';
import ScreenContainer from '../components/ScreenContainer';
import { listLabTestPackages } from '../api/labTests';
import { LabTestPackage } from '../lib/database.types';
import { LabTestsStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<LabTestsStackParamList, 'LabTestsMain'>;

export default function LabTestsListScreen({ navigation }: Props) {
  const [packages, setPackages] = useState<LabTestPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listLabTestPackages().then((data) => {
      setPackages(data);
      setLoading(false);
    });
  }, []);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Lab Tests</Text>
      <Text style={styles.subtitle}>Book a home sample collection — results reviewed by a vet</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        packages.map((pkg) => (
          <LabTestCard
            key={pkg.id}
            labTest={pkg}
            onPress={() => navigation.navigate('LabTestDetail', { packageId: pkg.id })}
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
