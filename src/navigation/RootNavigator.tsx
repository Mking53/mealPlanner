import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { BaseNavigation } from './BaseNavigation';
import {
  GroceryListScreen,
  HomeScreen,
  PlannerScreen,
  ProfileScreen,
} from '@/src/screens';

type RootTabParamList = {
  Home: undefined;
  Planner: undefined;
  GroceryList: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  return (
    <BaseNavigation>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Planner"
          component={PlannerScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="calendar-month" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="GroceryList"
          component={GroceryListScreen}
          options={{
            title: 'Grocery List',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="shopping-cart" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </BaseNavigation>
  );
}
