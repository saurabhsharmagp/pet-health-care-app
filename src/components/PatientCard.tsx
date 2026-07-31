import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Owner, Pet } from '../data/mockData';
import { colors, radius, spacing } from '../theme/colors';
import Avatar from './Avatar';

type Props = {
  pet: Pet;
  owner: Owner;
  lastVisit?: string;
  onPress: () => void;
};

export default function PatientCard({ pet, owner, lastVisit, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <Avatar initial={pet.initial} color={pet.color} size={52} uri={pet.photoUrl} />
      <View style={styles.info}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.meta}>{pet.species} · {pet.breed}</Text>
        <Text style={styles.owner}>Owner: {owner.name}</Text>
      </View>
      <View style={styles.right}>
        {lastVisit && <Text style={styles.lastVisit}>{lastVisit}</Text>}
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
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
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  owner: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  lastVisit: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
