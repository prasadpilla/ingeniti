import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Switch } from 'react-native-paper';
import { Device } from 'shared';
import { makeApiCall } from '../utils/api';

interface DeviceToggleProps {
  device: Device;
}

const DeviceToggle: React.FC<DeviceToggleProps> = ({ device }) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [isSwitchOn, setIsSwitchOn] = React.useState(device.isSwitchOn ?? false);

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
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['devices'] });

      // Snapshot the previous value
      const previousDevices = queryClient.getQueryData(['devices']);

      // Optimistically update the cache
      queryClient.setQueryData(['devices'], (old: Device[]) => {
        return old.map((d) => (d.id === device.id ? { ...d, isSwitchOn: data.isSwitchOn } : d));
      });

      setIsSwitchOn(data.isSwitchOn);
      return { previousDevices };
    },
    onError: (error, variables, context) => {
      // Revert back to the previous value if there's an error
      if (context?.previousDevices) {
        queryClient.setQueryData(['devices'], context.previousDevices);
      }
      setIsSwitchOn(!isSwitchOn);
      console.error('Failed to control device:', error);
    },
    onSettled: () => {
      // Refetch after error or success
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
