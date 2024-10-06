import { useAuth } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

import DeviceOnBoardingFormScreen from './screens/DeviceOnBoardingForm';
import ForgotPasswordScreen from './screens/ForgotPassword';
import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import Notifications from './screens/Notifications';
import ProfileScreen from './screens/Profile';
import SignUpScreen from './screens/SignUp';
import VerifyLoginPhoneScreen from './screens/VerifyLoginPhone';
import VerifySignUpEmailScreen from './screens/VerifySignUpEmail';
import VerifySignUpPhoneScreen from './screens/VerifySignUpPhone';
import WelcomeScreen from './screens/Welcome';
import { BottomTabNavigationParamList, RootStackNavigationParamList } from './types';

const Tab = createMaterialBottomTabNavigator<BottomTabNavigationParamList>();
function TabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="bell" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" color={color} size={26} />,
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator<RootStackNavigationParamList>();
const Navigation = ({ theme }: { theme: Theme }) => {
  const { isSignedIn } = useAuth();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isSignedIn ? (
          <>
            <Stack.Screen name="Home" component={TabNavigation} />
            <Stack.Screen name="DeviceOnBoardingForm" component={DeviceOnBoardingFormScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="VerifyLoginPhone" component={VerifyLoginPhoneScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="VerifySignUpEmail" component={VerifySignUpEmailScreen} />
            <Stack.Screen name="VerifySignUpPhone" component={VerifySignUpPhoneScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
