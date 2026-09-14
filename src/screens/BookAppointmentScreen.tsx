import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { listMyPets } from '../api/pets';
import { getVet, getVetSlots, SlotGroup, SlotOption, VetDirectoryEntry } from '../api/professionals';
import { useAuth } from '../lib/AuthContext';
import { Pet } from '../lib/database.types';
import { petToCardView } from '../lib/viewModels';
import { HomeStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'BookAppointment'>;

export default function BookAppointmentScreen({ route, navigation }: Props) {
  const { profile } = useAuth();
  const [vet, setVet] = useState<VetDirectoryEntry | null>(null);
  const [slotGroups, setSlotGroups] = useState<SlotGroup[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const [petId, setPetId] = useState<string | null>(null);
  const [dateIndex, setDateIndex] = useState(0);
  const [time, setTime] = useState<SlotOption | null>(null);
  const [type, setType] = useState<'in-person' | 'video'>('in-person');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!profile) return;
    Promise.all([getVet(route.params.vetId), getVetSlots(route.params.vetId), listMyPets(profile.id)]).then(
      ([v, slots, myPets]) => {
        setVet(v);
        setSlotGroups(slots);
        setPets(myPets);
        setPetId(myPets[0]?.id ?? null);
        setLoading(false);
      }
    );
  }, [route.params.vetId, profile]);

  if (loading || !vet) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  const selectedSlot = slotGroups[dateIndex];
  const canSubmit = Boolean(petId && time && reason.trim().length > 0);

  const handleConfirm = () => {
    if (!canSubmit || !time || !petId) return;
    navigation.navigate('ConfirmBooking', {
      vetId: vet.id,
      petId,
      slotId: time.id,
      slotAt: time.slotAt,
      type,
      reason: reason.trim(),
      amount: vet.price_value,
    });
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Book with {vet.name}</Text>
      <Text style={styles.subtitle}>{vet.specialty} · {vet.clinic}</Text>

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

      {vet.supports_video && (
        <>
          <Text style={styles.sectionTitle}>Visit type</Text>
          <View style={styles.rowWrap}>
            <TouchableOpacity
              style={[styles.typeOption, type === 'in-person' && styles.typeOptionActive]}
              onPress={() => setType('in-person')}
            >
              <Text style={[styles.typeText, type === 'in-person' && styles.typeTextActive]}>In-clinic</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeOption, type === 'video' && styles.typeOptionActive]}
              onPress={() => setType('video')}
            >
              <Text style={[styles.typeText, type === 'video' && styles.typeTextActive]}>Video call</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Select date</Text>
      {slotGroups.length === 0 ? (
        <Text style={styles.emptyText}>No upcoming slots — check back soon.</Text>
      ) : (
        <>
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
              const active = t.id === time?.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.dateChip, active && styles.dateChipActive]}
                  onPress={() => setTime(t)}
                >
                  <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Reason for visit</Text>
      <TextInput
        style={styles.textArea}
        placeholder="E.g. Annual checkup, vaccination, limping..."
        placeholderTextColor={colors.textMuted}
        value={reason}
        onChangeText={setReason}
        multiline
        numberOfLines={4}
      />

      <Button
        label={`Continue${time ? ` · ${time.label}` : ''}`}
        onPress={handleConfirm}
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
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  typeOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  typeTextActive: {
    color: '#fff',
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
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
  confirmButton: {
    marginTop: spacing.sm,
  },
});
