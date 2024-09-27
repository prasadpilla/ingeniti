import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Background from '../components/Background';
import Button from '../components/Button';
import BenefitsSmartPanel from '../components/DeviceRegistration/BenefitsSmartPanel';
import BenefitsUtility from '../components/DeviceRegistration/BenefitsUtility';
import DeviceDetails from '../components/DeviceRegistration/DeviceDetails';
import DeviceProtection from '../components/DeviceRegistration/DeviceProtection';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import { DeviceOnBoardingFormProps } from '../types/navigation.types';

const DeviceOnBoardingFormScreen: React.FC<DeviceOnBoardingFormProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isDeviceDetailsOpen, setIsDeviceDetailsOpen] = useState(true);
  const [isDeviceProtectionOpen, setIsDeviceProtectionOpen] = useState(false);
  const [isBenefitsUtilityOpen, setIsBenefitsUtilityOpen] = useState(false);
  const [isBenefitsSmartPanelOpen, setIsBenefitsSmartPanelOpen] = useState(false);
  return (
    <Background>
      {isDeviceDetailsOpen && (
        <>
          <Header>Device Details</Header>
          <View style={styles.sectionContainer}>
            <DeviceDetails />
            <Button
              mode="outlined"
              onPress={() => {
                setIsDeviceDetailsOpen(false);
                setIsDeviceProtectionOpen(true);
              }}
              style={styles.sectionButton}
            >
              Continue
            </Button>
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Paragraph style={[styles.goBackText, { color: theme.colors.primary }]}>
                {t('go_back')}
              </Paragraph>
            </TouchableOpacity>
          </View>
        </>
      )}

      {isDeviceProtectionOpen && (
        <>
          <Header>Device Protection</Header>
          <View style={styles.sectionContainer}>
            <DeviceProtection />
            <Button
              mode="outlined"
              onPress={() => {
                setIsDeviceProtectionOpen(false);
                setIsBenefitsUtilityOpen(true);
              }}
              style={styles.sectionButton}
            >
              Continue
            </Button>
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={() => {
                setIsDeviceDetailsOpen(true);
                setIsDeviceProtectionOpen(false);
              }}
            >
              <Paragraph style={[styles.goBackText, { color: theme.colors.primary }]}>
                {t('go_back')}
              </Paragraph>
            </TouchableOpacity>
          </View>
        </>
      )}

      {isBenefitsUtilityOpen && (
        <>
          <Header>Enable Benefits from Utilities</Header>
          <Paragraph style={[styles.sectionDescriptionText, { color: theme.colors.primary }]}>
            inGeniti will executed intelligent operations to reduce your energy costs. You will have
            options to opt out
          </Paragraph>
          <View style={styles.sectionContainer}>
            <BenefitsUtility />
            <Button
              mode="outlined"
              onPress={() => {
                setIsBenefitsUtilityOpen(false);
                setIsBenefitsSmartPanelOpen(true);
              }}
              style={styles.sectionButton}
            >
              Continue
            </Button>
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={() => {
                setIsDeviceProtectionOpen(true);
                setIsBenefitsUtilityOpen(false);
              }}
            >
              <Paragraph style={[styles.goBackText, { color: theme.colors.primary }]}>
                {t('go_back')}
              </Paragraph>
            </TouchableOpacity>
          </View>
        </>
      )}

      {isBenefitsSmartPanelOpen && (
        <>
          <Header>Benefits Smart Panel</Header>
          <View style={styles.sectionContainer}>
            <BenefitsSmartPanel />
            <Button mode="outlined" onPress={() => {}} style={styles.sectionButton}>
              Register Device
            </Button>
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={() => {
                setIsBenefitsSmartPanelOpen(false);
                setIsBenefitsUtilityOpen(true);
              }}
            >
              <Paragraph style={[styles.goBackText, { color: theme.colors.primary }]}>
                {t('go_back')}
              </Paragraph>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Background>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
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
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default DeviceOnBoardingFormScreen;
