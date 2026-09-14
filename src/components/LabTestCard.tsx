import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

type LabTestCardPackage = {
  name: string;
  category: string;
  turnaround: string | null;
  price: number;
  icon: string | null;
  color: string | null;
};

type Props = {
  labTest: LabTestCardPackage;
  onPress: () => void;
};

export default function LabTestCard({ labTest, onPress }: Props) {
  const iconColor = labTest.color ?? colors.primary;
  const iconName = (labTest.icon ?? 'flask-outline') as keyof typeof Ionicons.glyphMap;
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: iconColor + '22' }]}>
        <Ionicons name={iconName} size={26} color={iconColor} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{labTest.name}</Text>
        <Text style={styles.category}>{labTest.category}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>{labTest.turnaround}</Text>
          </View>
          <Text style={styles.price}>₹{labTest.price.toLocaleString('en-IN')}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  category: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
});
