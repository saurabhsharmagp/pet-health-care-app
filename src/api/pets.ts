import { Pet } from '../lib/database.types';
import { supabase } from '../lib/supabase';

export async function listMyPets(ownerId: string): Promise<Pet[]> {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPet(id: string): Promise<Pet | null> {
  const { data, error } = await supabase.from('pets').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function createPet(input: {
  ownerId: string;
  name: string;
  species: string;
  breed?: string;
  age?: string;
  weightKg?: number;
}): Promise<Pet> {
  const { data, error } = await supabase
    .from('pets')
    .insert({
      owner_id: input.ownerId,
      name: input.name,
      species: input.species,
      breed: input.breed ?? null,
      age: input.age ?? null,
      weight_kg: input.weightKg ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
