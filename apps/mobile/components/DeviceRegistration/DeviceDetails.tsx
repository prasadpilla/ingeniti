import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, TextInput } from 'react-native-paper';

import Paragraph from '../Paragraph';
import { Dropdown } from 'react-native-paper-dropdown';

import FormSection from './FormSection';

const DeviceDetails = () => {
  const theme = useTheme();
  const [deviceUsage, setDeviceUsage] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceIdentifier, setDeviceIdentifier] = useState('');
  const [deviceLocation, setDeviceLocation] = useState('');
  const [averageEnergyCost, setAverageEnergyCost] = useState('');

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
        <View style={styles.fieldItem}>
          <Paragraph style={styles.label}>Device Serial #</Paragraph>
          <TextInput mode="outlined" label="" style={styles.input} placeholder="PR250************" />
        </View>
        <View style={styles.fieldItem}>
          <Paragraph style={styles.label}>Device Usage</Paragraph>
          <Dropdown
            label="Select device usage"
            placeholder="Select device usage"
            mode="outlined"
            value={deviceUsage}
            onSelect={(value) => setDeviceUsage(value as string)}
            options={deviceUsageOptions}
            menuContentStyle={styles.input}
          />
        </View>

        <View style={styles.fieldItem}>
          <Paragraph style={styles.label}>Device Type</Paragraph>
          <Dropdown
            label="Select device type"
            placeholder="Select device type"
            mode="outlined"
            value={deviceType}
            onSelect={(value) => setDeviceType(value as string)}
            options={deviceTypeOptions}
          />
        </View>

        <View style={styles.fieldItem}>
          <Paragraph style={styles.label}>Device Name</Paragraph>
          <TextInput
            mode="outlined"
            label=""
            style={styles.input}
            value={deviceName}
            onChangeText={setDeviceName}
            placeholder="Enter Device Name"
          />
        </View>

        <View style={styles.fieldItem}>
          <Paragraph style={styles.label}>Device Identifier</Paragraph>
          <TextInput
            mode="outlined"
            label=""
            style={styles.input}
            value={deviceIdentifier}
            onChangeText={setDeviceIdentifier}
            placeholder="Device Type–Device Name"
          />
        </View>

        <View style={styles.fieldItem}>
          <Paragraph style={styles.label}>Device Location</Paragraph>
          <TextInput
            mode="outlined"
            label=""
            style={styles.input}
            value={deviceLocation}
            onChangeText={setDeviceLocation}
            placeholder="Enter Device Location"
          />
        </View>

        <View style={styles.fieldItem}>
          <Paragraph style={styles.label}>Average Energy Cost per kWh</Paragraph>
          <TextInput
            mode="outlined"
            label=""
            style={styles.input}
            value={averageEnergyCost}
            onChangeText={setAverageEnergyCost}
            placeholder="Enter Cost"
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
    width: '40%',
    textAlign: 'left',
    paddingHorizontal: 0,
    fontSize: 14,
  },
  input: {
    marginLeft: 'auto',
    width: '55%',
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default DeviceDetails;
