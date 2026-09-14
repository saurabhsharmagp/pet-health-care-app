import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WalkerClientDetailScreen from '../screens/WalkerClientDetailScreen';
import WalkerClientsListScreen from '../screens/WalkerClientsListScreen';
import { colors } from '../theme/colors';
import { WalkerClientsStackParamList } from './types';

const Stack = createNativeStackNavigator<WalkerClientsStackParamList>();

export default function WalkerClientsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="ClientsMain" component={WalkerClientsListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ClientDetail" component={WalkerClientDetailScreen} options={{ title: 'Client' }} />
    </Stack.Navigator>
  );
}
