import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Background from '../components/Background';
import Button from '../components/Button';
import BenefitsSmartPanel from '../components/DeviceRegistration/BenefitsSmartPanel';
import BenefitsUtility from '../components/DeviceRegistration/BenefitsUtility';
import DeviceDetails from '../components/DeviceRegistration/DeviceDetails';
import DeviceProtection from '../components/DeviceRegistration/DeviceProtection';
import FormSection from '../components/DeviceRegistration/FormSection';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import { DeviceOnBoardingForm, deviceOnBoardingFormSchema } from '../types/forms.schemas';
import { DeviceOnBoardingFormProps } from '../types/navigation.types';

const DeviceOnBoardingFormScreen: React.FC<DeviceOnBoardingFormProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isDeviceDetailsOpen, setIsDeviceDetailsOpen] = useState(true);
  const [isDeviceProtectionOpen, setIsDeviceProtectionOpen] = useState(false);
  const [isBenefitsUtilityOpen, setIsBenefitsUtilityOpen] = useState(false);
  const [isBenefitsSmartPanelOpen, setIsBenefitsSmartPanelOpen] = useState(false);

  const deviceOnBoardingForm = useForm<DeviceOnBoardingForm>({
    resolver: zodResolver(deviceOnBoardingFormSchema),
    defaultValues: {
      deviceDetails: {
        deviceSerial: '',
        deviceUsage: '',
        deviceType: '',
        deviceName: '',
        deviceLocation: '',
        averageEnergyCost: 0,
      },
      deviceProtection: {
        minOffTime: '3',
        brownOutVoltageChange: '',
        brownOutFrequencyChange: '',
      },
      benefitsUtility: {
        enrollmentStatus: 'Enrolled',
        utility: '',
        country: '',
        meterServiceID: '',
      },
      benefitsUtilitySmartPanel: {
        connectedDevice: {
          isConnectedToPrimaryDevice: 'Connected',
          utility: '',
          country: '',
          meterServiceID: '',
          maxLoad: 0,
        },
        noDevice: {
          isConnectedToPrimaryDevice: 'No',
          deviceIdentifier: '',
        },
      },
    },
  });
  return (
    <Background>
      <Header>Device On-Boarding</Header>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formSections}>
          <FormSection sectionTitle="Device Details" isOpen={isDeviceDetailsOpen}>
            <DeviceDetails />
          </FormSection>

          <FormSection sectionTitle="Device Protection" isOpen={isDeviceProtectionOpen}>
            <DeviceProtection />
          </FormSection>

          <FormSection sectionTitle="Enable Benefits via Utility" isOpen={isBenefitsUtilityOpen}>
            <BenefitsUtility />
          </FormSection>

          <FormSection sectionTitle="Enable Benefits via Smart Panel" isOpen={isBenefitsSmartPanelOpen}>
            <BenefitsSmartPanel />
          </FormSection>
        </View>
      </ScrollView>

      <View style={styles.buttonContainers}>
        <Button mode="outlined" onPress={() => {}} style={styles.sectionButton}>
          Complete Registration
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
