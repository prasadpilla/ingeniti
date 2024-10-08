import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Appbar, Paragraph, Title, useTheme } from 'react-native-paper';

import { useAuth } from '@clerk/clerk-expo';
import { Device } from '@ingeniti/shared/dist/schemas/mobile/devices.schema';
import { useQuery } from '@tanstack/react-query';
import Background from '../components/Background';
import Button from '../components/Button';
import DeviceListItem from '../components/DeviceListItem';
import AddDevicePopover from '../components/DeviceRegistration/AddDevicePopover';
import { HomeProps } from '../types';
import { makeApiCall } from '../utils/api';

const HomeScreen = ({ navigation }: HomeProps) => {
  const theme = useTheme();
  const { getToken } = useAuth();

  const [isDevicePopoverVisible, setIsDevicePopoverVisible] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);

  const { isLoading, refetch: refetchDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const token = await getToken();
      const response = await makeApiCall(token, '/devices', 'GET');
      return response.json();
    },
    onSuccess: (data: Device[]) => {
      setDevices(data);
    },
    onError: (error) => {
      console.error(error);
    },
    refetchOnWindowFocus: false,
  });

  const handleBackgroundPress = () => {
    if (isDevicePopoverVisible) {
      setIsDevicePopoverVisible(false);
    }
  };

  const handleDevicePress = (device: Device) => {
    navigation.getParent()?.navigate('DeviceDetails', { device });
  };

  useEffect(() => {
    refetchDevices();
  }, []);

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.secondaryContainer,
          height: 60,
          zIndex: 100,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity style={{ padding: 8 }}>
          <Image source={require('../assets/logo.jpeg')} style={{ width: 32, height: 32 }} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          <Appbar.Action icon="account-plus" onPress={() => {}} />
          <Appbar.Action
            icon="plus-circle"
            onPress={() => {
              setIsDevicePopoverVisible(!isDevicePopoverVisible);
            }}
          />
        </View>
      </Appbar.Header>
      {isDevicePopoverVisible && (
        <AddDevicePopover
          onScanCode={() => {
            setIsDevicePopoverVisible(false);
            navigation.getParent()?.navigate('DeviceOnBoardingForm', { refetchDevices });
          }}
          onEnterCode={() => {
            setIsDevicePopoverVisible(false);
          }}
          containerStyles={styles.popoverContainer}
        />
      )}
      <Background>
        <TouchableWithoutFeedback onPress={handleBackgroundPress}>
          <View style={styles.contentWrapper}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} color={theme.colors.secondary} />
                <Paragraph>Loading...</Paragraph>
              </View>
            ) : devices.length > 0 ? (
              <View style={styles.contentContainer}>
                <Title>All Devices</Title>
                <View style={styles.devicesContainer}>
                  {devices.map((device) => (
                    <TouchableOpacity key={device.id} onPress={() => handleDevicePress(device)}>
                      <DeviceListItem device={device} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.emptyDeviceContainer}>
                  <MaterialCommunityIcons
                    name="devices"
                    size={24}
                    color={theme.colors.secondary}
                    style={[styles.emptyDeviceIcon, { backgroundColor: theme.colors.secondaryContainer }]}
                  />
                  <Paragraph style={styles.emptyDeviceHeading}>Lets get started</Paragraph>
                  <Paragraph style={styles.emptyDeviceSubheading}>
                    Add your first device/sensor by scanning the QR code or entering the code manually.
                  </Paragraph>

                  <View style={styles.emptyDeviceButtonContainer}>
                    <Button
                      mode="contained"
                      onPress={() => {
                        navigation.getParent()?.navigate('DeviceOnBoardingForm', { refetchDevices });
                      }}
                    >
                      Scan QR Code
                    </Button>
                    <Button
                      onPress={() => {
                        navigation.getParent()?.navigate('DeviceOnBoardingForm', { refetchDevices });
                      }}
                    >
                      Enter Code
                    </Button>
                  </View>
                </View>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Background>
    </>
  );
};

const styles = StyleSheet.create({
  popoverContainer: {
    position: 'absolute',
    right: 20,
    top: 90,
    zIndex: 1000,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  devicesContainer: {
    width: '100%',
    flexDirection: 'row',
    top: 10,
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  devicesList: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  emptyDeviceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  greeting: {
    fontSize: 24,
    marginBottom: 20,
  },
  emptyDeviceHeading: {
    fontSize: 24,
    paddingTop: 10,
    fontWeight: '700',
  },
  emptyDeviceSubheading: {
    textAlign: 'center',
  },
  emptyDeviceButtonContainer: {
    alignItems: 'center',
    width: '60%',
  },
  emptyDeviceIcon: {
    padding: 8,
    borderRadius: 100,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
  },
});

export default HomeScreen;
