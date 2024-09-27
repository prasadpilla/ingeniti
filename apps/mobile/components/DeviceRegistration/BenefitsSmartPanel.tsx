import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import { z } from 'zod';

import { utilityOptions, countryOptions, smartPanelConnectionStatusOptions } from '../../utils/dropdownOptions';
import Dropdown from '../Dropdown';
import FormInput from '../FormInput';

const benefitsUtilityForConnectedDeviceFormSchema = z.object({
  isConnectedToPrimaryDevice: z.enum(['Connected', 'Disconnected']),
  utility: z.string().min(1, 'Utility is required'),
  country: z.string().min(1, 'Country is required'),
  meterServiceID: z.string().min(1, 'Meter Service ID is required'),
  maxLoad: z.number().min(1, 'Max Load is required'),
});

const benefitsUtilityForDisconnectedDeviceFormSchema = z.object({
  isConnectedToPrimaryDevice: z.enum(['Connected', 'Disconnected']),
  deviceIdentifier: z.string().min(1, 'Device Identifier is required'),
});

type BenefitsUtilityForConnectedDeviceForm = z.infer<typeof benefitsUtilityForConnectedDeviceFormSchema>;
type BenefitsUtilityForDisconnectedDeviceForm = z.infer<typeof benefitsUtilityForDisconnectedDeviceFormSchema>;

const BenefitsSmartPanel = () => {
  const [isConnectedToPrimaryDevice, setIsConnectedToPrimaryDevice] = useState(true);

  const connectedDeviceForm = useForm<BenefitsUtilityForConnectedDeviceForm>({
    resolver: zodResolver(benefitsUtilityForConnectedDeviceFormSchema),
    defaultValues: {
      isConnectedToPrimaryDevice: 'Connected',
      utility: '',
      country: '',
      meterServiceID: '',
      maxLoad: 0,
    },
    mode: 'onBlur',
  });

  const disconnectedDeviceForm = useForm<BenefitsUtilityForDisconnectedDeviceForm>({
    resolver: zodResolver(benefitsUtilityForDisconnectedDeviceFormSchema),
    defaultValues: {
      isConnectedToPrimaryDevice: 'Disconnected',
      deviceIdentifier: '',
    },
    mode: 'onBlur',
  });

  return (
    <View style={styles.fieldItems}>
      {isConnectedToPrimaryDevice ? (
        <>
          <Controller
            control={connectedDeviceForm.control}
            name="isConnectedToPrimaryDevice"
            render={({ field: { value, onChange } }) => (
              <View style={styles.dropdownContainer}>
                <Dropdown
                  options={smartPanelConnectionStatusOptions}
                  selectedValue={value}
                  onSelect={(value) => {
                    if (value === 'Disconnected') {
                      setIsConnectedToPrimaryDevice(false);
                      onChange('Disconnected');
                    } else {
                      setIsConnectedToPrimaryDevice(true);
                      onChange('Connected');
                    }
                  }}
                  placeholder="Connected to Primary Device"
                />
              </View>
            )}
          />
          <Controller
            control={connectedDeviceForm.control}
            name="utility"
            render={({ field: { value, onChange } }) => (
              <View style={styles.dropdownContainer}>
                <Dropdown
                  options={utilityOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  placeholder="Select Utility"
                />
              </View>
            )}
          />
          <Controller
            control={connectedDeviceForm.control}
            name="country"
            render={({ field: { value, onChange } }) => (
              <View style={styles.dropdownContainer}>
                <Dropdown
                  options={countryOptions}
                  selectedValue={value}
                  onSelect={onChange}
                  placeholder="Select Country"
                />
              </View>
            )}
          />
          <Controller
            control={connectedDeviceForm.control}
            name="meterServiceID"
            render={({ field: { value, onChange, onBlur } }) => (
              <FormInput
                label="Meter Service ID"
                placeholder="Enter Meter Service ID"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                containerStyles={styles.input}
              />
            )}
          />
          <Controller
            control={connectedDeviceForm.control}
            name="maxLoad"
            render={({ field: { value, onChange } }) => (
              <FormInput
                label="Max Load"
                placeholder="Enter Max Load"
                value={value.toString()}
                onChangeText={onChange}
                containerStyles={styles.input}
              />
            )}
          />
        </>
      ) : (
        <>
          <Controller
            control={disconnectedDeviceForm.control}
            name="isConnectedToPrimaryDevice"
            render={({ field: { value, onChange } }) => (
              <View style={styles.dropdownContainer}>
                <Dropdown
                  options={smartPanelConnectionStatusOptions}
                  selectedValue={value}
                  onSelect={(value) => {
                    if (value === 'Disconnected') {
                      setIsConnectedToPrimaryDevice(false);
                      onChange('Disconnected');
                    } else {
                      setIsConnectedToPrimaryDevice(true);
                      onChange('Connected');
                    }
                  }}
                  placeholder="Connected to Primary Device"
                />
              </View>
            )}
          />
          <Controller
            control={disconnectedDeviceForm.control}
            name="deviceIdentifier"
            render={({ field: { value, onChange, onBlur } }) => (
              <FormInput
                label="Identifier"
                placeholder="Enter Device Identifier"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                containerStyles={styles.input}
              />
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldItems: {
    rowGap: 0,
  },
  input: {
    marginVertical: 6,
  },
  dropdownContainer: {
    marginVertical: 8,
  },
});

export default BenefitsSmartPanel;
