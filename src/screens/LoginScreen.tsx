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
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation, route }: Props) {
  const [role, setRole] = useState<'owner' | 'vet'>('owner');
  const [mode, setMode] = useState<'login' | 'signup'>(route.params?.mode ?? 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isVet = role === 'vet';
  const isSignup = mode === 'signup';
  const canSubmit = email.trim().length > 0 && password.trim().length > 0 && (!isSignup || name.trim().length > 0);

  const enterApp = () => {
    navigation.reset({ index: 0, routes: [{ name: isVet ? 'DoctorTabs' : 'MainTabs' }] });
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
            <Text style={styles.brandName}>Kenlo</Text>
          </View>

          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleCard, !isVet && styles.roleCardActive]}
              onPress={() => setRole('owner')}
            >
              <Ionicons name="paw-outline" size={20} color={!isVet ? colors.primary : colors.textMuted} />
              <Text style={[styles.roleText, !isVet && styles.roleTextActive]}>Pet Owner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleCard, isVet && styles.roleCardActive]}
              onPress={() => setRole('vet')}
            >
              <Ionicons name="medkit-outline" size={20} color={isVet ? colors.primary : colors.textMuted} />
              <Text style={[styles.roleText, isVet && styles.roleTextActive]}>Vet</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>
            {isVet ? 'Doctor Login' : isSignup ? 'Create your account' : 'Welcome back'}
          </Text>
          <Text style={styles.subtitle}>
            {isVet
              ? 'Access your schedule, patients, and messages.'
              : isSignup
              ? 'Sign up to start booking vet visits and caring for your pets.'
              : 'Log in to manage your pets and appointments.'}
          </Text>

          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, !isSignup && styles.tabActive]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.tabText, !isSignup && styles.tabTextActive]}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, isSignup && styles.tabActive]}
              onPress={() => setMode('signup')}
            >
              <Text style={[styles.tabText, isSignup && styles.tabTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

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

          <Button
            label={isVet ? 'Log In' : isSignup ? 'Create Account' : 'Log In'}
            onPress={enterApp}
            disabled={!canSubmit}
            style={styles.submitButton}
          />

          <TouchableOpacity style={styles.guestButton} onPress={enterApp}>
            <Text style={styles.guestButtonText}>
              {isVet ? 'Continue as Dr. Anjali Rao (Demo)' : 'Continue as Guest'}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
    fontSize: 14,
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
