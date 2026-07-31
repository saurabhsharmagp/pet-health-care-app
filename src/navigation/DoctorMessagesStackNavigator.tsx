import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DoctorChatScreen from '../screens/DoctorChatScreen';
import DoctorMessagesListScreen from '../screens/DoctorMessagesListScreen';
import { colors } from '../theme/colors';
import { DoctorMessagesStackParamList } from './types';

const Stack = createNativeStackNavigator<DoctorMessagesStackParamList>();

export default function DoctorMessagesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="MessagesMain" component={DoctorMessagesListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={DoctorChatScreen} />
    </Stack.Navigator>
  );
}
