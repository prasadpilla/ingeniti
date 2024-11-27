import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Switch } from 'react-native-paper';
import { Device } from 'shared';
import { useDeviceStore } from '../stores/deviceStore';
import { makeApiCall } from '../utils/api';

interface DeviceToggleProps {
  device: Device;
}

const DeviceToggle: React.FC<DeviceToggleProps> = ({ device }) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { setDeviceState, getDeviceState } = useDeviceStore();

  const isSwitchOn = getDeviceState(device.id, device.isSwitchOn ?? false);

  const controlDeviceMutation = useMutation({
    mutationFn: async (data: { id: string; isSwitchOn: boolean }) => {
      const token = await getToken();
      const response = await makeApiCall(token, `/devices/control/${device.id}`, 'POST', { status: data.isSwitchOn });
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Failed to control device:', response.status, response.statusText, errorData);
        throw new Error('Failed to control device');
      }
      return data.isSwitchOn;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['devices'] });
      const previousDevices = queryClient.getQueryData<Device[]>(['devices']);

      setDeviceState(device.id, data.isSwitchOn);

      queryClient.setQueryData<Device[]>(['devices'], (old) => {
        if (!old) return previousDevices;
        return old.map((d) => (d.id === device.id ? { ...d, isSwitchOn: data.isSwitchOn } : d));
      });

      return { previousDevices };
    },
    onError: (error, variables, context) => {
      if (context?.previousDevices) {
        queryClient.setQueryData(['devices'], context.previousDevices);
      }
      setDeviceState(device.id, !isSwitchOn);
      console.error('Failed to control device:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });

  const handleSwitchChange = async (value: boolean) => {
    await controlDeviceMutation.mutateAsync({
      id: device.id,
      isSwitchOn: value,
    });
  };

  return <Switch value={isSwitchOn} onValueChange={handleSwitchChange} />;
};

export default DeviceToggle;
