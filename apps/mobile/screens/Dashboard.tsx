import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Appbar } from 'react-native-paper';

import AddDeviceDropdown from '../components/AddDeviceDropdown';
import Background from '../components/Background';
import DeviceRegistrationForm from '../components/DeviceRegistration/DeviceRegistrationForm';
import { Popover, PopoverContent, PopoverTrigger } from '../components/PopOver';
import AddDevicePopover from '../components/DeviceRegistration/AddDevicePopover';

const Dashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDevicePopoverVisible, setIsDevicePopoverVisible] = useState(false);

  const handleSelect = (option: string) => {
    if (option === 'Scan Code') {
      // Open scanner and on successful scan, set isModalVisible to true
      setIsModalVisible(true);
    } else if (option === 'Enter Code') {
      // Handle enter code logic
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    console.log('closeModal');
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Dashboard" />
        <Appbar.Action icon="devices" onPress={() => setIsDevicePopoverVisible(!isDevicePopoverVisible)} />
      </Appbar.Header>
      <Background>
        {isDevicePopoverVisible && (
          <AddDevicePopover
            onClick={() => setIsDevicePopoverVisible(false)}
            containerStyles={styles.popoverContainer}
          />
        )}
        <Text style={styles.greeting}>Hello Name,</Text>
        <AddDeviceDropdown onSelect={handleSelect} />
        <Modal visible={isModalVisible} animationType="slide">
          <DeviceRegistrationForm closeModal={closeModal} />
        </Modal>
      </Background>
    </>
  );
};

const styles = StyleSheet.create({
  popoverContainer: {
    position: 'absolute',
    right: 10,
    top: 0,
    zIndex: 10,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Dashboard;
