import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export default function LandingScreen({ navigation }: Props) {
  return (
    <ImageBackground
      source={{ uri: 'https://loremflickr.com/900/1600/dog,cat,pets?lock=501' }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(6, 12, 12, 0.15)', 'rgba(6, 12, 12, 0.55)', 'rgba(6, 12, 12, 0.94)']}
        locations={[0, 0.55, 1]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safe}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Ionicons name="paw" size={20} color="#ffffff" />
            </View>
            <Text style={styles.brandName}>Kenlo</Text>
          </View>

          <View style={styles.spacer} />

          <View style={styles.bottomContent}>
            <Text style={styles.headline}>Complete care for your pet</Text>
            <Text style={styles.subheadline}>
              Vet visits, online consults, dog walking, medicine and toys — all in one app.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Login', { mode: 'signup' })}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Login', { mode: 'login' })}
            >
              <Text style={styles.secondaryButtonText}>
                Already have an account? <Text style={styles.secondaryButtonTextBold}>Log in</Text>
              </Text>
            </TouchableOpacity>

            <Text style={styles.legal}>By continuing you agree to Kenlo's Terms & Privacy Policy</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0B7A6C',
  },
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
    padding: spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  spacer: {
    flex: 1,
  },
  bottomContent: {
    gap: spacing.sm,
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 38,
  },
  subheadline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    color: '#0B7A6C',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  secondaryButtonTextBold: {
    color: '#ffffff',
    fontWeight: '800',
  },
  legal: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
