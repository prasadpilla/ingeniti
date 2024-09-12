import { useAuth } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

import DashboardScreen from './screens/Dashboard';
import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import ProfileScreen from './screens/Profile';
import SettingsScreen from './screens/Settings';
import SignUpScreen from './screens/SignUp';
import VerifySignUpEmailScreen from './screens/VerifySignUpEmail';
import VerifySignUpPhoneScreen from './screens/VerifySignUpPhone';
import { BottomTabNavigationParamList, RootStackNavigationParamList } from './types';

const Tab = createMaterialBottomTabNavigator<BottomTabNavigationParamList>();
function TabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cog" color={color} size={26} />,
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator<RootStackNavigationParamList>();
const Navigation = ({ theme }) => {
  const { isSignedIn } = useAuth();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <Stack.Screen name="DashboardHome" component={TabNavigation} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="VerifySignUpEmail" component={VerifySignUpEmailScreen} />
            <Stack.Screen name="VerifySignUpPhone" component={VerifySignUpPhoneScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
