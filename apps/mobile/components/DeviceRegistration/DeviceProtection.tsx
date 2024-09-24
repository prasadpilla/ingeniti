import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, TextInput } from 'react-native-paper';
import Paragraph from '../Paragraph';
import FormSection from './FormSection';
import { Controller, useForm } from 'react-hook-form';

const DeviceProtection = () => {
  const theme = useTheme();
  const { control } = useForm();
  const [minOffTime, setMinOffTime] = useState('');
  const [voltageChange, setVoltageChange] = useState('');
  const [frequencyChange, setFrequencyChange] = useState('');

  return (
    <FormSection sectionTitle="Protection" isOpen={false}>
      <View style={styles.fieldItems}>
        <View style={styles.fieldItem}>
          <Paragraph style={styles.label}>Minimum Off-Time</Paragraph>
          <TextInput
            mode="outlined"
            label="Minutes"
            style={styles.input}
            value={minOffTime}
            onChangeText={setMinOffTime}
            placeholder="3"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.fieldItem}>
          <Paragraph style={styles.label}>Brownout: Power Off if Voltage changes by more than</Paragraph>
          <TextInput
            mode="outlined"
            label="%"
            style={styles.input}
            value={voltageChange}
            onChangeText={setVoltageChange}
            placeholder="20"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.fieldItem}>
          <Paragraph style={styles.label}>Brownout: Power Off if Frequency changes by more than</Paragraph>
          <TextInput
            mode="outlined"
            label="Hz"
            style={styles.input}
            value={frequencyChange}
            onChangeText={setFrequencyChange}
            placeholder="4"
            keyboardType="numeric"
          />
        </View>
      </View>
    </FormSection>
  );
};

const styles = StyleSheet.create({
  fieldItems: {
    rowGap: 10,
  },
  fieldItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  label: {
    width: '60%',
    textAlign: 'left',
    paddingHorizontal: 0,
    fontSize: 14,
  },
  input: {
    marginLeft: 'auto',
    width: '35%',
    fontSize: 14,
  },
});

export default DeviceProtection;
