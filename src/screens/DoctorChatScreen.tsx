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
import { ChatMessage, doctorThreads, owners, pets } from '../data/mockData';
import { DoctorMessagesStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<DoctorMessagesStackParamList, 'Chat'>;

const AUTO_REPLIES = [
  "Thank you, doctor! We'll keep an eye on that.",
  'Got it, we will follow your advice.',
  'Should we come in for a visit, or is this fine to monitor at home?',
  'Thanks for the quick reply!',
];

export default function DoctorChatScreen({ route, navigation }: Props) {
  const thread = doctorThreads.find((t) => t.id === route.params.threadId)!;
  const pet = pets.find((p) => p.id === thread.petId)!;
  const owner = owners.find((o) => o.id === pet.ownerId)!;
  const [messages, setMessages] = useState<ChatMessage[]>(thread.messages);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: `${owner.name}` });
  }, [navigation, owner]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    const doctorMessage: ChatMessage = {
      id: `v-${Date.now()}`,
      sender: 'vet',
      text,
      time: 'Now',
    };
    setMessages((prev) => [...prev, doctorMessage]);
    setDraft('');

    setTimeout(() => {
      const reply: ChatMessage = {
        id: `u-${Date.now()}`,
        sender: 'user',
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
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Re: {pet.name} ({pet.breed})</Text>
      </View>
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
          {messages.map((message) => {
            const isSelf = message.sender === 'vet';
            return (
              <View key={message.id} style={[styles.bubble, isSelf ? styles.bubbleSelf : styles.bubbleOther]}>
                <Text style={[styles.bubbleText, isSelf && styles.bubbleTextSelf]}>{message.text}</Text>
                <Text style={[styles.bubbleTime, isSelf && styles.bubbleTimeSelf]}>{message.time}</Text>
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
