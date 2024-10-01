import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

import Paragraph from './Paragraph';
import { Device } from '@ingeniti/shared';
import { useTheme } from 'react-native-paper';

interface DeviceItemProps {
  device: Device;
}

const DeviceItem = ({ device }: DeviceItemProps) => {
  const theme = useTheme();
  return (
    <TouchableOpacity style={[styles.container, { borderColor: theme.colors.outlineVariant }]}>
      <Paragraph>{device.name}</Paragraph>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default DeviceItem;
