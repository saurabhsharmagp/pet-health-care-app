import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { getLabTestPackage, getLabTestSlots } from '../api/labTests';
import { listMyPets } from '../api/pets';
import { useAuth } from '../lib/AuthContext';
import { LabTestPackage, Pet } from '../lib/database.types';
import { petToCardView } from '../lib/viewModels';
import { LabTestsStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<LabTestsStackParamList, 'BookLabTest'>;

const slotGroups = getLabTestSlots();

export default function BookLabTestScreen({ route, navigation }: Props) {
  const { profile } = useAuth();
  const [pkg, setPkg] = useState<LabTestPackage | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const [petId, setPetId] = useState<string | null>(null);
  const [dateIndex, setDateIndex] = useState(0);
  const [time, setTime] = useState<{ label: string; slotAt: string } | null>(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!profile) return;
    Promise.all([getLabTestPackage(route.params.packageId), listMyPets(profile.id)]).then(([p, myPets]) => {
      setPkg(p);
      setPets(myPets);
      setPetId(myPets[0]?.id ?? null);
      setLoading(false);
    });
  }, [route.params.packageId, profile]);

  if (loading || !pkg) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  const selectedSlot = slotGroups[dateIndex];
  const canSubmit = Boolean(petId && time && address.trim().length > 0);

  const handleContinue = () => {
    if (!canSubmit || !time || !petId) return;
    navigation.navigate('ConfirmBooking', {
      packageId: pkg.id,
      petId,
      slotAt: time.slotAt,
      address: address.trim(),
      amount: pkg.price,
    });
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Book {pkg.name}</Text>
      <Text style={styles.subtitle}>{pkg.category} · ₹{pkg.price.toLocaleString('en-IN')}</Text>

      <Text style={styles.sectionTitle}>Select pet</Text>
      {pets.length === 0 ? (
        <Text style={styles.emptyText}>You don't have any pets yet — add one from your profile first.</Text>
      ) : (
        <View style={styles.rowWrap}>
          {pets.map((pet) => {
            const view = petToCardView(pet);
            const active = pet.id === petId;
            return (
              <TouchableOpacity
                key={pet.id}
                style={[styles.petOption, active && styles.petOptionActive]}
                onPress={() => setPetId(pet.id)}
              >
                <Avatar initial={view.initial} color={view.color} size={32} uri={view.photoUrl} />
                <Text style={[styles.petOptionText, active && styles.petOptionTextActive]}>{view.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <Text style={styles.sectionTitle}>Select collection date</Text>
      <View style={styles.rowWrap}>
        {slotGroups.map((slot, idx) => {
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
          const active = t.slotAt === time?.slotAt;
          return (
            <TouchableOpacity
              key={t.slotAt}
              style={[styles.dateChip, active && styles.dateChipActive]}
              onPress={() => setTime(t)}
            >
              <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>{t.label}</Text>
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
        label={`Continue${time ? ` · ${time.label}` : ''}`}
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
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
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
