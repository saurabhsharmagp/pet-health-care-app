import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DoctorPatientDetailScreen from '../screens/DoctorPatientDetailScreen';
import DoctorPatientsListScreen from '../screens/DoctorPatientsListScreen';
import { colors } from '../theme/colors';
import { DoctorPatientsStackParamList } from './types';

const Stack = createNativeStackNavigator<DoctorPatientsStackParamList>();

export default function DoctorPatientsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="PatientsMain" component={DoctorPatientsListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PatientDetail" component={DoctorPatientDetailScreen} options={{ title: 'Patient' }} />
    </Stack.Navigator>
  );
}
