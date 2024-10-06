import { useAuth } from '@clerk/clerk-expo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Device } from '@ingeniti/shared';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { makeApiCall } from '../utils/api';
import Paragraph from './Paragraph';

interface DeviceItemProps {
  device: Device;
}

const DeviceItem = ({ device }: DeviceItemProps) => {
  const theme = useTheme();
  const { getToken } = useAuth();
  const [isSwitchOn, setIsSwitchOn] = useState(device.isSwitchOn ?? false);
  const updateDeviceMutation = useMutation({
    mutationFn: async (data: { id: string; isSwitchOn: boolean }) => {
      const token = await getToken();
      const response = await makeApiCall(token, `/devices/${data.id}`, 'PUT', { isSwitchOn: data.isSwitchOn });
      return response.json();
    },
    onSuccess: (data: Device) => {
      setIsSwitchOn(data.isSwitchOn ?? false);
    },
    onError: (error) => {
      console.error('Failed to update device:', error);
    },
  });

  const handleSwitchChange = async () => {
    await updateDeviceMutation.mutateAsync({
      id: device.id,
      isSwitchOn: !isSwitchOn,
    });
    setIsSwitchOn(!isSwitchOn);
  };

  return (
    <TouchableOpacity style={[styles.container, { borderColor: theme.colors.outlineVariant }]}>
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
      <Switch value={isSwitchOn} onValueChange={handleSwitchChange} />
    </TouchableOpacity>
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
});

export default DeviceItem;
