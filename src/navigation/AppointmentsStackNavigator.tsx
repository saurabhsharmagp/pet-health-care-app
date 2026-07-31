import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppointmentDetailScreen from '../screens/AppointmentDetailScreen';
import AppointmentsListScreen from '../screens/AppointmentsListScreen';
import VetDetailScreen from '../screens/VetDetailScreen';
import { colors } from '../theme/colors';
import { AppointmentsStackParamList } from './types';

const Stack = createNativeStackNavigator<AppointmentsStackParamList>();

export default function AppointmentsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="AppointmentsMain" component={AppointmentsListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} options={{ title: 'Appointment' }} />
      <Stack.Screen name="VetDetail" component={VetDetailScreen} options={{ title: 'Vet Profile' }} />
    </Stack.Navigator>
  );
}
