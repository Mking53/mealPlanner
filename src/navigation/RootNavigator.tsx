import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { BaseNavigation } from './BaseNavigation';
import { ProfileNavigator } from './ProfileNavigator';
import { AuthScreen, GroceryListScreen, HomeScreen, MyKitchenScreen, PlannerScreen } from '@/src/screens';
import { MealPlannerProvider, useAuth } from '@/src/state';

type RootTabParamList = {
  Home: undefined;
  Planner: undefined;
  GroceryList: undefined;
  MyKitchen: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  const { createAccount, isAuthenticated, signIn } = useAuth();

  if (!isAuthenticated) {
    return (
      <BaseNavigation>
        <AuthScreen onSignIn={signIn} onCreateAccount={createAccount} />
      </BaseNavigation>
    );
  }

  return (
    <MealPlannerProvider>
      <BaseNavigation>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
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
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="MyKitchen"
            component={MyKitchenScreen}
            options={{
              title: 'My Kitchen',
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="kitchen" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileNavigator}
            options={{
              tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />,
            }}
          />
        </Tab.Navigator>
      </BaseNavigation>
    </MealPlannerProvider>
  );
}
