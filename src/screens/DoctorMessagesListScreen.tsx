import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import ScreenContainer from '../components/ScreenContainer';
import { listMessages, listThreadsForProfessional } from '../api/chat';
import { getPet } from '../api/pets';
import { getProfile } from '../api/profiles';
import { useAuth } from '../lib/AuthContext';
import { ChatMessageRow, ChatThread, Pet, Profile } from '../lib/database.types';
import { formatTimeLabel } from '../lib/format';
import { petToCardView } from '../lib/viewModels';
import { DoctorMessagesStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<DoctorMessagesStackParamList, 'MessagesMain'>;

type ThreadRow = { thread: ChatThread; pet: Pet | null; owner: Profile; lastMessage: ChatMessageRow | null };

export default function DoctorMessagesListScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ThreadRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let active = true;
      (async () => {
        const threads = await listThreadsForProfessional(profile.id);
        const built = await Promise.all(
          threads.map(async (thread) => {
            const owner = await getProfile(thread.owner_id);
            if (!owner) return null;
            const [pet, messages] = await Promise.all([
              thread.pet_id ? getPet(thread.pet_id) : Promise.resolve(null),
              listMessages(thread.id),
            ]);
            const lastMessage: ChatMessageRow | null = messages.length > 0 ? messages[messages.length - 1] : null;
            return { thread, pet, owner, lastMessage };
          })
        );
        if (!active) return;
        setRows(built.filter((r): r is ThreadRow => r !== null));
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [profile])
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.subtitle}>Conversations with your patients' owners</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        rows.map(({ thread, pet, owner, lastMessage }) => {
          const petView = pet ? petToCardView(pet) : null;
          return (
            <TouchableOpacity
              key={thread.id}
              style={styles.threadRow}
              onPress={() => navigation.navigate('Chat', { threadId: thread.id })}
            >
              <Avatar
                initial={petView?.initial ?? owner.name.charAt(0).toUpperCase()}
                color={petView?.color ?? colors.primary}
                size={48}
                uri={petView?.photoUrl}
              />
              <View style={styles.threadInfo}>
                <Text style={styles.name}>{owner.name}</Text>
                {pet && <Text style={styles.petName}>{pet.name}'s owner</Text>}
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {lastMessage
                    ? (lastMessage.sender_id === profile?.id ? 'You: ' : '') + lastMessage.text
                    : 'No messages yet'}
                </Text>
              </View>
              {lastMessage && <Text style={styles.time}>{formatTimeLabel(lastMessage.created_at)}</Text>}
            </TouchableOpacity>
          );
        })
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  threadInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  petName: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 1,
  },
  lastMessage: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
