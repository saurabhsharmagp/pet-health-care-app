import { VetProfile, WalkerProfile } from '../lib/database.types';
import { supabase } from '../lib/supabase';

export type VetDirectoryEntry = VetProfile & { name: string; avatar_url: string | null };
export type WalkerDirectoryEntry = WalkerProfile & { name: string; avatar_url: string | null };

async function fetchProfilesByRole(role: 'vet' | 'walker') {
  const { data, error } = await supabase.from('profiles').select('id, name, avatar_url').eq('role', role);
  if (error) throw error;
  return data ?? [];
}

export async function listVets(): Promise<VetDirectoryEntry[]> {
  const profiles = await fetchProfilesByRole('vet');
  if (profiles.length === 0) return [];
  const { data, error } = await supabase
    .from('vet_profiles')
    .select('*')
    .in('id', profiles.map((p) => p.id));
  if (error) throw error;
  const byId = new Map(profiles.map((p) => [p.id, p]));
  return (data ?? []).map((v) => ({
    ...v,
    name: byId.get(v.id)?.name ?? 'Unknown',
    avatar_url: byId.get(v.id)?.avatar_url ?? null,
  }));
}

export async function getVet(id: string): Promise<VetDirectoryEntry | null> {
  const { data: profile } = await supabase.from('profiles').select('id, name, avatar_url').eq('id', id).single();
  if (!profile) return null;
  const { data: vet, error } = await supabase.from('vet_profiles').select('*').eq('id', id).single();
  if (error || !vet) return null;
  return { ...vet, name: profile.name, avatar_url: profile.avatar_url };
}

export async function listWalkers(): Promise<WalkerDirectoryEntry[]> {
  const profiles = await fetchProfilesByRole('walker');
  if (profiles.length === 0) return [];
  const { data, error } = await supabase
    .from('walker_profiles')
    .select('*')
    .in('id', profiles.map((p) => p.id));
  if (error) throw error;
  const byId = new Map(profiles.map((p) => [p.id, p]));
  return (data ?? []).map((w) => ({
    ...w,
    name: byId.get(w.id)?.name ?? 'Unknown',
    avatar_url: byId.get(w.id)?.avatar_url ?? null,
  }));
}

export async function getWalker(id: string): Promise<WalkerDirectoryEntry | null> {
  const { data: profile } = await supabase.from('profiles').select('id, name, avatar_url').eq('id', id).single();
  if (!profile) return null;
  const { data: walker, error } = await supabase.from('walker_profiles').select('*').eq('id', id).single();
  if (error || !walker) return null;
  return { ...walker, name: profile.name, avatar_url: profile.avatar_url };
}

export type SlotOption = { id: string; label: string; slotAt: string };
export type SlotGroup = { date: string; times: SlotOption[] };

function groupSlots(rows: { id: string; slot_at: string }[]): SlotGroup[] {
  const groups = new Map<string, SlotGroup>();
  for (const row of rows) {
    const d = new Date(row.slot_at);
    const dateKey = d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', timeZone: 'Asia/Kolkata' });
    const label = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
    if (!groups.has(dateKey)) groups.set(dateKey, { date: dateKey, times: [] });
    groups.get(dateKey)!.times.push({ id: row.id, label, slotAt: row.slot_at });
  }
  return Array.from(groups.values());
}

export async function getVetSlots(vetId: string): Promise<SlotGroup[]> {
  const { data, error } = await supabase
    .from('vet_slots')
    .select('id, slot_at')
    .eq('vet_id', vetId)
    .eq('is_booked', false)
    .gte('slot_at', new Date().toISOString())
    .order('slot_at', { ascending: true });
  if (error) throw error;
  return groupSlots(data ?? []);
}

export async function getWalkerSlots(walkerId: string): Promise<SlotGroup[]> {
  const { data, error } = await supabase
    .from('walker_slots')
    .select('id, slot_at')
    .eq('walker_id', walkerId)
    .eq('is_booked', false)
    .gte('slot_at', new Date().toISOString())
    .order('slot_at', { ascending: true });
  if (error) throw error;
  return groupSlots(data ?? []);
}
