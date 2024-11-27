import { useAuth } from '@clerk/clerk-expo';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { Switch } from 'react-native-paper';
import { Device } from 'shared';
import { makeApiCall } from '../utils/api';

interface DeviceToggleProps {
  device: Device;
}

const DeviceToggle: React.FC<DeviceToggleProps> = ({ device }) => {
  const { getToken } = useAuth();
  const [isSwitchOn, setIsSwitchOn] = React.useState(device.isSwitchOn ?? false);

  const controlDeviceMutation = useMutation({
    mutationFn: async (data: { id: string; isSwitchOn: boolean }) => {
      setIsSwitchOn(data.isSwitchOn);
      const token = await getToken();
      const response = await makeApiCall(token, `/devices/control/${device.id}`, 'POST', { status: data.isSwitchOn });
      if (response.ok) {
        return response.json();
      }
      throw new Error('Failed to control device');
    },
    onSuccess: (data: Device) => {
      setIsSwitchOn(data.isSwitchOn ?? false);
    },
    onError: (error) => {
      setIsSwitchOn(!isSwitchOn);
      console.error('Failed to control device:', error);
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