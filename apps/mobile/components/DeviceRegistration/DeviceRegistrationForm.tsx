import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Background from '../Background';
import Button from '../Button';
import Paragraph from '../Paragraph';
import DeviceDetails from './DeviceDetails/DeviceDetails';
import DeviceProtection from './DeviceProtection';
import BenefitsUtility from './BenefitsUtility';

interface DeviceRegistrationFormProps {
  closeModal: () => void;
}

const DeviceRegistrationForm = ({ closeModal }: DeviceRegistrationFormProps) => {
  return (
    <Background>
      <ScrollView style={styles.scrollViewContainer}>
        <Paragraph style={[styles.successMessage, { color: 'green' }]}>Device scan is successful</Paragraph>
        <Paragraph style={styles.instruction}>
          Please fill the following details to complete the Device Registration process:
        </Paragraph>

        <View style={styles.formSection}>
          <DeviceDetails />
          <DeviceProtection />
          <BenefitsUtility />
        </View>

        <Button mode="contained" style={styles.registerButton} onPress={() => {}}>
          Register Device
        </Button>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    width: '100%',
    paddingVertical: 10,
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
  registerButton: {
    alignItems: 'center',
  },
});

export default DeviceRegistrationForm;
