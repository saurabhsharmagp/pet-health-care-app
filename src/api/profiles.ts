import { Profile } from '../lib/database.types';
import { supabase } from '../lib/supabase';

export async function getProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}
