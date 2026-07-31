import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import Button from './Button';

type Method = 'card' | 'upi' | 'wallet';

type Props = {
  title: string;
  subtitle: string;
  amount: number;
  payLabel?: string;
  onPaySuccess: () => void;
};

const methods: { key: Method; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'card', label: 'Credit / Debit Card', icon: 'card-outline' },
  { key: 'upi', label: 'UPI', icon: 'phone-portrait-outline' },
  { key: 'wallet', label: 'Wallet', icon: 'wallet-outline' },
];

export default function PaymentView({ title, subtitle, amount, payLabel, onPaySuccess }: Props) {
  const [method, setMethod] = useState<Method>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    if (processing) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPaySuccess();
    }, 1100);
  };

  return (
    <View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{title}</Text>
        <Text style={styles.summarySubtitle}>{subtitle}</Text>
        <View style={styles.divider} />
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Amount to pay</Text>
          <Text style={styles.amountValue}>₹{amount.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Payment method</Text>
      <View style={styles.methodGroup}>
        {methods.map((m) => {
          const active = m.key === method;
          return (
            <TouchableOpacity
              key={m.key}
              style={[styles.methodRow, active && styles.methodRowActive]}
              onPress={() => setMethod(m.key)}
            >
              <Ionicons name={m.icon} size={20} color={active ? colors.primary : colors.textMuted} />
              <Text style={[styles.methodLabel, active && styles.methodLabelActive]}>{m.label}</Text>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {method === 'card' && (
        <View style={styles.fieldsBlock}>
          <TextInput
            style={styles.input}
            placeholder="Card number"
            placeholderTextColor={colors.textMuted}
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.rowInput]}
              placeholder="MM/YY"
              placeholderTextColor={colors.textMuted}
              value={expiry}
              onChangeText={setExpiry}
            />
            <TextInput
              style={[styles.input, styles.rowInput]}
              placeholder="CVV"
              placeholderTextColor={colors.textMuted}
              value={cvv}
              onChangeText={setCvv}
              secureTextEntry
              keyboardType="number-pad"
            />
          </View>
        </View>
      )}

      {method === 'upi' && (
        <View style={styles.fieldsBlock}>
          <TextInput
            style={styles.input}
            placeholder="yourname@upi"
            placeholderTextColor={colors.textMuted}
            value={upiId}
            onChangeText={setUpiId}
            autoCapitalize="none"
          />
        </View>
      )}

      {method === 'wallet' && (
        <View style={styles.walletCard}>
          <Ionicons name="wallet" size={20} color={colors.primary} />
          <Text style={styles.walletText}>Wallet balance: ₹5,000 available</Text>
        </View>
      )}

      <View style={styles.secureRow}>
        <Ionicons name="lock-closed" size={13} color={colors.textMuted} />
        <Text style={styles.secureText}>Payments are encrypted and secure</Text>
      </View>

      <Button
        label={processing ? 'Processing…' : (payLabel ?? `Pay ₹${amount.toLocaleString('en-IN')}`)}
        onPress={handlePay}
        loading={processing}
        style={styles.payButton}
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
    marginBottom: spacing.lg,
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  methodGroup: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  methodRowActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  methodLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  methodLabelActive: {
    color: colors.primary,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  fieldsBlock: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowInput: {
    flex: 1,
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  walletText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  secureText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  payButton: {},
});
