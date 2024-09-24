import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, TextInput } from 'react-native-paper';
import Paragraph from '../Paragraph';
import FormSection from './FormSection';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';

const BenefitsUtility = () => {
  const theme = useTheme();
  const { control } = useForm();
  const [enrollmentStatus, setEnrollmentStatus] = useState<string>('Enrolled');
  const [utility, setUtility] = useState<string>('APSPDC');
  const [meterServiceID, setMeterServiceID] = useState('');
  const [country, setCountry] = useState<string>('India');

  const enrollmentStatusOptions = [
    { label: 'Enrolled', value: 'Enrolled' },
    { label: 'Not Enrolled', value: 'Not Enrolled' },
  ];

  const utilityOptions = [
    { label: 'India', value: 'India' },
    { label: 'APSPDC', value: 'APSPDC' },
  ];

  const countryOptions = [
    { label: 'India', value: 'India' },
    { label: 'USA', value: 'USA' },
    { label: 'Canada', value: 'Canada' },
  ];

  const Dropdown = ({ label, value, onSelect, options }) => (
    <View style={styles.dropdownContainer}>
      <Paragraph style={styles.label}>{label}</Paragraph>
      <View style={styles.dropdown}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              mode="outlined"
              value={value}
              onChangeText={onChange}
              render={(props) => (
                <View {...props}>
                  <MaterialCommunityIcons name="chevron-down" size={24} color="black" />
                </View>
              )}
            />
          )}
          name={label}
          defaultValue={value}
        />
      </View>
    </View>
  );

  return (
    <FormSection sectionTitle="Enable Benefits from Utility" isOpen={true}>
      <View style={styles.fieldItems}>
        <Dropdown
          label="Enrollment Status"
          value={enrollmentStatus}
          onSelect={setEnrollmentStatus}
          options={enrollmentStatusOptions}
        />
        <View style={styles.fieldItem}>
          <Paragraph style={styles.label}>Utility</Paragraph>
          <View style={styles.dropdownInput}>
            <Dropdown label="Utility" value={utility} onSelect={setUtility} options={utilityOptions} />
            <Dropdown label="Country" value={country} onSelect={setCountry} options={countryOptions} />
          </View>
        </View>
        <View style={styles.fieldItem}>
          <Paragraph style={styles.label}>Meter Service ID</Paragraph>
          <TextInput
            mode="outlined"
            label=""
            style={styles.input}
            value={meterServiceID}
            onChangeText={setMeterServiceID}
            placeholder="Enter Meter Service ID"
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
  dropdownContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dropdown: {
    marginLeft: 'auto',
    width: '55%',
    fontSize: 14,
  },
  dropdownInput: {
    marginLeft: 'auto',
    fontSize: 14,
    flexDirection: 'row',
  },
});

export default BenefitsUtility;
