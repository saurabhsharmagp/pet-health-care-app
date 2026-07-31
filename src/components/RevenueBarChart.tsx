import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

type Props = {
  data: { month: string; amount: number }[];
};

const BAR_MAX_HEIGHT = 100;

export default function RevenueBarChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.amount));

  return (
    <View style={styles.container}>
      {data.map((d, idx) => {
        const isLast = idx === data.length - 1;
        const height = Math.max(8, (d.amount / max) * BAR_MAX_HEIGHT);
        return (
          <View key={d.month} style={styles.barColumn}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.bar,
                  { height, backgroundColor: isLast ? colors.primary : colors.primaryLight },
                ]}
              />
            </View>
            <Text style={[styles.monthLabel, isLast && styles.monthLabelActive]}>{d.month}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: BAR_MAX_HEIGHT,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    borderRadius: radius.sm,
  },
  monthLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
    fontWeight: '600',
  },
  monthLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});
