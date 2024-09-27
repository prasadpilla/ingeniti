import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import { z } from 'zod';

import { utilityOptions, countryOptions, enrollmentStatusOptions } from '../../utils/dropdownOptions';
import Dropdown from '../Dropdown';
import FormInput from '../FormInput';

const benefitsUtilityFormSchema = z.object({
  enrollmentStatus: z.enum(['Enrolled', 'Not Enrolled']),
  utility: z.string().min(1, 'Utility is required'),
  country: z.string().min(1, 'Country is required'),
  meterServiceID: z.string().min(1, 'Meter Service ID is required'),
});

type BenefitsUtilityForm = z.infer<typeof benefitsUtilityFormSchema>;

const BenefitsUtility = () => {
  const benefitsUtilityForm = useForm<BenefitsUtilityForm>({
    resolver: zodResolver(benefitsUtilityFormSchema),
    defaultValues: {
      enrollmentStatus: 'Enrolled',
      utility: '',
      country: '',
      meterServiceID: '',
    },
    mode: 'onBlur',
  });

  return (
    <View style={styles.fieldItems}>
      <Controller
        control={benefitsUtilityForm.control}
        name="enrollmentStatus"
        render={({ field: { value, onChange } }) => (
          <View style={styles.dropdownContainer}>
            <Dropdown
              options={enrollmentStatusOptions}
              selectedValue={value}
              onSelect={onChange}
              placeholder="Select Enrollment Status"
            />
          </View>
        )}
      />
      <Controller
        control={benefitsUtilityForm.control}
        name="utility"
        render={({ field: { value, onChange } }) => (
          <View style={styles.dropdownContainer}>
            <Dropdown options={utilityOptions} selectedValue={value} onSelect={onChange} placeholder="Select Utility" />
          </View>
        )}
      />
      <Controller
        control={benefitsUtilityForm.control}
        name="country"
        render={({ field: { value, onChange } }) => (
          <View style={styles.dropdownContainer}>
            <Dropdown options={countryOptions} selectedValue={value} onSelect={onChange} placeholder="Select Country" />
          </View>
        )}
      />
      <Controller
        control={benefitsUtilityForm.control}
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

export default BenefitsUtility;
