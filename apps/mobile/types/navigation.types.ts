import { MaterialBottomTabScreenProps } from 'react-native-paper';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

type RootStackNavigationParamList = {
  Home: undefined;
  Login: undefined;
  SignUp: undefined;
  VerifySignUpEmail: {
    emailAddress: string;
    phoneNumber: string;
    countryCode: string;
  };
  VerifySignUpPhone: {
    phoneNumber: string;
    countryCode: string;
  };
  DashboardHome: undefined;
};

type HomeProps = NativeStackScreenProps<RootStackNavigationParamList, 'Home'>;
type LoginProps = NativeStackScreenProps<RootStackNavigationParamList, 'Login'>;
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
  SignupProps,
  VerifySignUpEmailProps,
  VerifySignUpPhoneProps,
  DashboardHomeProps,
  DashboardProps,
  ProfileProps,
  SettingsProps,
};
