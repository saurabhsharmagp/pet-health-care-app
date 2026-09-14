import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WalkerClientDetailScreen from '../screens/WalkerClientDetailScreen';
import WalkerWalkDetailScreen from '../screens/WalkerWalkDetailScreen';
import WalkerWalksListScreen from '../screens/WalkerWalksListScreen';
import { colors } from '../theme/colors';
import { WalkerWalksStackParamList } from './types';

const Stack = createNativeStackNavigator<WalkerWalksStackParamList>();

export default function WalkerWalksStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="WalksMain" component={WalkerWalksListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WalkDetail" component={WalkerWalkDetailScreen} options={{ title: 'Walk Details' }} />
      <Stack.Screen name="ClientDetail" component={WalkerClientDetailScreen} options={{ title: 'Client' }} />
    </Stack.Navigator>
  );
}
