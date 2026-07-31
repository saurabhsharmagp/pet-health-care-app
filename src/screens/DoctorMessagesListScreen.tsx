import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import ScreenContainer from '../components/ScreenContainer';
import { DOCTOR_VET_ID, doctorThreads, owners, pets } from '../data/mockData';
import { DoctorMessagesStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<DoctorMessagesStackParamList, 'MessagesMain'>;

export default function DoctorMessagesListScreen({ navigation }: Props) {
  const threads = doctorThreads.filter((t) => t.vetId === DOCTOR_VET_ID);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.subtitle}>Conversations with your patients' owners</Text>

      {threads.map((thread) => {
        const pet = pets.find((p) => p.id === thread.petId)!;
        const owner = owners.find((o) => o.id === pet.ownerId)!;
        const lastMessage = thread.messages[thread.messages.length - 1];
        return (
          <TouchableOpacity
            key={thread.id}
            style={styles.threadRow}
            onPress={() => navigation.navigate('Chat', { threadId: thread.id })}
          >
            <Avatar initial={pet.initial} color={pet.color} size={48} uri={pet.photoUrl} />
            <View style={styles.threadInfo}>
              <Text style={styles.name}>{owner.name}</Text>
              <Text style={styles.petName}>{pet.name}'s owner</Text>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {lastMessage.sender === 'vet' ? 'You: ' : ''}
                {lastMessage.text}
              </Text>
            </View>
            <Text style={styles.time}>{lastMessage.time}</Text>
          </TouchableOpacity>
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
