import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Paragraph, useTheme } from 'react-native-paper';

import Background from './Background';

const AddDeviceDropdown = ({ onSelect }: { onSelect: (option: string) => void }) => {
  const theme = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <Background>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={[styles.button, { backgroundColor: theme.colors.secondaryContainer }]}
      >
        <View>
          <MaterialCommunityIcons name="cellphone-check" size={24} color={theme.colors.primary} />
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={[styles.dropdown, { backgroundColor: theme.colors.secondaryContainer }]}>
          <TouchableOpacity onPress={() => handleSelect('Scan Code')} style={styles.option}>
            <Paragraph>Scan Code</Paragraph>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect('Enter Code')} style={styles.option}>
            <Paragraph>Enter Code</Paragraph>
          </TouchableOpacity>
        </View>
      )}
    </Background>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
  },
  dropdown: {
    width: '100%',
    borderRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 1000,
  },
  option: {
    padding: 10,
  },
});

export default AddDeviceDropdown;
