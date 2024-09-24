import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { z } from 'zod';

import Background from '../Background';
import Button from '../Button';

import Paragraph from '../Paragraph';
import {
  DeviceDetailsSchema,
  ProtectionSchema,
  UtilityBenefitsSchema,
  SmartPanelBenefitsSchema,
} from '../../types/forms.schemas';
import DeviceDetails from './DeviceDetails';

const DeviceRegistrationForm = () => {
  const [activeTab, setActiveTab] = useState('DeviceDetails');
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DeviceDetailsSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Background>
      <ScrollView style={styles.scrollViewContainer}>
        <Paragraph style={[styles.successMessage, { color: 'green' }]}>Device scan is successful</Paragraph>
        <Paragraph style={styles.instruction}>
          Please fill the following details to complete the Device Registration process:
        </Paragraph>

        <DeviceDetails />

        <TouchableOpacity onPress={() => setActiveTab('Protection')} style={styles.tab}>
          <Text style={styles.tabText}>Enable Protection</Text>
        </TouchableOpacity>
        {activeTab === 'Protection' && <View style={styles.formSection}>{/* Add Protection form fields */}</View>}

        <TouchableOpacity onPress={() => setActiveTab('UtilityBenefits')} style={styles.tab}>
          <Text style={styles.tabText}>Enable Benefits from Utility</Text>
        </TouchableOpacity>
        {activeTab === 'UtilityBenefits' && (
          <View style={styles.formSection}>{/* Add Utility Benefits form fields */}</View>
        )}

        <TouchableOpacity onPress={() => setActiveTab('SmartPanelBenefits')} style={styles.tab}>
          <Text style={styles.tabText}>Enable Benefits via Smart Panel</Text>
        </TouchableOpacity>
        {activeTab === 'SmartPanelBenefits' && (
          <View style={styles.formSection}>{/* Add Smart Panel Benefits form fields */}</View>
        )}

        <Button mode="contained" style={styles.registerButton} onPress={handleSubmit(onSubmit)}>
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
  tab: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  formSection: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  registerButton: {
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DeviceRegistrationForm;
