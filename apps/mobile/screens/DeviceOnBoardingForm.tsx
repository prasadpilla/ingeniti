import { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import BenefitsUtility from '../components/DeviceRegistration/BenefitsUtility';
import DeviceDetails from '../components/DeviceRegistration/DeviceDetails';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import { DeviceOnBoardingFormProps } from '../types/navigation.types';
import DeviceProtection from '../components/DeviceRegistration/DeviceProtection';
import { useTheme } from 'react-native-paper';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

const DeviceOnBoardingFormScreen: React.FC<DeviceOnBoardingFormProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isDeviceDetailsOpen, setIsDeviceDetailsOpen] = useState(false);
  const [isDeviceProtectionOpen, setIsDeviceProtectionOpen] = useState(true);
  const [isBenefitsUtilityOpen, setIsBenefitsUtilityOpen] = useState(false);

  return (
    <Background>
      <Header>Add A New Device</Header>

      {isDeviceDetailsOpen && (
        <>
          <Paragraph
            style={[
              styles.formSectionHeading,
              { backgroundColor: theme.colors.secondaryContainer, color: theme.colors.primary },
            ]}
          >
            Device Details
          </Paragraph>
          <View style={styles.sectionContainer}>
            <DeviceDetails />
            <Button mode="outlined" onPress={() => {}} style={styles.sectionButton}>
              Continue
            </Button>
          </View>
        </>
      )}

      {isDeviceProtectionOpen && (
        <>
          <Paragraph
            style={[
              styles.formSectionHeading,
              { backgroundColor: theme.colors.secondaryContainer, color: theme.colors.primary },
            ]}
          >
            Device Protection
          </Paragraph>
          <View style={styles.sectionContainer}>
            <DeviceProtection />
            <Button mode="outlined" onPress={() => {}} style={styles.sectionButton}>
              Continue
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
        </>
      )}

      {/* <Button mode="contained" style={styles.registerButton} onPress={() => {}}>
          Register Device
        </Button> */}

      {/* <Button mode="outlined" onPress={() => {}} style={styles.registerButton}>
        Register Device
      </Button> */}
    </Background>
  );
};

const styles = StyleSheet.create({
  formSectionHeading: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  sectionContainer: {
    width: '100%',
    marginTop: 20,
  },
  sectionButton: {
    width: '100%',
    marginTop: 32,
  },
  goBackButton: {
    marginTop: 24,
  },
  goBackText: {
    fontWeight: '600',
  },
});

export default DeviceOnBoardingFormScreen;
