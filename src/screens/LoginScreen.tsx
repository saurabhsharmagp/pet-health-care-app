import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
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
import Button from '../components/Button';
import { useAuth } from '../lib/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// Seeded by scripts/seed-demo-data.mjs — real accounts, safe to show publicly
// since they're clearly labeled as demo logins.
const DEMO_PASSWORD = 'Kennelo!Demo123';
const DEMO_OWNER_EMAIL = 'saurabhsharmagp@yahoo.com';
const DEMO_VET_EMAIL = 'dr.anjali.rao@kennelo.demo';
const DEMO_WALKER_EMAIL = 'aditya.bose@kennelo.demo';

export default function LoginScreen({ navigation, route }: Props) {
  const { signIn, signUp } = useAuth();
  const [role, setRole] = useState<'owner' | 'vet' | 'walker'>('owner');
  const [mode, setMode] = useState<'login' | 'signup'>(route.params?.mode ?? 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isVet = role === 'vet';
  const isWalker = role === 'walker';
  const isProfessional = isVet || isWalker;
  const isSignup = mode === 'signup' && !isProfessional;
  const canSubmit = email.trim().length > 0 && password.trim().length > 0 && (!isSignup || name.trim().length > 0);

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setError(null);
    setSubmitting(true);
    const result = isSignup
      ? await signUp({ email: email.trim(), password, name: name.trim() })
      : await signIn(email.trim(), password);
    setSubmitting(false);
    if (result.error) setError(result.error);
    // On success, AuthContext picks up the new session and RootNavigator
    // swaps to the right portal automatically — nothing to navigate here.
  };

  const handleDemoLogin = async () => {
    setError(null);
    setSubmitting(true);
    const demoEmail = isVet ? DEMO_VET_EMAIL : isWalker ? DEMO_WALKER_EMAIL : DEMO_OWNER_EMAIL;
    const result = await signIn(demoEmail, DEMO_PASSWORD);
    setSubmitting(false);
    if (result.error) setError(result.error);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Ionicons name="paw" size={20} color="#ffffff" />
            </View>
            <Text style={styles.brandName}>Kennelo</Text>
          </View>

          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleCard, role === 'owner' && styles.roleCardActive]}
              onPress={() => {
                setRole('owner');
                setError(null);
              }}
            >
              <Ionicons name="paw-outline" size={20} color={role === 'owner' ? colors.primary : colors.textMuted} />
              <Text style={[styles.roleText, role === 'owner' && styles.roleTextActive]}>Pet Owner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleCard, isVet && styles.roleCardActive]}
              onPress={() => {
                setRole('vet');
                setMode('login');
                setError(null);
              }}
            >
              <Ionicons name="medkit-outline" size={20} color={isVet ? colors.primary : colors.textMuted} />
              <Text style={[styles.roleText, isVet && styles.roleTextActive]}>Vet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleCard, isWalker && styles.roleCardActive]}
              onPress={() => {
                setRole('walker');
                setMode('login');
                setError(null);
              }}
            >
              <Ionicons name="walk-outline" size={20} color={isWalker ? colors.primary : colors.textMuted} />
              <Text style={[styles.roleText, isWalker && styles.roleTextActive]}>Walker</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>
            {isVet ? 'Doctor Login' : isWalker ? 'Walker Login' : isSignup ? 'Create your account' : 'Welcome back'}
          </Text>
          <Text style={styles.subtitle}>
            {isVet
              ? 'Access your schedule, patients, and messages.'
              : isWalker
              ? 'Access your walks, clients, and messages.'
              : isSignup
              ? 'Sign up to start booking vet visits and caring for your pets.'
              : 'Log in to manage your pets and appointments.'}
          </Text>

          {isProfessional ? (
            <View style={styles.professionalNote}>
              <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
              <Text style={styles.professionalNoteText}>
                Vet and walker accounts are set up by the Kennelo team after background checks — log in with the
                credentials you were given.
              </Text>
            </View>
          ) : (
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tab, !isSignup && styles.tabActive]}
                onPress={() => {
                  setMode('login');
                  setError(null);
                }}
              >
                <Text style={[styles.tabText, !isSignup && styles.tabTextActive]}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, isSignup && styles.tabActive]}
                onPress={() => {
                  setMode('signup');
                  setError(null);
                }}
              >
                <Text style={[styles.tabText, isSignup && styles.tabTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}

          {isSignup && (
            <View style={styles.field}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            label={isSignup ? 'Create Account' : 'Log In'}
            onPress={handleSubmit}
            disabled={!canSubmit || submitting}
            loading={submitting}
            style={styles.submitButton}
          />

          <TouchableOpacity style={styles.guestButton} onPress={handleDemoLogin} disabled={submitting}>
            <Text style={styles.guestButtonText}>
              {isVet
                ? 'Continue as Dr. Anjali Rao (Demo)'
                : isWalker
                ? 'Continue as Aditya Bose (Demo)'
                : 'Continue as Saurabh Sharma (Demo)'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.lg,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  roleCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  roleCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  roleTextActive: {
    color: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 6,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  professionalNote: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  professionalNoteText: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: '#fff',
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  guestButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
