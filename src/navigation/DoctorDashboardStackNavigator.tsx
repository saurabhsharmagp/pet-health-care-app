import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DoctorAppointmentDetailScreen from '../screens/DoctorAppointmentDetailScreen';
import DoctorDashboardScreen from '../screens/DoctorDashboardScreen';
import DoctorPatientDetailScreen from '../screens/DoctorPatientDetailScreen';
import DoctorProfileScreen from '../screens/DoctorProfileScreen';
import { colors } from '../theme/colors';
import { DoctorDashboardStackParamList } from './types';

const Stack = createNativeStackNavigator<DoctorDashboardStackParamList>();

export default function DoctorDashboardStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="DashboardMain" component={DoctorDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={DoctorProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="AppointmentDetail" component={DoctorAppointmentDetailScreen} options={{ title: 'Appointment' }} />
      <Stack.Screen name="PatientDetail" component={DoctorPatientDetailScreen} options={{ title: 'Patient' }} />
    </Stack.Navigator>
  );
}
