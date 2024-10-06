import { useAuth } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Device, DeviceOnBoardingForm, deviceOnBoardingFormSchema } from '@ingeniti/shared';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { HelperText, useTheme } from 'react-native-paper';

import Background from '../components/Background';
import Button from '../components/Button';
import FormSection from '../components/DeviceRegistration/FormSection';
import Dropdown from '../components/Dropdown';
import FormInput from '../components/FormInput';
import Paragraph from '../components/Paragraph';
import { DeviceOnBoardingFormProps } from '../types/navigation.types';
import { makeApiCall } from '../utils/api';
import {
  countryOptions,
  deviceTypeOptions,
  deviceUsageOptions,
  smartPanelConnectionStatusOptions,
  utilityOptions,
} from '../utils/dropdownOptions';

const DeviceOnBoardingFormScreen: React.FC<DeviceOnBoardingFormProps> = ({ navigation, route }) => {
  const { getToken } = useAuth();

  const { t } = useTranslation();
  const theme = useTheme();
  const [isDeviceDetailsOpen, setIsDeviceDetailsOpen] = useState(true);
  const [isDeviceProtectionOpen, setIsDeviceProtectionOpen] = useState(false);
  const [isBenefitsUtilityOpen, setIsBenefitsUtilityOpen] = useState(false);
  const [isBenefitsSmartPanelOpen, setIsBenefitsSmartPanelOpen] = useState(false);
  const [isConnectedToPrimaryDevice, setIsConnectedToPrimaryDevice] = useState(true);

  const deviceOnBoardingForm = useForm<DeviceOnBoardingForm>({
    resolver: zodResolver(deviceOnBoardingFormSchema),
    defaultValues: {
      serialNumber: 'PEONRI289923UCDJ',
      location: '1234 Main St, Anytown, USA',
      usage: '',
      type: '',
      name: '',
      averageEnergyCost: 0,

      minOffTime: 3,
      brownOutVoltageChange: 20,
      brownOutFrequencyChange: 4,

      utility: '',
      country: '',
      meterServiceId: '',

      isConnectedToPrimaryDevice: true,
      utilitySmartPanel: '',
      countrySmartPanel: '',
      meterServiceIdSmartPanel: '',
      maxLoad: 0,
      identifier: '',
    },
    mode: 'onChange',
  });

  const deviceFormMutation = useMutation({
    mutationFn: async (data: DeviceOnBoardingForm) => {
      const token = await getToken();
      const response = await makeApiCall(token, '/devices', 'POST', data);

      if (!response.ok) {
        throw new Error('Failed to register device');
      }

      return response.json();
    },
    onSuccess: (data: Device) => {
      console.log('Device registered successfully', data);
      route.params.refetchDevices();
      navigation.goBack();
    },
    onError: (error) => {
      console.error('Failed to register device', error);
    },
  });

  const onSubmit: SubmitHandler<DeviceOnBoardingForm> = (data) => {
    deviceFormMutation.mutate(data);
  };

  useEffect(() => {
    console.log('isConnectedToPrimaryDevice', isConnectedToPrimaryDevice);
  }, [isConnectedToPrimaryDevice]);

  return (
    <Background>
      <Paragraph style={{ fontSize: 20, fontWeight: 'bold', color: 'green' }}>Device Scan is Successful</Paragraph>
      <Paragraph style={{ fontSize: 14, fontWeight: '400', marginTop: 10 }}>
        Please fill in the details below to complete the registration
      </Paragraph>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formSections}>
          <FormSection sectionTitle="Device Details" isOpen={isDeviceDetailsOpen}>
            <Controller
              control={deviceOnBoardingForm.control}
              name="serialNumber"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <FormInput
                  label="Serial Number"
                  placeholder="PR250*********"
                  disabled
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  containerStyles={styles.input}
                  errorText={error?.message}
                />
              )}
            />
            <Controller
              control={deviceOnBoardingForm.control}
              name="location"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <FormInput
                  label="Location"
                  disabled
                  placeholder="Enter Device Location"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  containerStyles={styles.input}
                  errorText={error?.message}
                />
              )}
            />
            <Controller
              control={deviceOnBoardingForm.control}
              name="usage"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <View style={styles.dropdownContainer}>
                  <Dropdown
                    options={deviceUsageOptions}
                    selectedValue={value}
                    onSelect={onChange}
                    placeholder="Select Usage"
                    hasError={!!error?.message}
                    errorText={error?.message}
                  />
                </View>
              )}
            />

            <Controller
              control={deviceOnBoardingForm.control}
              name="type"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <View style={styles.dropdownContainer}>
                  <Dropdown
                    options={deviceTypeOptions}
                    selectedValue={value}
                    onSelect={onChange}
                    placeholder="Select Type"
                    hasError={!!error?.message}
                    errorText={error?.message}
                  />
                </View>
              )}
            />

            <Controller
              control={deviceOnBoardingForm.control}
              name="name"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <FormInput
                  label="Name"
                  placeholder="Enter Device Name"
                  value={value}
                  onChangeText={(value) => {
                    onChange(value);
                  }}
                  onBlur={onBlur}
                  containerStyles={styles.input}
                  errorText={error?.message}
                />
              )}
            />
            <View style={styles.averageEnergyCost}>
              <Controller
                control={deviceOnBoardingForm.control}
                name="averageEnergyCost"
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                  <FormInput
                    label="Average Energy Cost per kWh"
                    placeholder="0.00"
                    value={value.toString()}
                    onChangeText={(text) => onChange(Number(text))}
                    onBlur={onBlur}
                    containerStyles={styles.input}
                    errorText={error?.message}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
          </FormSection>

          <FormSection sectionTitle="Enable Protection" isOpen={isDeviceProtectionOpen}>
            <Controller
              control={deviceOnBoardingForm.control}
              name="minOffTime"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <FormInput
                  label="Minimum Off-Time (minutes)"
                  placeholder="3"
                  value={value.toString()}
                  onChangeText={(text) => onChange(Number(text))}
                  onBlur={onBlur}
                  containerStyles={styles.input}
                  keyboardType="numeric"
                  errorText={error?.message}
                />
              )}
            />
            <Paragraph style={styles.advancedSettingsLabel}>Advanced Settings</Paragraph>
            <Controller
              control={deviceOnBoardingForm.control}
              name="brownOutVoltageChange"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <FormInput
                  label="Power off if voltage changes by"
                  placeholder="20"
                  value={value.toString()}
                  onChangeText={(text) => onChange(Number(text))}
                  onBlur={onBlur}
                  containerStyles={styles.input}
                  keyboardType="numeric"
                  errorText={error?.message}
                />
              )}
            />
            <Controller
              control={deviceOnBoardingForm.control}
              name="brownOutFrequencyChange"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <FormInput
                  label="Power off if frequency changes by"
                  placeholder="4"
                  value={value.toString()}
                  onChangeText={(text) => onChange(Number(text))}
                  onBlur={onBlur}
                  containerStyles={styles.input}
                  keyboardType="numeric"
                  errorText={error?.message}
                />
              )}
            />
          </FormSection>

          <FormSection sectionTitle="Enable Benefits via Utility" isOpen={isBenefitsUtilityOpen}>
            <Controller
              control={deviceOnBoardingForm.control}
              name="country"
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <View style={styles.dropdownContainer}>
                  <Dropdown
                    options={countryOptions}
                    selectedValue={value}
                    onSelect={onChange}
                    placeholder="Select Country"
                    hasError={!!error?.message}
                    errorText={error?.message}
                  />
                </View>
              )}
            />
            <Controller
              control={deviceOnBoardingForm.control}
              name="utility"
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <View style={styles.dropdownContainer}>
                  <Dropdown
                    options={utilityOptions}
                    selectedValue={value}
                    onSelect={onChange}
                    placeholder="Select Utility"
                    hasError={!!error?.message}
                    errorText={error?.message}
                  />
                </View>
              )}
            />
            <Controller
              control={deviceOnBoardingForm.control}
              name="meterServiceId"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <FormInput
                    label="Meter / Service ID"
                    placeholder="Enter Meter Service ID"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    containerStyles={styles.input}
                    errorText={error?.message}
                  />
                  <HelperText type="info">Enter correctly to get benefits</HelperText>
                </>
              )}
            />
          </FormSection>

          <FormSection sectionTitle="Enable Benefits via Smart Panel" isOpen={isBenefitsSmartPanelOpen}>
            <Controller
              control={deviceOnBoardingForm.control}
              name="isConnectedToPrimaryDevice"
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <View style={styles.dropdownContainer}>
                  <Dropdown
                    options={smartPanelConnectionStatusOptions}
                    selectedValue={value}
                    onSelect={(newValue) => {
                      onChange(newValue);
                      setIsConnectedToPrimaryDevice(Boolean(newValue));
                      if (newValue) {
                        deviceOnBoardingForm.setValue('identifier', '');
                      } else {
                        deviceOnBoardingForm.setValue('utilitySmartPanel', '');
                        deviceOnBoardingForm.setValue('countrySmartPanel', '');
                        deviceOnBoardingForm.setValue('meterServiceIdSmartPanel', '');
                        deviceOnBoardingForm.setValue('maxLoad', 0);
                      }
                    }}
                    placeholder="Device Connection Method"
                    hasError={!!error?.message}
                    errorText={error?.message}
                  />
                </View>
              )}
            />
            {isConnectedToPrimaryDevice ? (
              <>
                <Controller
                  control={deviceOnBoardingForm.control}
                  name="countrySmartPanel"
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <View style={styles.dropdownContainer}>
                      <Dropdown
                        options={countryOptions}
                        selectedValue={value ?? ''}
                        onSelect={onChange}
                        placeholder="Select Country"
                        hasError={!!error?.message}
                        errorText={error?.message}
                      />
                    </View>
                  )}
                />
                <Controller
                  control={deviceOnBoardingForm.control}
                  name="utilitySmartPanel"
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <View style={styles.dropdownContainer}>
                      <Dropdown
                        options={utilityOptions}
                        selectedValue={value ?? ''}
                        onSelect={onChange}
                        placeholder="Select Utility"
                        hasError={!!error?.message}
                        errorText={error?.message}
                      />
                    </View>
                  )}
                />
                <Controller
                  control={deviceOnBoardingForm.control}
                  name="meterServiceIdSmartPanel"
                  render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                    <FormInput
                      label="Meter / Service ID"
                      placeholder="Enter Meter / Service ID"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      containerStyles={styles.input}
                      errorText={error?.message}
                    />
                  )}
                />
                <Controller
                  control={deviceOnBoardingForm.control}
                  name="maxLoad"
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <FormInput
                      label="Max Load (kW)"
                      placeholder="Enter Max Load"
                      value={value?.toString() ?? '0'}
                      onChangeText={(text) => onChange(Number(text))}
                      containerStyles={styles.input}
                      errorText={error?.message}
                    />
                  )}
                />
              </>
            ) : (
              <Controller
                control={deviceOnBoardingForm.control}
                name="identifier"
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                  <FormInput
                    label="Primary Device Name"
                    placeholder="Enter Primary Device Name If Any"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    containerStyles={styles.input}
                    errorText={error?.message}
                  />
                )}
              />
            )}
          </FormSection>
        </View>
      </ScrollView>

      <View style={styles.buttonContainers}>
        <Button
          mode="contained"
          onPress={deviceOnBoardingForm.handleSubmit(onSubmit)}
          style={styles.sectionButton}
          disabled={deviceFormMutation.isLoading || !deviceOnBoardingForm.formState.isValid}
        >
          {deviceFormMutation.isLoading ? (
            <ActivityIndicator animating={true} color={theme.colors.secondary} />
          ) : (
            'Complete Registration'
          )}
        </Button>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Paragraph style={[styles.goBackText, { color: theme.colors.primary }]}>{t('go_back')}</Paragraph>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    height: 180,
    width: '100%',
    marginTop: 20,
  },
  formSections: {
    flexDirection: 'column',
    gap: 20,
    height: '100%',
    overflow: 'scroll',
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
  advancedSettingsLabel: {
    fontSize: 14,
    marginTop: 20,
    textAlign: 'left',
  },
  averageEnergyCost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonContainers: {
    marginTop: 20,
    width: '100%',
  },
  sectionButton: {
    width: '100%',
    marginTop: 10,
  },
  goBackButton: {
    marginTop: 10,
  },
  goBackText: {
    fontWeight: '600',
  },
  sectionDescriptionText: {
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '500',
  },
});

export default DeviceOnBoardingFormScreen;
