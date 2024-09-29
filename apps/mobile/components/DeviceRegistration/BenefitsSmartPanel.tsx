import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';

import {
  countryOptions,
  smartPanelConnectionStatusOptions,
  utilityOptions,
} from '../../utils/dropdownOptions';
import Dropdown from '../Dropdown';
import FormInput from '../FormInput';

const benefitsUtilityForConnectedDeviceFormSchema = z.object({
  isConnectedToPrimaryDevice: z.enum(['Connected', 'No']),
  utility: z.string().min(1, 'Utility is required'),
  country: z.string().min(1, 'Country is required'),
  meterServiceID: z.string().min(1, 'Meter Service ID is required'),
  maxLoad: z.number().min(1, 'Max Load is required'),
});

const benefitsUtilityForNoDeviceFormSchema = z.object({
  isConnectedToPrimaryDevice: z.enum(['Connected', 'No']),
  deviceIdentifier: z.string().min(1, 'Device Identifier is required'),
});

type BenefitsUtilityForConnectedDeviceForm = z.infer<
  typeof benefitsUtilityForConnectedDeviceFormSchema
>;
type BenefitsUtilityForNoDeviceForm = z.infer<typeof benefitsUtilityForNoDeviceFormSchema>;

const BenefitsSmartPanel = () => {
  const [isConnectedToPrimaryDevice, setIsConnectedToPrimaryDevice] = useState(false);

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

  const NoDeviceForm = useForm<BenefitsUtilityForNoDeviceForm>({
    resolver: zodResolver(benefitsUtilityForNoDeviceFormSchema),
    defaultValues: {
      isConnectedToPrimaryDevice: 'No',
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
                    if (value === 'No') {
                      setIsConnectedToPrimaryDevice(false);
                      onChange('No');
                    } else {
                      setIsConnectedToPrimaryDevice(true);
                      onChange('Yes');
                    }
                  }}
                  placeholder="Device Connection Method"
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
            name="meterServiceID"
            render={({ field: { value, onChange, onBlur } }) => (
              <FormInput
                label="Meter / Service ID"
                placeholder="Enter Meter / Service ID"
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
                label="Max Load (kW)"
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
            control={NoDeviceForm.control}
            name="isConnectedToPrimaryDevice"
            render={({ field: { value, onChange } }) => (
              <View style={styles.dropdownContainer}>
                <Dropdown
                  options={smartPanelConnectionStatusOptions}
                  selectedValue={value}
                  onSelect={(value) => {
                    if (value === 'No') {
                      setIsConnectedToPrimaryDevice(false);
                      onChange('No');
                    } else {
                      setIsConnectedToPrimaryDevice(true);
                      onChange('Yes');
                    }
                  }}
                  placeholder="Connected to Primary Device"
                />
              </View>
            )}
          />
          <Controller
            control={NoDeviceForm.control}
            name="deviceIdentifier"
            render={({ field: { value, onChange, onBlur } }) => (
              <FormInput
                label="Primary Device Name"
                placeholder="Enter Primary Device Name If Any"
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
