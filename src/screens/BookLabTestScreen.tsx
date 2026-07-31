import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { labTestPackages, labTestSlots, pets } from '../data/mockData';
import { LabTestsStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<LabTestsStackParamList, 'BookLabTest'>;

export default function BookLabTestScreen({ route, navigation }: Props) {
  const pkg = labTestPackages.find((p) => p.id === route.params.packageId)!;
  const [petId, setPetId] = useState(pets[0].id);
  const [dateIndex, setDateIndex] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [address, setAddress] = useState('');

  const selectedSlot = labTestSlots[dateIndex];
  const canSubmit = Boolean(time && address.trim().length > 0);

  const handleContinue = () => {
    if (!canSubmit || !time) return;
    navigation.navigate('Payment', {
      packageId: pkg.id,
      petId,
      date: selectedSlot.date,
      time,
      address: address.trim(),
      amount: pkg.price,
    });
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Book {pkg.name}</Text>
      <Text style={styles.subtitle}>{pkg.category} · ₹{pkg.price.toLocaleString('en-IN')}</Text>

      <Text style={styles.sectionTitle}>Select pet</Text>
      <View style={styles.rowWrap}>
        {pets.map((pet) => {
          const active = pet.id === petId;
          return (
            <TouchableOpacity
              key={pet.id}
              style={[styles.petOption, active && styles.petOptionActive]}
              onPress={() => setPetId(pet.id)}
            >
              <Avatar initial={pet.initial} color={pet.color} size={32} uri={pet.photoUrl} />
              <Text style={[styles.petOptionText, active && styles.petOptionTextActive]}>{pet.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Select collection date</Text>
      <View style={styles.rowWrap}>
        {labTestSlots.map((slot, idx) => {
          const active = idx === dateIndex;
          return (
            <TouchableOpacity
              key={slot.date}
              style={[styles.dateChip, active && styles.dateChipActive]}
              onPress={() => {
                setDateIndex(idx);
                setTime(null);
              }}
            >
              <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>{slot.date}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Select time</Text>
      <View style={styles.rowWrap}>
        {selectedSlot.times.map((t) => {
          const active = t === time;
          return (
            <TouchableOpacity
              key={t}
              style={[styles.dateChip, active && styles.dateChipActive]}
              onPress={() => setTime(t)}
            >
              <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Collection address</Text>
      <TextInput
        style={styles.textArea}
        placeholder="House no., street, area, city..."
        placeholderTextColor={colors.textMuted}
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={3}
      />

      {pkg.fasting && (
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>⚠️ This test requires 8-10 hours of fasting before sample collection.</Text>
        </View>
      )}

      <Button
        label={`Continue to Payment${time ? ` · ${time}` : ''}`}
        onPress={handleContinue}
        disabled={!canSubmit}
        style={styles.confirmButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  petOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  petOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  petOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  petOptionTextActive: {
    color: colors.primary,
  },
  dateChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  dateChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  dateChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  dateChipTextActive: {
    color: '#fff',
  },
  textArea: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  noteCard: {
    backgroundColor: colors.warningLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  noteText: {
    fontSize: 13,
    color: colors.warning,
    fontWeight: '600',
  },
  confirmButton: {
    marginTop: spacing.sm,
  },
});
