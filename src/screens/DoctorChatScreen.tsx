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
import { getPet } from '../api/pets';
import { getProfile } from '../api/profiles';
import { useAuth } from '../lib/AuthContext';
import { ChatMessageRow, ChatThread, Pet, Profile } from '../lib/database.types';
import { formatTimeLabel } from '../lib/format';
import { DoctorMessagesStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<DoctorMessagesStackParamList, 'Chat'>;

export default function DoctorChatScreen({ route, navigation }: Props) {
  const { profile } = useAuth();
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
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
      const [o, p, msgs] = await Promise.all([
        getProfile(t.owner_id),
        t.pet_id ? getPet(t.pet_id) : Promise.resolve(null),
        listMessages(t.id),
      ]);
      setThread(t);
      setOwner(o);
      setPet(p);
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
    navigation.setOptions({ title: owner?.name ?? 'Chat' });
  }, [navigation, owner]);

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

  if (!thread || !owner || !profile) {
    return (
      <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
        <Text style={styles.emptyText}>Conversation not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      {pet && (
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>Re: {pet.name} ({pet.breed ?? pet.species})</Text>
        </View>
      )}
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
          {messages.length === 0 && <Text style={styles.emptyText}>No messages yet.</Text>}
          {messages.map((message) => {
            const isSelf = message.sender_id === profile.id;
            return (
              <View key={message.id} style={[styles.bubble, isSelf ? styles.bubbleSelf : styles.bubbleOther]}>
                <Text style={[styles.bubbleText, isSelf && styles.bubbleTextSelf]}>{message.text}</Text>
                <Text style={[styles.bubbleTime, isSelf && styles.bubbleTimeSelf]}>
                  {formatTimeLabel(message.created_at)}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a reply..."
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
  subHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: colors.primaryLight,
  },
  subHeaderText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
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
  bubbleOther: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleSelf: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    color: colors.text,
  },
  bubbleTextSelf: {
    color: '#fff',
  },
  bubbleTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bubbleTimeSelf: {
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
});
