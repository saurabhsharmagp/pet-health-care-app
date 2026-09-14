import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import Avatar from './Avatar';

type WalkerCardWalker = {
  initial: string;
  color: string;
  photoUrl?: string;
  name: string;
  walkTypes: string[];
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  priceLabel: string;
};

type Props = {
  walker: WalkerCardWalker;
  onPress: () => void;
};

export default function WalkerCard({ walker, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <Avatar initial={walker.initial} color={walker.color} size={56} uri={walker.photoUrl} />
      <View style={styles.info}>
        <Text style={styles.name}>{walker.name}</Text>
        <Text style={styles.walkTypes} numberOfLines={1}>{walker.walkTypes.join(' · ')}</Text>
        <Text style={styles.distance}>{walker.distanceKm} km away</Text>
        <View style={styles.metaRow}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.rating}>{walker.rating}</Text>
            <Text style={styles.reviews}>({walker.reviewsCount})</Text>
          </View>
          <Text style={styles.price}>{walker.priceLabel}</Text>
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
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  walkTypes: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  distance: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  reviews: {
    fontSize: 12,
    color: colors.textMuted,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
});
