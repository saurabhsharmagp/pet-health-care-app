import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppointmentsStackNavigator from './AppointmentsStackNavigator';
import ConsultStackNavigator from './ConsultStackNavigator';
import HomeStackNavigator from './HomeStackNavigator';
import LabTestsStackNavigator from './LabTestsStackNavigator';
import WalkingStackNavigator from './WalkingStackNavigator';
import { colors } from '../theme/colors';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const iconMap: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Appointments: 'calendar',
  Consult: 'chatbubbles',
  LabTests: 'flask',
  Walking: 'paw',
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' as const },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? iconMap[route.name as keyof RootTabParamList] : (`${iconMap[route.name as keyof RootTabParamList]}-outline` as keyof typeof Ionicons.glyphMap)}
            color={color}
            size={size}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Appointments" component={AppointmentsStackNavigator} options={{ headerShown: false, title: 'Visits' }} />
      <Tab.Screen
        name="Consult"
        component={ConsultStackNavigator}
        options={({ route }) => {
          const focusedRoute = getFocusedRouteNameFromRoute(route);
          return {
            headerShown: false,
            tabBarStyle:
              focusedRoute === 'VideoCall'
                ? { display: 'none' as const }
                : { backgroundColor: colors.card, borderTopColor: colors.border },
          };
        }}
      />
      <Tab.Screen name="LabTests" component={LabTestsStackNavigator} options={{ headerShown: false, title: 'Labs' }} />
      <Tab.Screen name="Walking" component={WalkingStackNavigator} options={{ headerShown: false, title: 'Walking' }} />
    </Tab.Navigator>
  );
}
