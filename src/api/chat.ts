import { ChatMessageRow, ChatThread } from '../lib/database.types';
import { supabase } from '../lib/supabase';

export async function getOrCreateThread(
  ownerId: string,
  professionalId: string,
  petId: string | null
): Promise<ChatThread> {
  const existingQuery = supabase
    .from('chat_threads')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('professional_id', professionalId);
  const { data: existing } = petId
    ? await existingQuery.eq('pet_id', petId).maybeSingle()
    : await existingQuery.is('pet_id', null).maybeSingle();
  if (existing) return existing;

  const { data, error } = await supabase
    .from('chat_threads')
    .insert({ owner_id: ownerId, professional_id: professionalId, pet_id: petId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getThread(threadId: string): Promise<ChatThread | null> {
  const { data, error } = await supabase.from('chat_threads').select('*').eq('id', threadId).single();
  if (error) return null;
  return data;
}

export async function listThreadsForOwner(ownerId: string): Promise<ChatThread[]> {
  const { data, error } = await supabase.from('chat_threads').select('*').eq('owner_id', ownerId);
  if (error) throw error;
  return data ?? [];
}

export async function listThreadsForProfessional(professionalId: string): Promise<ChatThread[]> {
  const { data, error } = await supabase.from('chat_threads').select('*').eq('professional_id', professionalId);
  if (error) throw error;
  return data ?? [];
}

export async function listMessages(threadId: string): Promise<ChatMessageRow[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function sendMessage(threadId: string, senderId: string, text: string): Promise<ChatMessageRow> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ thread_id: threadId, sender_id: senderId, text })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Live updates a chat screen with messages sent by the other participant.
// Returns an unsubscribe function — call it in a useEffect cleanup.
export function subscribeToMessages(threadId: string, onInsert: (message: ChatMessageRow) => void) {
  const channel = supabase
    .channel(`chat_messages:${threadId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `thread_id=eq.${threadId}` },
      (payload) => onInsert(payload.new as ChatMessageRow)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
