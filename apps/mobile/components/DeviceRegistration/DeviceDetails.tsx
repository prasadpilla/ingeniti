import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { DeviceDetailsForm, deviceDetailsFormSchema } from '../../types/forms.schemas';
import { deviceTypeOptions, deviceUsageOptions } from '../../utils/dropdownOptions';
import Dropdown from '../Dropdown';
import FormInput from '../FormInput';

const DeviceDetails = () => {
  const deviceDetailsForm = useForm<DeviceDetailsForm>({
    resolver: zodResolver(deviceDetailsFormSchema),
    defaultValues: {
      deviceSerial: '',
      deviceUsage: '',
      deviceType: '',
      deviceName: '',
      deviceLocation: '',
      averageEnergyCost: 0,
    },
    mode: 'onBlur',
  });

  return (
    <View style={styles.fieldItems}>
      <Controller
        control={deviceDetailsForm.control}
        name="deviceSerial"
        render={({ field: { value, onChange, onBlur } }) => (
          <FormInput
            label="PR250*********"
            placeholder="PR250*********"
            disabled
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
            label="Location"
            disabled
            placeholder="Enter Device Location"
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
            <Dropdown
              options={deviceUsageOptions}
              selectedValue={value}
              onSelect={onChange}
              placeholder="Select Usage"
            />
          </View>
        )}
      />

      <Controller
        control={deviceDetailsForm.control}
        name="deviceType"
        render={({ field: { value, onChange, onBlur } }) => (
          <View style={styles.dropdownContainer}>
            <Dropdown
              options={deviceTypeOptions}
              selectedValue={value}
              onSelect={onChange}
              placeholder="Select Type"
            />
          </View>
        )}
      />

      <Controller
        control={deviceDetailsForm.control}
        name="deviceName"
        render={({ field: { value, onChange, onBlur } }) => (
          <FormInput
            label="Name"
            placeholder="Enter Device Name"
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
              label="Average Energy Cost per kWh"
              placeholder="0.00"
              value={value.toString()}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyles={styles.input}
            />
          )}
        />
      </View>
    </View>
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
    marginVertical: 8,
  },

  averageEnergyCost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default DeviceDetails;
