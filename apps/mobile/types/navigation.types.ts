import { MaterialBottomTabScreenProps } from 'react-native-paper';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

type RootStackNavigationParamList = {
  Home: undefined;
  Login: undefined;
  VerifyLoginPhone: {
    phoneNumber: string;
  };
  SignUp: undefined;
  VerifySignUpEmail: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
  };
  VerifySignUpPhone: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  DashboardHome: undefined;
};

type HomeProps = NativeStackScreenProps<RootStackNavigationParamList, 'Home'>;
type LoginProps = NativeStackScreenProps<RootStackNavigationParamList, 'Login'>;
type VerifyLoginPhoneProps = NativeStackScreenProps<
  RootStackNavigationParamList,
  'VerifyLoginPhone'
>;
type SignupProps = NativeStackScreenProps<RootStackNavigationParamList, 'SignUp'>;
type VerifySignUpEmailProps = NativeStackScreenProps<
  RootStackNavigationParamList,
  'VerifySignUpEmail'
>;
type VerifySignUpPhoneProps = NativeStackScreenProps<
  RootStackNavigationParamList,
  'VerifySignUpPhone'
>;
type DashboardHomeProps = NativeStackScreenProps<RootStackNavigationParamList, 'DashboardHome'>;

// bottom tab types
type BottomTabNavigationParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
};

type DashboardProps = MaterialBottomTabScreenProps<BottomTabNavigationParamList, 'Dashboard'>;
type ProfileProps = MaterialBottomTabScreenProps<BottomTabNavigationParamList, 'Profile'>;
type SettingsProps = MaterialBottomTabScreenProps<BottomTabNavigationParamList, 'Settings'>;

export type {
  RootStackNavigationParamList,
  BottomTabNavigationParamList,
  HomeProps,
  LoginProps,
  VerifyLoginPhoneProps,
  SignupProps,
  VerifySignUpEmailProps,
  VerifySignUpPhoneProps,
  DashboardHomeProps,
  DashboardProps,
  ProfileProps,
  SettingsProps,
};
