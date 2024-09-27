import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { z } from 'zod';

import FormInput from '../FormInput';

const deviceProtectionFormSchema = z.object({
  minOffTime: z.string().min(1),
  brownOutVoltageChange: z.string().min(1),
  brownOutFrequencyChange: z.string().min(1),
});

type DeviceProtectionForm = z.infer<typeof deviceProtectionFormSchema>;

const DeviceProtection = () => {
  const deviceProtectionForm = useForm<DeviceProtectionForm>({
    resolver: zodResolver(deviceProtectionFormSchema),
    defaultValues: {
      minOffTime: '3',
      brownOutVoltageChange: '',
      brownOutFrequencyChange: '',
    },
    mode: 'onBlur',
  });

  return (
    <View style={styles.fieldItems}>
      <Controller
        control={deviceProtectionForm.control}
        name="minOffTime"
        render={({ field: { value, onChange, onBlur } }) => (
          <FormInput
            label="Minimum Off-Time (minutes)"
            placeholder="3"
            value={value.toString()}
            onChangeText={(text) => onChange(Number(text))}
            onBlur={onBlur}
            containerStyles={styles.input}
            keyboardType="numeric"
          />
        )}
      />
      <Text variant="titleMedium" style={styles.advancedSettingsLabel}>
        Advanced Settings
      </Text>
      <Controller
        control={deviceProtectionForm.control}
        name="brownOutVoltageChange"
        render={({ field: { value, onChange, onBlur } }) => (
          <FormInput
            label="Power off if voltage changes by"
            placeholder="20%"
            value={value.toString()}
            onChangeText={(text) => onChange(Number(text))}
            onBlur={onBlur}
            containerStyles={styles.input}
            keyboardType="numeric"
          />
        )}
      />
      <Controller
        control={deviceProtectionForm.control}
        name="brownOutFrequencyChange"
        render={({ field: { value, onChange, onBlur } }) => (
          <FormInput
            label="Power off if frequency changes by"
            placeholder="4 Hz"
            value={value.toString()}
            onChangeText={(text) => onChange(Number(text))}
            onBlur={onBlur}
            containerStyles={styles.input}
            keyboardType="numeric"
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fieldItems: {
    rowGap: 0,
  },
  input: {
    marginVertical: 5,
  },
  advancedSettingsLabel: {
    fontSize: 16,
    marginTop: 20,
  },
});

export default DeviceProtection;
