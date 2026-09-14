import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WalkerClientDetailScreen from '../screens/WalkerClientDetailScreen';
import WalkerDashboardScreen from '../screens/WalkerDashboardScreen';
import WalkerProfileScreen from '../screens/WalkerProfileScreen';
import WalkerWalkDetailScreen from '../screens/WalkerWalkDetailScreen';
import { colors } from '../theme/colors';
import { WalkerDashboardStackParamList } from './types';

const Stack = createNativeStackNavigator<WalkerDashboardStackParamList>();

export default function WalkerDashboardStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="DashboardMain" component={WalkerDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={WalkerProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="WalkDetail" component={WalkerWalkDetailScreen} options={{ title: 'Walk Details' }} />
      <Stack.Screen name="ClientDetail" component={WalkerClientDetailScreen} options={{ title: 'Client' }} />
    </Stack.Navigator>
  );
}
