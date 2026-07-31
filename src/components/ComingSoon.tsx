import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import Button from './Button';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  bullets: string[];
};

export default function ComingSoon({ icon, title, description, bullets }: Props) {
  const [joined, setJoined] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={40} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.bullets}>
        {bullets.map((b) => (
          <View key={b} style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            <Text style={styles.bulletText}>{b}</Text>
          </View>
        ))}
      </View>

      <Button
        label={joined ? "You're on the list!" : 'Notify me when it launches'}
        onPress={() => setJoined(true)}
        variant={joined ? 'outline' : 'primary'}
        disabled={joined}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: spacing.md,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: spacing.lg,
  },
  bullets: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bulletText: {
    fontSize: 14,
    color: colors.text,
    flexShrink: 1,
  },
  button: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
});
