import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WalkerChatScreen from '../screens/WalkerChatScreen';
import WalkerMessagesListScreen from '../screens/WalkerMessagesListScreen';
import { colors } from '../theme/colors';
import { WalkerMessagesStackParamList } from './types';

const Stack = createNativeStackNavigator<WalkerMessagesStackParamList>();

export default function WalkerMessagesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="MessagesMain" component={WalkerMessagesListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={WalkerChatScreen} />
    </Stack.Navigator>
  );
}
