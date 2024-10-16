import { Device } from '@ingeniti/shared/dist/schemas/mobile/devices.schema';
import { MaterialBottomTabScreenProps } from 'react-native-paper';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

type RootStackNavigationParamList = {
  Welcome: undefined;
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
  ForgotPassword: undefined;
  MainTabs: undefined;
  DeviceOnBoardingForm: {
    refetchDevices: () => void;
  };
  DeviceDetails: {
    device: Device;
  };
  EnergyUsageChart: undefined;
};

type WelcomeProps = NativeStackScreenProps<RootStackNavigationParamList, 'Welcome'>;
type LoginProps = NativeStackScreenProps<RootStackNavigationParamList, 'Login'>;
type VerifyLoginPhoneProps = NativeStackScreenProps<RootStackNavigationParamList, 'VerifyLoginPhone'>;
type SignupProps = NativeStackScreenProps<RootStackNavigationParamList, 'SignUp'>;
type VerifySignUpEmailProps = NativeStackScreenProps<RootStackNavigationParamList, 'VerifySignUpEmail'>;
type VerifySignUpPhoneProps = NativeStackScreenProps<RootStackNavigationParamList, 'VerifySignUpPhone'>;
type ForgotPasswordProps = NativeStackScreenProps<RootStackNavigationParamList, 'ForgotPassword'>;
type MainTabsProps = NativeStackScreenProps<RootStackNavigationParamList, 'MainTabs'>;
type DeviceOnBoardingFormProps = NativeStackScreenProps<RootStackNavigationParamList, 'DeviceOnBoardingForm'>;
type DeviceDetailsProps = NativeStackScreenProps<RootStackNavigationParamList, 'DeviceDetails'>;
type EnergyUsageChartProps = NativeStackScreenProps<RootStackNavigationParamList, 'EnergyUsageChart'>;
// bottom tab types
type BottomTabNavigationParamList = {
  Home: undefined;
  Notifications: undefined;
  Profile: undefined;
};

type HomeProps = MaterialBottomTabScreenProps<BottomTabNavigationParamList, 'Home'>;
type NotificationsProps = MaterialBottomTabScreenProps<BottomTabNavigationParamList, 'Notifications'>;
type ProfileProps = MaterialBottomTabScreenProps<BottomTabNavigationParamList, 'Profile'>;

export type {
  BottomTabNavigationParamList,
  DeviceDetailsProps,
  DeviceOnBoardingFormProps,
  EnergyUsageChartProps,
  ForgotPasswordProps,
  HomeProps,
  LoginProps,
  MainTabsProps,
  NotificationsProps,
  ProfileProps,
  RootStackNavigationParamList,
  SignupProps,
  VerifyLoginPhoneProps,
  VerifySignUpEmailProps,
  VerifySignUpPhoneProps,
  WelcomeProps,
};
