import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddPetScreen from '../screens/AddPetScreen';
import AppointmentConfirmationScreen from '../screens/AppointmentConfirmationScreen';
import AppointmentConfirmBookingScreen from '../screens/AppointmentConfirmBookingScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VetDetailScreen from '../screens/VetDetailScreen';
import VetListScreen from '../screens/VetListScreen';
import { colors } from '../theme/colors';
import { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="AddPet" component={AddPetScreen} options={{ title: 'Add a Pet' }} />
      <Stack.Screen name="VetList" component={VetListScreen} options={{ title: 'Find a Vet' }} />
      <Stack.Screen name="VetDetail" component={VetDetailScreen} options={{ title: 'Vet Profile' }} />
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} options={{ title: 'Book Appointment' }} />
      <Stack.Screen name="ConfirmBooking" component={AppointmentConfirmBookingScreen} options={{ title: 'Confirm Booking' }} />
      <Stack.Screen
        name="AppointmentConfirmation"
        component={AppointmentConfirmationScreen}
        options={{ title: 'Confirmation', headerBackVisible: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
