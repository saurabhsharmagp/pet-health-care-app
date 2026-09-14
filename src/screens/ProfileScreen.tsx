import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Avatar from '../components/Avatar';
import { listMyPets } from '../api/pets';
import { Pet } from '../lib/database.types';
import { useAuth } from '../lib/AuthContext';
import { colorForId, initialFor } from '../lib/avatarStyle';
import { HomeStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

const menuItems: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'person-outline', label: 'Personal information' },
  { icon: 'card-outline', label: 'Payment methods' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'shield-checkmark-outline', label: 'Privacy & security' },
  { icon: 'help-circle-outline', label: 'Help & support' },
];

type Props = NativeStackScreenProps<HomeStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { profile, signOut } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let active = true;
      listMyPets(profile.id)
        .then((data) => active && setPets(data))
        .finally(() => active && setLoading(false));
      return () => {
        active = false;
      };
    }, [profile])
  );

  if (!profile) return null;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Avatar initial={initialFor(profile.name)} color={colors.primary} size={72} uri={profile.avatar_url ?? undefined} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
      </View>

      <Text style={styles.sectionTitle}>My Pets</Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginBottom: spacing.md }} />
      ) : (
        pets.map((pet) => (
          <View key={pet.id} style={styles.petRow}>
            <Avatar initial={initialFor(pet.name)} color={colorForId(pet.id)} size={44} uri={pet.photo_url ?? undefined} />
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petMeta}>
                {pet.species} · {pet.breed} · {pet.age} · {pet.weight_kg} kg
              </Text>
            </View>
          </View>
        ))
      )}
      <TouchableOpacity style={styles.addPetButton} onPress={() => navigation.navigate('AddPet')}>
        <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
        <Text style={styles.addPetText}>Add another pet</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.menuCard}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuRow, idx !== menuItems.length - 1 && styles.menuRowBorder]}
          >
            <Ionicons name={item.icon} size={20} color={colors.textMuted} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
  },
  email: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  petInfo: {
    marginLeft: spacing.md,
  },
  petName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  petMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
  },
  addPetText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: spacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  logoutText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 14,
  },
});
