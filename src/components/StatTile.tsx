import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color?: string;
};

export default function StatTile({ icon, label, value, color = colors.primary }: Props) {
  return (
    <View style={styles.tile}>
      <View style={[styles.iconCircle, { backgroundColor: color + '1F' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
