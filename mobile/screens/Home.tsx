import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Appbar, Menu, Paragraph, Text, Title, useTheme } from 'react-native-paper';

import { useAuth, useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { Device } from 'shared/dist/schemas/mobile/devices.schema';
import Button from '../components/Button';
import DeviceListItem from '../components/DeviceListItem';
import AddDevicePopover from '../components/DeviceRegistration/AddDevicePopover';
import { HomeProps } from '../types';
import { makeApiCall } from '../utils/api';

const HomeScreen = ({ navigation }: HomeProps) => {
  const theme = useTheme();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [isDevicePopoverVisible, setIsDevicePopoverVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'Devices' | 'Sensors'>('Devices');
  const [isMoreMenuVisible, setIsMoreMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    isLoading,
    data: devices = [],
    refetch: refetchDevices,
  } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const token = await getToken();
      const response = await makeApiCall(token, '/devices', 'GET');
      return response.json();
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

  const handleEnergyUsagePress = () => {
    navigation.getParent()?.navigate('EnergyUsageChart', { userId: user?.id });
  };

  useEffect(() => {
    refetchDevices();
  }, []);

  const totalDevices = devices.length;
  const totalSensors = devices.reduce((acc: number, device: Device) => acc + (device.isSensor ? 1 : 0), 0);

  const filteredItems =
    activeTab === 'Devices'
      ? devices.filter((device: Device) => !device.isSensor)
      : devices.filter((device: Device) => device.isSensor);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchDevices();
    setRefreshing(false);
  };

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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <TouchableWithoutFeedback onPress={handleBackgroundPress}>
          <View style={styles.contentWrapper}>
            <View>
              <Title style={styles.greeting}>Hello, {user?.firstName || 'User'}</Title>
              <Text style={styles.deviceCount}>
                {totalDevices} devices, {totalSensors} sensors
              </Text>
              <View style={styles.tabContainer}>
                <View style={styles.tabButtons}>
                  <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'Devices' && styles.activeTabButton]}
                    onPress={() => setActiveTab('Devices')}
                  >
                    <Text style={[styles.tabButtonText, activeTab === 'Devices' && styles.activeTabButtonText]}>
                      Devices
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'Sensors' && styles.activeTabButton]}
                    onPress={() => setActiveTab('Sensors')}
                  >
                    <Text style={[styles.tabButtonText, activeTab === 'Sensors' && styles.activeTabButtonText]}>
                      Sensors
                    </Text>
                  </TouchableOpacity>
                </View>
                <Menu
                  visible={isMoreMenuVisible}
                  onDismiss={() => setIsMoreMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setIsMoreMenuVisible(true)}>
                      <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.colors.onSurface} />
                    </TouchableOpacity>
                  }
                  contentStyle={styles.menuContent}
                >
                  <Menu.Item
                    onPress={handleEnergyUsagePress}
                    title="Monitor"
                    leadingIcon={({ size, color }) => (
                      <MaterialCommunityIcons name="monitor-dashboard" size={size} color={color} />
                    )}
                    titleStyle={styles.menuItemTitle}
                  />
                </Menu>
              </View>
            </View>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} color={theme.colors.secondary} />
                <Paragraph>Loading...</Paragraph>
              </View>
            ) : filteredItems.length > 0 ? (
              <View style={styles.contentContainer}>
                <View style={styles.devicesContainer}>
                  {filteredItems.map((item: Device) => (
                    <TouchableOpacity key={item.id} onPress={() => handleDevicePress(item)}>
                      <DeviceListItem device={item} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.emptyDeviceContainer}>
                <MaterialCommunityIcons
                  name={activeTab === 'Devices' ? 'power-socket-uk' : 'thermometer'}
                  size={24}
                  color={theme.colors.secondary}
                  style={[styles.emptyDeviceIcon, { backgroundColor: theme.colors.secondaryContainer }]}
                />
                <Paragraph style={styles.emptyDeviceHeading}>Lets get started</Paragraph>
                <Paragraph style={styles.emptyDeviceSubheading}>
                  Add your first {activeTab === 'Devices' ? 'device' : 'sensor'} by scanning the QR code or entering the
                  code manually.
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
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  deviceCount: {
    fontSize: 16,
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabButtons: {
    flex: 1,
    flexDirection: 'row',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabButtonText: {
    fontSize: 16,
  },
  activeTabButtonText: {
    fontWeight: 'bold',
  },
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
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
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
  menuContent: {
    borderRadius: 12,
    minWidth: 150,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemTitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default HomeScreen;
