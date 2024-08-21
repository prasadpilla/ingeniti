import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import DashboardScreen from './screens/Dashboard';
import ProfileScreen from './screens/Profile';
import SettingsScreen from './screens/Settings';
import { useAuth } from '@clerk/clerk-expo';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';

const Tab = createMaterialBottomTabNavigator();
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

const Stack = createStackNavigator();

const Navigation = ({ theme }) => {
  const { isSignedIn } = useAuth();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        {isSignedIn ? (
          <Stack.Screen name="Dashboard" component={TabNavigation} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
