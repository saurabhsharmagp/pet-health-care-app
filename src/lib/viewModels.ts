// Maps real Supabase rows into the flat "card view" shapes the presentational
// components (VetCard, AppointmentCard, WalkCard, PatientCard, etc.) expect —
// so those components stay unchanged from when they rendered mock data.
import { VetDirectoryEntry, WalkerDirectoryEntry } from '../api/professionals';
import { Appointment, Pet, WalkBooking } from './database.types';
import { colorForId, initialFor } from './avatarStyle';
import { formatDateLabel, formatTimeLabel } from './format';

export function vetToCardView(v: VetDirectoryEntry) {
  return {
    id: v.id,
    name: v.name,
    specialty: v.specialty,
    clinic: v.clinic,
    bio: v.bio ?? '',
    rating: v.rating,
    reviewsCount: v.reviews_count,
    priceLabel: `₹${v.price_value.toLocaleString('en-IN')} / visit`,
    priceValue: v.price_value,
    distanceKm: v.distance_km ?? 0,
    color: colorForId(v.id),
    initial: initialFor(v.name),
    photoUrl: v.avatar_url ?? undefined,
    supportsVideo: v.supports_video,
  };
}

export function walkerToCardView(w: WalkerDirectoryEntry) {
  return {
    id: w.id,
    name: w.name,
    bio: w.bio ?? '',
    rating: w.rating,
    reviewsCount: w.reviews_count,
    priceLabel: `₹${w.price_value.toLocaleString('en-IN')} / walk`,
    priceValue: w.price_value,
    distanceKm: w.distance_km ?? 0,
    color: colorForId(w.id),
    initial: initialFor(w.name),
    photoUrl: w.avatar_url ?? undefined,
    walkTypes: w.walk_types,
  };
}

export function petToCardView(p: Pet) {
  return {
    id: p.id,
    name: p.name,
    species: p.species,
    breed: p.breed ?? '',
    age: p.age ?? '',
    weightKg: p.weight_kg ?? 0,
    color: colorForId(p.id),
    initial: initialFor(p.name),
    photoUrl: p.photo_url ?? undefined,
  };
}

export function appointmentToCardView(a: Appointment) {
  return {
    ...a,
    reason: a.reason ?? '',
    date: formatDateLabel(a.slot_at),
    time: formatTimeLabel(a.slot_at),
  };
}

export function walkBookingToCardView(w: WalkBooking) {
  return {
    ...w,
    duration: w.duration_label,
    date: formatDateLabel(w.slot_at),
    time: formatTimeLabel(w.slot_at),
  };
}
