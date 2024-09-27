import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
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
      minOffTime: '',
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
            label="Minimum Off-Time"
            placeholder="3"
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
        name="brownOutVoltageChange"
        render={({ field: { value, onChange, onBlur } }) => (
          <FormInput
            label="Brownout: Voltage changes"
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
            label="Brownout: Frequency changes"
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
    marginVertical: 6,
  },
});

export default DeviceProtection;
