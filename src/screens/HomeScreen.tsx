import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import VetCard from '../components/VetCard';
import AppointmentCard from '../components/AppointmentCard';
import { listMyPets } from '../api/pets';
import { listVets, VetDirectoryEntry } from '../api/professionals';
import { listMyAppointments } from '../api/bookings';
import { Pet, Appointment } from '../lib/database.types';
import { useAuth } from '../lib/AuthContext';
import { appointmentToCardView, petToCardView, vetToCardView } from '../lib/viewModels';
import { colors, radius, spacing } from '../theme/colors';
import { HomeStackParamList } from '../navigation/types';

type NavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

const quickActions: {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  fg: string;
  onPress: (nav: any) => void;
}[] = [
  {
    key: 'book',
    label: 'Book Vet Visit',
    icon: 'medkit-outline',
    bg: colors.primaryLight,
    fg: colors.primary,
    onPress: (nav) => nav.navigate('VetList'),
  },
  {
    key: 'consult',
    label: 'Online Consult',
    icon: 'chatbubbles-outline',
    bg: colors.accentLight,
    fg: colors.accent,
    onPress: (nav) => nav.getParent()?.navigate('Consult'),
  },
  {
    key: 'labs',
    label: 'Lab Tests',
    icon: 'flask-outline',
    bg: colors.successLight,
    fg: colors.success,
    onPress: (nav) => nav.getParent()?.navigate('LabTests'),
  },
  {
    key: 'walk',
    label: 'Book a Walk',
    icon: 'paw-outline',
    bg: colors.warningLight,
    fg: colors.warning,
    onPress: (nav) => nav.getParent()?.navigate('Walking'),
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<Pet[]>([]);
  const [topVets, setTopVets] = useState<VetDirectoryEntry[]>([]);
  const [upcoming, setUpcoming] = useState<Appointment | null>(null);
  const [upcomingVet, setUpcomingVet] = useState<VetDirectoryEntry | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let active = true;

      (async () => {
        const [myPets, vets, myAppointments] = await Promise.all([
          listMyPets(profile.id),
          listVets(),
          listMyAppointments(profile.id),
        ]);
        if (!active) return;
        setPets(myPets);
        setTopVets(vets.slice(0, 2));

        const nextUpcoming = myAppointments.find((a) => a.status === 'upcoming') ?? null;
        setUpcoming(nextUpcoming);
        if (nextUpcoming) {
          const vet = vets.find((v) => v.id === nextUpcoming.vet_id) ?? null;
          setUpcomingVet(vet);
        } else {
          setUpcomingVet(null);
        }
        setLoading(false);
      })();

      return () => {
        active = false;
      };
    }, [profile])
  );

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: 'https://loremflickr.com/800/500/dog,cat,pets?lock=301' }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello, {profile.name.split(' ')[0]} 👋</Text>
              <Text style={styles.subGreeting}>Let's take care of your pets today</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View style={styles.avatarRing}>
                <Avatar initial={profile.name.charAt(0).toUpperCase()} color={colors.primary} size={44} uri={profile.avatar_url ?? undefined} />
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petsRow}>
              {pets.map((pet) => {
                const view = petToCardView(pet);
                return (
                  <View key={pet.id} style={styles.petCard}>
                    <Avatar initial={view.initial} color={view.color} size={40} uri={view.photoUrl} />
                    <Text style={styles.petName}>{view.name}</Text>
                    <Text style={styles.petMeta}>{view.breed} · {view.age}</Text>
                  </View>
                );
              })}
              <TouchableOpacity style={styles.addPetCard} onPress={() => navigation.navigate('AddPet')}>
                <Ionicons name="add" size={22} color={colors.primary} />
                <Text style={styles.addPetText}>Add Pet</Text>
              </TouchableOpacity>
            </ScrollView>

            <Text style={styles.sectionTitle}>Quick actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.key}
                  style={styles.actionCard}
                  activeOpacity={0.75}
                  onPress={() => action.onPress(navigation)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                    <Ionicons name={action.icon} size={24} color={action.fg} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {upcoming && upcomingVet && (
              <>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Upcoming appointment</Text>
                </View>
                <AppointmentCard
                  appointment={appointmentToCardView(upcoming)}
                  vet={vetToCardView(upcomingVet)}
                  onPress={() => navigation.navigate('VetDetail', { vetId: upcomingVet.id })}
                />
              </>
            )}

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Top rated vets near you</Text>
              <TouchableOpacity onPress={() => navigation.navigate('VetList')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            {topVets.map((vet) => (
              <VetCard
                key={vet.id}
                vet={vetToCardView(vet)}
                onPress={() => navigation.navigate('VetDetail', { vetId: vet.id })}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 40,
  },
  hero: {
    height: 200,
    marginHorizontal: -spacing.md,
    marginTop: -spacing.md,
    marginBottom: spacing.lg,
    justifyContent: 'flex-end',
    backgroundColor: colors.primaryDark,
  },
  heroImage: {
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 20, 20, 0.35)',
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  avatarRing: {
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  subGreeting: {
    fontSize: 13,
    color: '#F0F4F3',
    marginTop: 2,
  },
  petsRow: {
    marginBottom: spacing.lg,
  },
  petCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginRight: spacing.sm,
    width: 130,
    borderWidth: 1,
    borderColor: colors.border,
  },
  petName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  petMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  addPetCard: {
    width: 100,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPetText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
});
