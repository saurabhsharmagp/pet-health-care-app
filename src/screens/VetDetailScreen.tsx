import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';
import { getVet, getVetSlots, SlotGroup, VetDirectoryEntry } from '../api/professionals';
import { vetToCardView } from '../lib/viewModels';
import { HomeStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'VetDetail'>;

export default function VetDetailScreen({ route, navigation }: Props) {
  const [vet, setVet] = useState<VetDirectoryEntry | null>(null);
  const [slots, setSlots] = useState<SlotGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getVet(route.params.vetId), getVetSlots(route.params.vetId)]).then(([v, s]) => {
      setVet(v);
      setSlots(s);
      setLoading(false);
    });
  }, [route.params.vetId]);

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  if (!vet) {
    return (
      <ScreenContainer>
        <Text>Vet not found.</Text>
      </ScreenContainer>
    );
  }

  const view = vetToCardView(vet);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Avatar initial={view.initial} color={view.color} size={72} uri={view.photoUrl} />
        <Text style={styles.name}>{view.name}</Text>
        <Text style={styles.specialty}>{view.specialty}</Text>
        <View style={styles.badgeRow}>
          <Badge label={`⭐ ${view.rating} (${view.reviewsCount})`} />
          <Badge label={view.priceLabel} tone="success" />
          {view.supportsVideo && <Badge label="Video available" tone="warning" />}
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={18} color={colors.textMuted} />
          <Text style={styles.infoText}>{view.clinic}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color={colors.textMuted} />
          <Text style={styles.infoText}>{view.distanceKm} km away</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.bio}>{view.bio}</Text>

      <Text style={styles.sectionTitle}>Next available slots</Text>
      {slots.length === 0 ? (
        <Text style={styles.emptyText}>No upcoming slots — check back soon.</Text>
      ) : (
        slots.map((slot) => (
          <View key={slot.date} style={styles.slotRow}>
            <Text style={styles.slotDate}>{slot.date}</Text>
            <View style={styles.slotTimes}>
              {slot.times.map((time) => (
                <View key={time.id} style={styles.timePill}>
                  <Text style={styles.timeText}>{time.label}</Text>
                </View>
              ))}
            </View>
          </View>
        ))
      )}

      <View style={styles.actions}>
        {view.supportsVideo && (
          <Button
            label="Video Consult"
            variant="outline"
            onPress={() =>
              navigation.getParent()?.navigate('Consult', {
                screen: 'VideoCall',
                params: { vetId: vet.id },
              } as never)
            }
            style={styles.actionButton}
          />
        )}
        <Button
          label="Book Appointment"
          onPress={() => navigation.navigate('BookAppointment', { vetId: vet.id })}
          style={styles.actionButton}
        />
      </View>
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
  specialty: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 10,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bio: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  slotRow: {
    marginBottom: spacing.sm,
  },
  slotDate: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  slotTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});
