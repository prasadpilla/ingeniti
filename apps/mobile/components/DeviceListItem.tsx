import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Device } from '@ingeniti/shared';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import DeviceToggle from './DeviceToggle';
import Paragraph from './Paragraph';

interface DeviceListItemProps {
  device: Device;
}

const DeviceListItem = ({ device }: DeviceListItemProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { borderColor: theme.colors.outlineVariant }]}>
      <View style={styles.leftContent}>
        <MaterialCommunityIcons name="air-conditioner" size={24} color={theme.colors.primary} style={styles.icon} />
        <View>
          <Paragraph style={styles.deviceName}>{device.name}</Paragraph>
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: device.isOnline ? 'green' : 'red' }]} />
            <Paragraph style={styles.statusText}>{device.isOnline ? 'Online' : 'Offline'}</Paragraph>
          </View>
        </View>
      </View>
      <View style={styles.toggleContainer}>
        <DeviceToggle device={device} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: 'gray',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    marginRight: 8,
  },
});

export default DeviceListItem;
