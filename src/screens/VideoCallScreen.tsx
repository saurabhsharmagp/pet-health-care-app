import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import { getVet, VetDirectoryEntry } from '../api/professionals';
import { vetToCardView } from '../lib/viewModels';
import { ConsultStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<ConsultStackParamList, 'VideoCall'>;

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function VideoCallScreen({ route, navigation }: Props) {
  const [vet, setVet] = useState<VetDirectoryEntry | null>(null);
  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  useEffect(() => {
    getVet(route.params.vetId).then(setVet);
  }, [route.params.vetId]);

  useEffect(() => {
    const connectTimer = setTimeout(() => setConnected(true), 2000);
    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [connected]);

  if (!vet) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color="#fff" style={{ marginTop: spacing.xl }} />
      </SafeAreaView>
    );
  }

  const view = vetToCardView(vet);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.remoteArea}>
        <Avatar initial={view.initial} color="#ffffff" size={110} uri={view.photoUrl} />
        <Text style={styles.vetName}>{view.name}</Text>
        <Text style={styles.status}>{connected ? formatDuration(seconds) : 'Connecting...'}</Text>
      </View>

      <View style={styles.selfPreview}>
        <Ionicons name={cameraOff ? 'videocam-off' : 'person'} size={28} color="#fff" />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, muted && styles.controlButtonActive]}
          onPress={() => setMuted((m) => !m)}
        >
          <Ionicons name={muted ? 'mic-off' : 'mic'} size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.endCallButton} onPress={() => navigation.goBack()}>
          <Ionicons name="call" size={26} color="#fff" style={styles.endCallIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, cameraOff && styles.controlButtonActive]}
          onPress={() => setCameraOff((c) => !c)}
        >
          <Ionicons name={cameraOff ? 'videocam-off' : 'videocam'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#12181B',
  },
  remoteArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vetName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  status: {
    color: '#A8B3B8',
    fontSize: 14,
    marginTop: 6,
  },
  selfPreview: {
    position: 'absolute',
    top: 24,
    right: 20,
    width: 90,
    height: 120,
    borderRadius: radius.md,
    backgroundColor: '#25302F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3A4548',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2C3639',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#4A5559',
  },
  endCallButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E63946',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallIcon: {
    transform: [{ rotate: '135deg' }],
  },
});
