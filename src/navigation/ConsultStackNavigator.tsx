import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from '../screens/ChatScreen';
import ConsultMainScreen from '../screens/ConsultMainScreen';
import VideoCallScreen from '../screens/VideoCallScreen';
import { colors } from '../theme/colors';
import { ConsultStackParamList } from './types';

const Stack = createNativeStackNavigator<ConsultStackParamList>();

export default function ConsultStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="ConsultMain" component={ConsultMainScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="VideoCall" component={VideoCallScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
