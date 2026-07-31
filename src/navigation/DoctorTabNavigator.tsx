import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DoctorAppointmentsStackNavigator from './DoctorAppointmentsStackNavigator';
import DoctorDashboardStackNavigator from './DoctorDashboardStackNavigator';
import DoctorMessagesStackNavigator from './DoctorMessagesStackNavigator';
import DoctorPatientsStackNavigator from './DoctorPatientsStackNavigator';
import { colors } from '../theme/colors';
import { DoctorTabParamList } from './types';

const Tab = createBottomTabNavigator<DoctorTabParamList>();

const iconMap: Record<keyof DoctorTabParamList, keyof typeof Ionicons.glyphMap> = {
  Dashboard: 'grid',
  Appointments: 'calendar',
  Patients: 'people',
  Messages: 'chatbubbles',
};

export default function DoctorTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? iconMap[route.name as keyof DoctorTabParamList] : (`${iconMap[route.name as keyof DoctorTabParamList]}-outline` as keyof typeof Ionicons.glyphMap)}
            color={color}
            size={size}
          />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DoctorDashboardStackNavigator} />
      <Tab.Screen name="Appointments" component={DoctorAppointmentsStackNavigator} options={{ title: 'Visits' }} />
      <Tab.Screen name="Patients" component={DoctorPatientsStackNavigator} />
      <Tab.Screen name="Messages" component={DoctorMessagesStackNavigator} />
    </Tab.Navigator>
  );
}
