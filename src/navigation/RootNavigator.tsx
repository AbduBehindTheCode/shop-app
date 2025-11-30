import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens will be imported here
// import CategoriesScreen from '../screens/CategoriesScreen';
// import CartScreen from '../screens/CartScreen';
// import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CategoriesStack = () => {
  return (
    <Stack.Navigator>
      {/* Screens will be added here */}
    </Stack.Navigator>
  );
};

const CartStack = () => {
  return (
    <Stack.Navigator>
      {/* Screens will be added here */}
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      {/* Screens will be added here */}
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        {/* Tab screens will be added here */}
      </Tab.Navigator>
    </NavigationContainer>
  );
};
