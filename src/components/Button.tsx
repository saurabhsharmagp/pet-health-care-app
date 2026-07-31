import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export default function Button({ label, onPress, variant = 'primary', disabled, loading, style }: Props) {
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        isOutline && styles.outline,
        isSecondary && styles.secondary,
        !isOutline && !isSecondary && styles.primary,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : '#fff'} />
      ) : (
        <Text style={[styles.label, isOutline && styles.outlineLabel]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  outlineLabel: {
    color: colors.primary,
  },
});
