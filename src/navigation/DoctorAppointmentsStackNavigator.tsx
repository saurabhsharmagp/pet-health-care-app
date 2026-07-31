import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DoctorAppointmentDetailScreen from '../screens/DoctorAppointmentDetailScreen';
import DoctorAppointmentsListScreen from '../screens/DoctorAppointmentsListScreen';
import DoctorPatientDetailScreen from '../screens/DoctorPatientDetailScreen';
import { colors } from '../theme/colors';
import { DoctorAppointmentsStackParamList } from './types';

const Stack = createNativeStackNavigator<DoctorAppointmentsStackParamList>();

export default function DoctorAppointmentsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="AppointmentsMain" component={DoctorAppointmentsListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AppointmentDetail" component={DoctorAppointmentDetailScreen} options={{ title: 'Appointment' }} />
      <Stack.Screen name="PatientDetail" component={DoctorPatientDetailScreen} options={{ title: 'Patient' }} />
    </Stack.Navigator>
  );
}
