import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import VetCard from '../components/VetCard';
import { vets } from '../data/mockData';
import { colors, radius, spacing } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'VetList'>;

const specialties = ['All', 'General & Preventive Care', 'Dermatology', 'Surgery & Orthopedics', 'Nutrition & Wellness'];

export default function VetListScreen({ navigation, route }: Props) {
  const [query, setQuery] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState(route.params?.specialty ?? 'All');

  const filtered = useMemo(() => {
    return vets.filter((vet) => {
      const matchesSpecialty = activeSpecialty === 'All' || vet.specialty === activeSpecialty;
      const matchesQuery =
        query.trim().length === 0 ||
        vet.name.toLowerCase().includes(query.toLowerCase()) ||
        vet.clinic.toLowerCase().includes(query.toLowerCase());
      return matchesSpecialty && matchesQuery;
    });
  }, [query, activeSpecialty]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Find a Vet</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          placeholder="Search by name or clinic"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.chipsRow}>
        {specialties.map((specialty) => {
          const active = specialty === activeSpecialty;
          return (
            <TouchableOpacity
              key={specialty}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveSpecialty(specialty)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{specialty}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.resultsText}>{filtered.length} vets available</Text>

      {filtered.map((vet) => (
        <VetCard key={vet.id} vet={vet} onPress={() => navigation.navigate('VetDetail', { vetId: vet.id })} />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    color: colors.text,
    fontSize: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: '#fff',
  },
  resultsText: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
});
