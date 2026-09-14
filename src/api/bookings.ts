import { Appointment, AppointmentType, BookingStatus, LabTestBooking, WalkBooking } from '../lib/database.types';
import { supabase } from '../lib/supabase';

// -- Appointments (vet visits) ------------------------------------------------

export async function createAppointment(input: {
  vetId: string;
  petId: string;
  ownerId: string;
  slotId: string;
  slotAt: string;
  reason: string;
  type: AppointmentType;
}): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      vet_id: input.vetId,
      pet_id: input.petId,
      owner_id: input.ownerId,
      slot_at: input.slotAt,
      reason: input.reason,
      type: input.type,
    })
    .select()
    .single();
  if (error) throw error;
  await supabase.from('vet_slots').update({ is_booked: true }).eq('id', input.slotId);
  return data;
}

export async function listMyAppointments(ownerId: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('owner_id', ownerId)
    .order('slot_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listVetAppointments(vetId: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('vet_id', vetId)
    .order('slot_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  const { data, error } = await supabase.from('appointments').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function updateAppointmentStatus(id: string, status: BookingStatus) {
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
  if (error) throw error;
}

// -- Walk bookings ------------------------------------------------------------

export async function createWalkBooking(input: {
  walkerId: string;
  petId: string;
  ownerId: string;
  slotId: string;
  slotAt: string;
  durationLabel: string;
  address: string;
}): Promise<WalkBooking> {
  const { data, error } = await supabase
    .from('walk_bookings')
    .insert({
      walker_id: input.walkerId,
      pet_id: input.petId,
      owner_id: input.ownerId,
      slot_at: input.slotAt,
      duration_label: input.durationLabel,
      address: input.address,
    })
    .select()
    .single();
  if (error) throw error;
  await supabase.from('walker_slots').update({ is_booked: true }).eq('id', input.slotId);
  return data;
}

export async function listMyWalkBookings(ownerId: string): Promise<WalkBooking[]> {
  const { data, error } = await supabase
    .from('walk_bookings')
    .select('*')
    .eq('owner_id', ownerId)
    .order('slot_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listWalkerBookings(walkerId: string): Promise<WalkBooking[]> {
  const { data, error } = await supabase
    .from('walk_bookings')
    .select('*')
    .eq('walker_id', walkerId)
    .order('slot_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getWalkBooking(id: string): Promise<WalkBooking | null> {
  const { data, error } = await supabase.from('walk_bookings').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function updateWalkBookingStatus(id: string, status: BookingStatus) {
  const { error } = await supabase.from('walk_bookings').update({ status }).eq('id', id);
  if (error) throw error;
}

// -- Lab test bookings ---------------------------------------------------------

export async function createLabTestBooking(input: {
  packageId: string;
  petId: string;
  ownerId: string;
  slotAt: string;
  address: string;
}): Promise<LabTestBooking> {
  const { data, error } = await supabase
    .from('lab_test_bookings')
    .insert({
      package_id: input.packageId,
      pet_id: input.petId,
      owner_id: input.ownerId,
      slot_at: input.slotAt,
      address: input.address,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listMyLabTestBookings(ownerId: string): Promise<LabTestBooking[]> {
  const { data, error } = await supabase
    .from('lab_test_bookings')
    .select('*')
    .eq('owner_id', ownerId)
    .order('slot_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getLabTestBooking(id: string): Promise<LabTestBooking | null> {
  const { data, error } = await supabase.from('lab_test_bookings').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}
