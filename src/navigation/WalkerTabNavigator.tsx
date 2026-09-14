import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WalkerClientsStackNavigator from './WalkerClientsStackNavigator';
import WalkerDashboardStackNavigator from './WalkerDashboardStackNavigator';
import WalkerMessagesStackNavigator from './WalkerMessagesStackNavigator';
import WalkerWalksStackNavigator from './WalkerWalksStackNavigator';
import { colors } from '../theme/colors';
import { WalkerTabParamList } from './types';

const Tab = createBottomTabNavigator<WalkerTabParamList>();

const iconMap: Record<keyof WalkerTabParamList, keyof typeof Ionicons.glyphMap> = {
  Dashboard: 'grid',
  Walks: 'walk',
  Clients: 'people',
  Messages: 'chatbubbles',
};

export default function WalkerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? iconMap[route.name as keyof WalkerTabParamList] : (`${iconMap[route.name as keyof WalkerTabParamList]}-outline` as keyof typeof Ionicons.glyphMap)}
            color={color}
            size={size}
          />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={WalkerDashboardStackNavigator} />
      <Tab.Screen name="Walks" component={WalkerWalksStackNavigator} />
      <Tab.Screen name="Clients" component={WalkerClientsStackNavigator} />
      <Tab.Screen name="Messages" component={WalkerMessagesStackNavigator} />
    </Tab.Navigator>
  );
}
