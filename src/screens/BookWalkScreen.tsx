import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { listMyPets } from '../api/pets';
import { getWalker, getWalkerSlots, SlotGroup, SlotOption, WalkerDirectoryEntry } from '../api/professionals';
import { useAuth } from '../lib/AuthContext';
import { Pet } from '../lib/database.types';
import { petToCardView } from '../lib/viewModels';
import { WalkingStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<WalkingStackParamList, 'BookWalk'>;

export default function BookWalkScreen({ route, navigation }: Props) {
  const { profile } = useAuth();
  const [walker, setWalker] = useState<WalkerDirectoryEntry | null>(null);
  const [slotGroups, setSlotGroups] = useState<SlotGroup[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const [petId, setPetId] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [dateIndex, setDateIndex] = useState(0);
  const [time, setTime] = useState<SlotOption | null>(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!profile) return;
    Promise.all([
      getWalker(route.params.walkerId),
      getWalkerSlots(route.params.walkerId),
      listMyPets(profile.id),
    ]).then(([w, slots, myPets]) => {
      setWalker(w);
      setSlotGroups(slots);
      setPets(myPets);
      setPetId(myPets[0]?.id ?? null);
      setDuration(w?.walk_types[0] ?? null);
      setLoading(false);
    });
  }, [route.params.walkerId, profile]);

  if (loading || !walker) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  const selectedSlot = slotGroups[dateIndex];
  const canSubmit = Boolean(petId && duration && time && address.trim().length > 0);

  const handleContinue = () => {
    if (!canSubmit || !time || !petId || !duration) return;
    navigation.navigate('ConfirmBooking', {
      walkerId: walker.id,
      petId,
      slotId: time.id,
      slotAt: time.slotAt,
      durationLabel: duration,
      address: address.trim(),
      amount: walker.price_value,
    });
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Book with {walker.name}</Text>
      <Text style={styles.subtitle}>₹{walker.price_value.toLocaleString('en-IN')} / walk</Text>

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

      <Text style={styles.sectionTitle}>Service type</Text>
      <View style={styles.rowWrap}>
        {walker.walk_types.map((type) => {
          const active = type === duration;
          return (
            <TouchableOpacity
              key={type}
              style={[styles.typeOption, active && styles.typeOptionActive]}
              onPress={() => setDuration(type)}
            >
              <Text style={[styles.typeText, active && styles.typeTextActive]}>{type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

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

      <Text style={styles.sectionTitle}>Pickup address</Text>
      <TextInput
        style={styles.textArea}
        placeholder="House no., street, area, city..."
        placeholderTextColor={colors.textMuted}
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={3}
      />

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
  typeOption: {
    paddingHorizontal: 14,
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
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
  confirmButton: {
    marginTop: spacing.sm,
  },
});
