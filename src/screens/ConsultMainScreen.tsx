import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import ScreenContainer from '../components/ScreenContainer';
import { getOrCreateThread, listMessages, listThreadsForOwner } from '../api/chat';
import { listVets, VetDirectoryEntry } from '../api/professionals';
import { useAuth } from '../lib/AuthContext';
import { ChatMessageRow, ChatThread } from '../lib/database.types';
import { formatTimeLabel } from '../lib/format';
import { vetToCardView } from '../lib/viewModels';
import { ConsultStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<ConsultStackParamList, 'ConsultMain'>;

type RecentThread = { thread: ChatThread; vet: VetDirectoryEntry; lastMessage: ChatMessageRow | null };

export default function ConsultMainScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [vets, setVets] = useState<VetDirectoryEntry[]>([]);
  const [recent, setRecent] = useState<RecentThread[]>([]);
  const [startingVetId, setStartingVetId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let active = true;
      (async () => {
        const [vetList, threads] = await Promise.all([listVets(), listThreadsForOwner(profile.id)]);
        if (!active) return;
        setVets(vetList);

        const withMessages = await Promise.all(
          threads.map(async (thread) => {
            const vet = vetList.find((v) => v.id === thread.professional_id);
            if (!vet) return null;
            const messages = await listMessages(thread.id);
            const lastMessage: ChatMessageRow | null = messages.length > 0 ? messages[messages.length - 1] : null;
            return { thread, vet, lastMessage };
          })
        );
        if (!active) return;
        setRecent(withMessages.filter((r): r is RecentThread => r !== null));
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [profile])
  );

  const recentVetIds = new Set(recent.map((r) => r.vet.id));
  const otherVets = vets.filter((v) => !recentVetIds.has(v.id));

  const startChat = async (vetId: string) => {
    if (!profile || startingVetId) return;
    setStartingVetId(vetId);
    const thread = await getOrCreateThread(profile.id, vetId, null);
    setStartingVetId(null);
    navigation.navigate('Chat', { threadId: thread.id });
  };

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Consult a Vet</Text>
      <Text style={styles.subtitle}>Chat or video call a vet from anywhere</Text>

      {recent.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent conversations</Text>
          {recent.map(({ thread, vet, lastMessage }) => {
            const view = vetToCardView(vet);
            return (
              <TouchableOpacity
                key={thread.id}
                style={styles.threadRow}
                onPress={() => navigation.navigate('Chat', { threadId: thread.id })}
              >
                <Avatar initial={view.initial} color={view.color} size={48} uri={view.photoUrl} />
                <View style={styles.threadInfo}>
                  <Text style={styles.vetName}>{view.name}</Text>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {lastMessage ? (lastMessage.sender_id === profile?.id ? 'You: ' : '') + lastMessage.text : 'Say hello to start the conversation'}
                  </Text>
                </View>
                {lastMessage && <Text style={styles.time}>{formatTimeLabel(lastMessage.created_at)}</Text>}
              </TouchableOpacity>
            );
          })}
        </>
      )}

      <Text style={styles.sectionTitle}>Available vets</Text>
      {otherVets.map((vet) => {
        const view = vetToCardView(vet);
        return (
          <View key={vet.id} style={styles.vetRow}>
            <Avatar initial={view.initial} color={view.color} size={48} uri={view.photoUrl} />
            <View style={styles.threadInfo}>
              <Text style={styles.vetName}>{view.name}</Text>
              <Text style={styles.vetSpecialty}>{view.specialty}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.iconButton} onPress={() => startChat(vet.id)}>
                <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
              </TouchableOpacity>
              {view.supportsVideo && (
                <TouchableOpacity
                  style={[styles.iconButton, styles.videoButton]}
                  onPress={() => navigation.navigate('VideoCall', { vetId: vet.id })}
                >
                  <Ionicons name="videocam-outline" size={18} color={colors.accent} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
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
  vetRow: {
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
  vetName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  vetSpecialty: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoButton: {
    backgroundColor: colors.accentLight,
  },
});
