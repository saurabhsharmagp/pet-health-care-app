import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { pets, vets } from '../data/mockData';
import { HomeStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'BookAppointment'>;

export default function BookAppointmentScreen({ route, navigation }: Props) {
  const vet = vets.find((v) => v.id === route.params.vetId)!;
  const [petId, setPetId] = useState(pets[0].id);
  const [dateIndex, setDateIndex] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [type, setType] = useState<'in-person' | 'video'>('in-person');
  const [reason, setReason] = useState('');

  const selectedSlot = vet.availableSlots[dateIndex];
  const canSubmit = Boolean(time && reason.trim().length > 0);

  const handleConfirm = () => {
    if (!canSubmit || !time) return;
    navigation.navigate('Payment', {
      vetId: vet.id,
      petId,
      date: selectedSlot.date,
      time,
      type,
      reason: reason.trim(),
      amount: vet.priceValue,
    });
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Book with {vet.name}</Text>
      <Text style={styles.subtitle}>{vet.specialty} · {vet.clinic}</Text>

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

      {vet.supportsVideo && (
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
      <View style={styles.rowWrap}>
        {vet.availableSlots.map((slot, idx) => {
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
        label={`Continue to Payment${time ? ` · ${time}` : ''}`}
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
