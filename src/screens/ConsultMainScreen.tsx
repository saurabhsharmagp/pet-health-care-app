import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import ScreenContainer from '../components/ScreenContainer';
import { chatThreads, vets } from '../data/mockData';
import { ConsultStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<ConsultStackParamList, 'ConsultMain'>;

export default function ConsultMainScreen({ navigation }: Props) {
  const recentVetIds = Object.keys(chatThreads);
  const recentVets = vets.filter((v) => recentVetIds.includes(v.id));
  const otherVets = vets.filter((v) => !recentVetIds.includes(v.id));

  return (
    <ScreenContainer>
      <Text style={styles.title}>Consult a Vet</Text>
      <Text style={styles.subtitle}>Chat or video call a vet from anywhere</Text>

      {recentVets.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent conversations</Text>
          {recentVets.map((vet) => {
            const lastMessage = chatThreads[vet.id][chatThreads[vet.id].length - 1];
            return (
              <TouchableOpacity
                key={vet.id}
                style={styles.threadRow}
                onPress={() => navigation.navigate('Chat', { vetId: vet.id })}
              >
                <Avatar initial={vet.initial} color={vet.color} size={48} uri={vet.photoUrl} />
                <View style={styles.threadInfo}>
                  <Text style={styles.vetName}>{vet.name}</Text>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {lastMessage.sender === 'user' ? 'You: ' : ''}
                    {lastMessage.text}
                  </Text>
                </View>
                <Text style={styles.time}>{lastMessage.time}</Text>
              </TouchableOpacity>
            );
          })}
        </>
      )}

      <Text style={styles.sectionTitle}>Available vets</Text>
      {otherVets.map((vet) => (
        <View key={vet.id} style={styles.vetRow}>
          <Avatar initial={vet.initial} color={vet.color} size={48} uri={vet.photoUrl} />
          <View style={styles.threadInfo}>
            <Text style={styles.vetName}>{vet.name}</Text>
            <Text style={styles.vetSpecialty}>{vet.specialty}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Payment', { vetId: vet.id, mode: 'chat', amount: vet.priceValue })}
            >
              <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
            {vet.supportsVideo && (
              <TouchableOpacity
                style={[styles.iconButton, styles.videoButton]}
                onPress={() => navigation.navigate('Payment', { vetId: vet.id, mode: 'video', amount: vet.priceValue })}
              >
                <Ionicons name="videocam-outline" size={18} color={colors.accent} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
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
