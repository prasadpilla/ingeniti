import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, TextInput } from 'react-native-paper';
import Paragraph from '../../Paragraph';
import FormSection from '../FormSection';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import FormInput from '../../FormInput';
import DeviceTypePicker from './DeviceTypePicker';
import DeviceUsagePicker from './DeviceUsagePicker';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeviceDetailsForm, deviceDetailsFormSchema } from '../../../types/forms.schemas';

const DeviceDetails = () => {
  const theme = useTheme();

  const deviceDetailsForm = useForm<DeviceDetailsForm>({
    resolver: zodResolver(deviceDetailsFormSchema),
    defaultValues: {
      deviceSerial: '',
      deviceUsage: 'Select an option',
      deviceType: 'Select an option',
      deviceName: '',
      deviceIdentifier: '',
      deviceLocation: '',
      averageEnergyCost: 0,
    },
    mode: 'onBlur',
  });

  const deviceUsageOptions = [
    { label: 'Usage 1', value: 'usage1' },
    { label: 'Usage 2', value: 'usage2' },
  ];

  const deviceTypeOptions = [
    { label: 'Type 1', value: 'type1' },
    { label: 'Type 2', value: 'type2' },
  ];

  return (
    <FormSection sectionTitle="Device Details" isOpen={true}>
      <View style={styles.fieldItems}>
        <Controller
          control={deviceDetailsForm.control}
          name="deviceSerial"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormInput
              label="Device Serial #"
              placeholder="Enter Device Serial #"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyles={styles.input}
            />
          )}
        />
        <Controller
          control={deviceDetailsForm.control}
          name="deviceUsage"
          render={({ field: { value, onChange, onBlur } }) => (
            <View style={styles.dropdownContainer}>
              <DeviceUsagePicker selectedUsage={value} onSelectUsage={onChange} />
            </View>
          )}
        />

        <Controller
          control={deviceDetailsForm.control}
          name="deviceType"
          render={({ field: { value, onChange, onBlur } }) => (
            <View style={styles.dropdownContainer}>
              <DeviceTypePicker selectedType={value} onSelectType={onChange} />
            </View>
          )}
        />

        <Controller
          control={deviceDetailsForm.control}
          name="deviceName"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormInput
              label="Device Name"
              placeholder="Enter Device Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyles={styles.input}
            />
          )}
        />
        <Controller
          control={deviceDetailsForm.control}
          name="deviceIdentifier"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormInput
              label="Device Name"
              placeholder="Enter Device Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyles={styles.input}
            />
          )}
        />
        <Controller
          control={deviceDetailsForm.control}
          name="deviceLocation"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormInput
              label="Device Location"
              placeholder="Enter Device Location"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyles={styles.input}
            />
          )}
        />
        <View style={styles.averageEnergyCost}>
          <Controller
            control={deviceDetailsForm.control}
            name="averageEnergyCost"
            render={({ field: { value, onChange, onBlur } }) => (
              <FormInput
                label="Average Energy Cost"
                placeholder="Enter Average Energy Cost"
                value={value.toString()}
                onChangeText={onChange}
                onBlur={onBlur}
                containerStyles={styles.input}
              />
            )}
          />
        </View>
      </View>
    </FormSection>
  );
};

const styles = StyleSheet.create({
  fieldItems: {
    rowGap: 0,
  },
  fieldItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    marginVertical: 6,
  },
  dropdownContainer: {
    marginVertical: 6,
  },

  averageEnergyCost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default DeviceDetails;
