import { useAuth } from '@clerk/clerk-expo';
import { Device } from '@ingeniti/shared';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { Switch } from 'react-native-paper';
import { makeApiCall } from '../utils/api';

interface DeviceToggleProps {
  device: Device;
}

const DeviceToggle: React.FC<DeviceToggleProps> = ({ device }) => {
  const { getToken } = useAuth();
  const [isSwitchOn, setIsSwitchOn] = React.useState(device.isSwitchOn ?? false);

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

  const handleSwitchChange = async (value: boolean) => {
    await updateDeviceMutation.mutateAsync({
      id: device.id,
      isSwitchOn: value,
    });
  };

  return <Switch value={isSwitchOn} onValueChange={handleSwitchChange} />;
};

export default DeviceToggle;
