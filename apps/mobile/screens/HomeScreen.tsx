import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';

import AddDeviceDropdown from '../components/AddDeviceDropdown';
import DeviceRegistrationForm from '../components/DeviceRegistration/DeviceRegistrationForm';

const HomeScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelect = (option: string) => {
    if (option === 'Scan Code') {
      // Open scanner and on successful scan, set isModalVisible to true
      setIsModalVisible(true);
    } else if (option === 'Enter Code') {
      // Handle enter code logic
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello Name,</Text>
      <AddDeviceDropdown onSelect={handleSelect} />
      <Modal visible={isModalVisible} animationType="slide">
        <DeviceRegistrationForm />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
