import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { createPet } from '../api/pets';
import { useAuth } from '../lib/AuthContext';
import { HomeStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'AddPet'>;

const SPECIES_OPTIONS = ['Dog', 'Cat', 'Bird', 'Rabbit'];

export default function AddPetScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState(SPECIES_OPTIONS[0]);
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 0 && !submitting;

  const handleSave = async () => {
    if (!profile || !canSubmit) return;
    setSubmitting(true);
    try {
      await createPet({
        ownerId: profile.id,
        name: name.trim(),
        species,
        breed: breed.trim() || undefined,
        age: age.trim() || undefined,
        weightKg: weightKg.trim() ? Number(weightKg.trim()) : undefined,
      });
      navigation.goBack();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Add a Pet</Text>
      <Text style={styles.subtitle}>Tell us a bit about your pet so we can personalize their care.</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Bruno"
        placeholderTextColor={colors.textMuted}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Species</Text>
      <View style={styles.rowWrap}>
        {SPECIES_OPTIONS.map((option) => {
          const active = option === species;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setSpecies(option)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Breed</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Golden Retriever"
        placeholderTextColor={colors.textMuted}
        value={breed}
        onChangeText={setBreed}
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 3 yrs"
        placeholderTextColor={colors.textMuted}
        value={age}
        onChangeText={setAge}
      />

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 28"
        placeholderTextColor={colors.textMuted}
        value={weightKg}
        onChangeText={setWeightKg}
        keyboardType="numeric"
      />

      <Button label="Save Pet" onPress={handleSave} disabled={!canSubmit} loading={submitting} style={styles.saveButton} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
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
    marginBottom: spacing.md,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextActive: {
    color: '#fff',
  },
  saveButton: {
    marginTop: spacing.md,
  },
});
