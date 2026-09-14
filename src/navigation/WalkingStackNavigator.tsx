import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookWalkScreen from '../screens/BookWalkScreen';
import WalkConfirmBookingScreen from '../screens/WalkConfirmBookingScreen';
import WalkConfirmationScreen from '../screens/WalkConfirmationScreen';
import WalkDetailScreen from '../screens/WalkDetailScreen';
import WalkerDetailScreen from '../screens/WalkerDetailScreen';
import WalkerListScreen from '../screens/WalkerListScreen';
import WalkingMainScreen from '../screens/WalkingMainScreen';
import { colors } from '../theme/colors';
import { WalkingStackParamList } from './types';

const Stack = createNativeStackNavigator<WalkingStackParamList>();

export default function WalkingStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="WalkingMain" component={WalkingMainScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WalkerList" component={WalkerListScreen} options={{ title: 'Find a Walker' }} />
      <Stack.Screen name="WalkerDetail" component={WalkerDetailScreen} options={{ title: 'Walker Profile' }} />
      <Stack.Screen name="BookWalk" component={BookWalkScreen} options={{ title: 'Book a Walk' }} />
      <Stack.Screen name="ConfirmBooking" component={WalkConfirmBookingScreen} options={{ title: 'Confirm Booking' }} />
      <Stack.Screen
        name="WalkConfirmation"
        component={WalkConfirmationScreen}
        options={{ title: 'Confirmation', headerBackVisible: false, gestureEnabled: false }}
      />
      <Stack.Screen name="WalkDetail" component={WalkDetailScreen} options={{ title: 'Walk Details' }} />
    </Stack.Navigator>
  );
}
