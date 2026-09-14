import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getThread, listMessages, sendMessage, subscribeToMessages } from '../api/chat';
import { getVet, VetDirectoryEntry } from '../api/professionals';
import { useAuth } from '../lib/AuthContext';
import { ChatMessageRow, ChatThread } from '../lib/database.types';
import { formatTimeLabel } from '../lib/format';
import { ConsultStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<ConsultStackParamList, 'Chat'>;

export default function ChatScreen({ route, navigation }: Props) {
  const { profile } = useAuth();
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [vet, setVet] = useState<VetDirectoryEntry | null>(null);
  const [messages, setMessages] = useState<ChatMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    (async () => {
      const t = await getThread(route.params.threadId);
      if (!t) {
        setLoading(false);
        return;
      }
      const [v, msgs] = await Promise.all([getVet(t.professional_id), listMessages(t.id)]);
      setThread(t);
      setVet(v);
      setMessages(msgs);
      setLoading(false);
    })();
  }, [route.params.threadId]);

  useEffect(() => {
    if (!thread) return;
    const unsubscribe = subscribeToMessages(thread.id, (message) => {
      setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    });
    return unsubscribe;
  }, [thread]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: vet?.name ?? 'Chat',
      headerRight:
        vet?.supports_video
          ? () => (
              <TouchableOpacity
                style={styles.headerVideoButton}
                onPress={() => navigation.navigate('VideoCall', { vetId: vet.id })}
              >
                <Ionicons name="videocam" size={22} color={colors.primary} />
              </TouchableOpacity>
            )
          : undefined,
    });
  }, [navigation, vet]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !thread || !profile) return;
    setDraft('');
    const message = await sendMessage(thread.id, profile.id, text);
    setMessages((prev) => [...prev, message]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </SafeAreaView>
    );
  }

  if (!thread || !vet || !profile) {
    return (
      <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
        <Text style={styles.emptyText}>Conversation not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.length === 0 && (
            <Text style={styles.emptyText}>Say hello to {vet.name} to start the conversation.</Text>
          )}
          {messages.map((message) => {
            const isUser = message.sender_id === profile.id;
            return (
              <View key={message.id} style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleVet]}>
                <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{message.text}</Text>
                <Text style={[styles.bubbleTime, isUser && styles.bubbleTimeUser]}>
                  {formatTimeLabel(message.created_at)}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            value={draft}
            onChangeText={setDraft}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: spacing.sm,
  },
  bubbleVet: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    color: colors.text,
  },
  bubbleTextUser: {
    color: '#fff',
  },
  bubbleTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bubbleTimeUser: {
    color: '#E3F5F2',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerVideoButton: {
    marginRight: 8,
  },
});
