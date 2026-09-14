import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import Avatar from './Avatar';

type VetCardVet = {
  initial: string;
  color: string;
  photoUrl?: string;
  name: string;
  specialty: string;
  clinic: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  priceLabel: string;
};

type Props = {
  vet: VetCardVet;
  onPress: () => void;
};

export default function VetCard({ vet, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <Avatar initial={vet.initial} color={vet.color} size={56} uri={vet.photoUrl} />
      <View style={styles.info}>
        <Text style={styles.name}>{vet.name}</Text>
        <Text style={styles.specialty}>{vet.specialty}</Text>
        <Text style={styles.clinic}>{vet.clinic} · {vet.distanceKm} km</Text>
        <View style={styles.metaRow}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.rating}>{vet.rating}</Text>
            <Text style={styles.reviews}>({vet.reviewsCount})</Text>
          </View>
          <Text style={styles.price}>{vet.priceLabel}</Text>
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
  specialty: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  clinic: {
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
