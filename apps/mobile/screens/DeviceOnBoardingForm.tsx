import { View, ScrollView, StyleSheet } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import BenefitsUtility from '../components/DeviceRegistration/BenefitsUtility';
import DeviceDetails from '../components/DeviceRegistration/DeviceDetails/DeviceDetails';
import Paragraph from '../components/Paragraph';
import { DeviceOnBoardingFormProps } from '../types/navigation.types';
import { useState } from 'react';

const DeviceOnBoardingFormScreen: React.FC<DeviceOnBoardingFormProps> = ({ navigation }) => {
  const [isDeviceDetailsOpen, setIsDeviceDetailsOpen] = useState(false);
  const [isDeviceProtectionOpen, setIsDeviceProtectionOpen] = useState(false);
  const [isBenefitsUtilityOpen, setIsBenefitsUtilityOpen] = useState(false);

  return (
    <Background>
      <Paragraph style={[styles.successMessage, { color: 'green' }]}>Device scan is successful</Paragraph>
      <Paragraph style={styles.instruction}>
        Please fill the following details to complete the Device Registration process:
      </Paragraph>

      <View style={styles.formSection}>
        <DeviceDetails />
        {/* <DeviceProtection /> */}
        <BenefitsUtility />
      </View>

      {/* <Button mode="contained" style={styles.registerButton} onPress={() => {}}>
          Register Device
        </Button> */}

      <Button mode="outlined" onPress={() => {}}>
        Register Device
      </Button>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    width: '100%',
    height: '60%',
    backgroundColor: 'red',
  },
  successMessage: {
    fontSize: 20,
    paddingVertical: 10,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'left',
  },
  formSection: {
    rowGap: 10,
  },
});

export default DeviceOnBoardingFormScreen;
