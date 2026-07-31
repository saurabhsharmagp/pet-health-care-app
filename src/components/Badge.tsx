import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme/colors';

type Tone = 'success' | 'warning' | 'danger' | 'neutral';

const toneMap: Record<Tone, { bg: string; fg: string }> = {
  success: { bg: colors.successLight, fg: colors.success },
  warning: { bg: colors.warningLight, fg: colors.warning },
  danger: { bg: colors.dangerLight, fg: colors.danger },
  neutral: { bg: colors.primaryLight, fg: colors.primary },
};

export default function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const { bg, fg } = toneMap[tone];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
