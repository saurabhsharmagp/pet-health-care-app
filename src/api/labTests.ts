import { LabTestPackage } from '../lib/database.types';
import { supabase } from '../lib/supabase';

export async function listLabTestPackages(): Promise<LabTestPackage[]> {
  const { data, error } = await supabase.from('lab_test_packages').select('*').order('price', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getLabTestPackage(id: string): Promise<LabTestPackage | null> {
  const { data, error } = await supabase.from('lab_test_packages').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

// Lab sample collection isn't tied to a specific technician's calendar (unlike
// vets/walkers), so there's no lab_slots table — just a shared set of
// upcoming collection windows, generated client-side.
export function getLabTestSlots(): { date: string; times: { label: string; slotAt: string }[] }[] {
  const groups: { date: string; times: { label: string; slotAt: string }[] }[] = [];
  const hours = [8, 10, 17];
  for (let dayOffset = 1; dayOffset <= 3; dayOffset++) {
    const day = new Date();
    day.setDate(day.getDate() + dayOffset);
    const dateLabel = day.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
    const times = hours.map((hour) => {
      const slot = new Date(day);
      slot.setHours(hour, 0, 0, 0);
      return {
        label: slot.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        slotAt: slot.toISOString(),
      };
    });
    groups.push({ date: dateLabel, times });
  }
  return groups;
}
