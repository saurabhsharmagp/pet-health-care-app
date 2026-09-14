import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookLabTestScreen from '../screens/BookLabTestScreen';
import LabTestConfirmBookingScreen from '../screens/LabTestConfirmBookingScreen';
import LabTestConfirmationScreen from '../screens/LabTestConfirmationScreen';
import LabTestDetailScreen from '../screens/LabTestDetailScreen';
import LabTestsListScreen from '../screens/LabTestsListScreen';
import { colors } from '../theme/colors';
import { LabTestsStackParamList } from './types';

const Stack = createNativeStackNavigator<LabTestsStackParamList>();

export default function LabTestsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="LabTestsMain" component={LabTestsListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LabTestDetail" component={LabTestDetailScreen} options={{ title: 'Test Details' }} />
      <Stack.Screen name="BookLabTest" component={BookLabTestScreen} options={{ title: 'Book Test' }} />
      <Stack.Screen name="ConfirmBooking" component={LabTestConfirmBookingScreen} options={{ title: 'Confirm Booking' }} />
      <Stack.Screen
        name="LabTestConfirmation"
        component={LabTestConfirmationScreen}
        options={{ title: 'Confirmation', headerBackVisible: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
