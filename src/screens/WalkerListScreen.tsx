import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import WalkerCard from '../components/WalkerCard';
import { listWalkers, WalkerDirectoryEntry } from '../api/professionals';
import { walkerToCardView } from '../lib/viewModels';
import { colors, radius, spacing } from '../theme/colors';
import { WalkingStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<WalkingStackParamList, 'WalkerList'>;

export default function WalkerListScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [walkers, setWalkers] = useState<WalkerDirectoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listWalkers().then((data) => {
      setWalkers(data);
      setLoading(false);
    });
  }, []);

  const walkTypeFilters = useMemo(
    () => ['All', ...new Set(walkers.flatMap((w) => w.walk_types))],
    [walkers]
  );

  const filtered = useMemo(() => {
    return walkers.filter((walker) => {
      const matchesType = activeType === 'All' || walker.walk_types.includes(activeType);
      const matchesQuery = query.trim().length === 0 || walker.name.toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [walkers, query, activeType]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Find a Walker</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          placeholder="Search by name"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.chipsRow}>
        {walkTypeFilters.map((type) => {
          const active = type === activeType;
          return (
            <TouchableOpacity
              key={type}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveType(type)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <>
          <Text style={styles.resultsText}>{filtered.length} walkers available</Text>
          {filtered.map((walker) => (
            <WalkerCard
              key={walker.id}
              walker={walkerToCardView(walker)}
              onPress={() => navigation.navigate('WalkerDetail', { walkerId: walker.id })}
            />
          ))}
        </>
      )}
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
