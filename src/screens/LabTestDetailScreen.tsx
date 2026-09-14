import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { getLabTestPackage } from '../api/labTests';
import { LabTestPackage } from '../lib/database.types';
import { LabTestsStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<LabTestsStackParamList, 'LabTestDetail'>;

export default function LabTestDetailScreen({ route, navigation }: Props) {
  const [pkg, setPkg] = useState<LabTestPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLabTestPackage(route.params.packageId).then((data) => {
      setPkg(data);
      setLoading(false);
    });
  }, [route.params.packageId]);

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  if (!pkg) {
    return (
      <ScreenContainer>
        <Text>Test package not found.</Text>
      </ScreenContainer>
    );
  }

  const iconColor = pkg.color ?? colors.primary;
  const iconName = (pkg.icon ?? 'flask-outline') as keyof typeof Ionicons.glyphMap;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: iconColor + '22' }]}>
          <Ionicons name={iconName} size={36} color={iconColor} />
        </View>
        <Text style={styles.name}>{pkg.name}</Text>
        <Text style={styles.category}>{pkg.category}</Text>
        <View style={styles.badgeRow}>
          <Badge label={`₹${pkg.price.toLocaleString('en-IN')}`} tone="success" />
          {pkg.turnaround && <Badge label={pkg.turnaround} />}
          {pkg.fasting && <Badge label="Fasting required" tone="warning" />}
        </View>
      </View>

      <Text style={styles.sectionTitle}>About this test</Text>
      <Text style={styles.description}>{pkg.description}</Text>

      <Text style={styles.sectionTitle}>What's included</Text>
      <View style={styles.includedCard}>
        {pkg.included_tests.map((test) => (
          <View key={test} style={styles.includedRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            <Text style={styles.includedText}>{test}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="home-outline" size={18} color={colors.textMuted} />
        <Text style={styles.infoText}>Free home sample collection included</Text>
      </View>

      <Button
        label="Book Sample Collection"
        onPress={() => navigation.navigate('BookLabTest', { packageId: pkg.id })}
        style={styles.bookButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  category: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  includedCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 12,
    marginBottom: spacing.lg,
  },
  includedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  includedText: {
    fontSize: 14,
    color: colors.text,
    flexShrink: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    flexShrink: 1,
  },
  bookButton: {},
});
