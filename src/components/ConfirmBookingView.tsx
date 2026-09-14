import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import Button from './Button';

type Props = {
  title: string;
  subtitle: string;
  amount: number;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
};

export default function ConfirmBookingView({ title, subtitle, amount, confirmLabel, onConfirm }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{title}</Text>
        <Text style={styles.summarySubtitle}>{subtitle}</Text>
        <View style={styles.divider} />
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Estimated cost</Text>
          <Text style={styles.amountValue}>₹{amount.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      <View style={styles.noticeRow}>
        <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
        <Text style={styles.noticeText}>
          Payment isn't required yet — you'll settle up at the visit. Online payment is coming soon.
        </Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        label={submitting ? 'Booking…' : (confirmLabel ?? 'Confirm Booking')}
        onPress={handleConfirm}
        loading={submitting}
        style={styles.confirmButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  summarySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 22,
    color: colors.text,
    fontWeight: '800',
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: spacing.lg,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  errorText: {
    fontSize: 13,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  confirmButton: {},
});
