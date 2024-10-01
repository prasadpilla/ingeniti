import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { Appbar, Paragraph, useTheme } from 'react-native-paper';

import Background from '../components/Background';
import Button from '../components/Button';
import AddDevicePopover from '../components/DeviceRegistration/AddDevicePopover';
import { makeApiCall } from '../utils/api';
import { useQuery } from '@tanstack/react-query';
import { Device } from '@ingeniti/shared/dist/schemas/mobile/devices.schema';
import { useAuth } from '@clerk/clerk-expo';
import Header from '../components/Header';
import DeviceItem from '../components/DeviceItem';

const Dashboard = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { getToken } = useAuth();

  const [isDevicePopoverVisible, setIsDevicePopoverVisible] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);

  const {
    data,
    isLoading,
    refetch: refetchDevices,
  } = useQuery({
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

  useEffect(() => {
    refetchDevices();
  }, []);

  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.secondaryContainer, height: 60, zIndex: 100 }}>
        <Appbar.Content title="Dashboard" />
        <Appbar.Action icon="devices" onPress={() => setIsDevicePopoverVisible(!isDevicePopoverVisible)} />
      </Appbar.Header>
      {isDevicePopoverVisible && (
        <AddDevicePopover
          onScanCode={() => {
            setIsDevicePopoverVisible(false);
            navigation.navigate('DeviceOnBoardingForm', { refetchDevices });
          }}
          onEnterCode={() => {
            setIsDevicePopoverVisible(false);
          }}
          containerStyles={styles.popoverContainer}
        />
      )}
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View style={{ flex: 1 }}>
          <Background>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} color={theme.colors.secondary} />
                <Paragraph>Loading...</Paragraph>
              </View>
            ) : devices.length > 0 ? (
              <>
                <Header>All Devices</Header>
                <View style={styles.devicesContainer}>
                  <View style={styles.devicesList}>
                    {devices.map((device) => (
                      <DeviceItem key={device.id} device={device} />
                    ))}
                  </View>
                  <View style={[styles.emptyDeviceButtonContainer, { marginTop: 54 }]}>
                    <Button
                      mode="contained"
                      onPress={() => {
                        navigation.navigate('DeviceOnBoardingForm', { refetchDevices });
                      }}
                    >
                      Scan QR Code
                    </Button>
                    <Button onPress={() => {}}>Enter Code</Button>
                  </View>
                </View>
              </>
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
                        navigation.navigate('DeviceOnBoardingForm', { refetchDevices });
                      }}
                    >
                      Scan QR Code
                    </Button>
                    <Button onPress={() => {}}>Enter Code</Button>
                  </View>
                </View>
              </View>
            )}
          </Background>
        </View>
      </TouchableWithoutFeedback>
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
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  devicesContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devicesList: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
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
});

export default Dashboard;
