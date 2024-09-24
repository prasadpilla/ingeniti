import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

import AddDeviceDropdown from '../components/AddDeviceDropdown';
import DeviceRegistrationForm from '../components/DeviceRegistration/DeviceRegistrationForm';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello Name,</Text>
      <AddDeviceDropdown onSelect={handleSelect} />
      <Modal visible={isModalVisible} animationType="slide">
        <DeviceRegistrationForm closeModal={closeModal} />
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
