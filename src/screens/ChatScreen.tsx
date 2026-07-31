import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLayoutEffect, useRef, useState } from 'react';
import {
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
import { ChatMessage, chatThreads, vets } from '../data/mockData';
import { ConsultStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<ConsultStackParamList, 'Chat'>;

const AUTO_REPLIES = [
  "Thanks for sharing that. Let's keep an eye on it for the next day.",
  'Got it. Can you send a photo if the symptoms are visible?',
  "That's good to hear. Continue with the current routine.",
  'I recommend booking an in-clinic visit if it does not improve by tomorrow.',
];

export default function ChatScreen({ route, navigation }: Props) {
  const vet = vets.find((v) => v.id === route.params.vetId)!;
  const [messages, setMessages] = useState<ChatMessage[]>(chatThreads[vet.id] ?? []);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: vet.name,
      headerRight: vet.supportsVideo
        ? () => (
            <TouchableOpacity
              style={styles.headerVideoButton}
              onPress={() => navigation.navigate('Payment', { vetId: vet.id, mode: 'video', amount: vet.priceValue })}
            >
              <Ionicons name="videocam" size={22} color={colors.primary} />
            </TouchableOpacity>
          )
        : undefined,
    });
  }, [navigation, vet]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Now',
    };
    setMessages((prev) => [...prev, userMessage]);
    setDraft('');

    setTimeout(() => {
      const reply: ChatMessage = {
        id: `v-${Date.now()}`,
        sender: 'vet',
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        time: 'Now',
      };
      setMessages((prev) => [...prev, reply]);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 900);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

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
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.bubble,
                message.sender === 'user' ? styles.bubbleUser : styles.bubbleVet,
              ]}
            >
              <Text style={[styles.bubbleText, message.sender === 'user' && styles.bubbleTextUser]}>
                {message.text}
              </Text>
              <Text style={[styles.bubbleTime, message.sender === 'user' && styles.bubbleTimeUser]}>
                {message.time}
              </Text>
            </View>
          ))}
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
