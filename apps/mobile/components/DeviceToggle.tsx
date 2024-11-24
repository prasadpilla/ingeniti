import { useAuth } from '@clerk/clerk-expo';
import { Device } from '@ingeniti/shared';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Switch } from 'react-native-paper';
import { makeApiCall } from '../utils/api';

interface DeviceToggleProps {
  device: Device;
}

const DeviceToggle: React.FC<DeviceToggleProps> = ({ device }) => {
  const { getToken } = useAuth();
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const updateDeviceMutation = useMutation({
    mutationFn: async (data: { id: string; isSwitchOn: boolean }) => {
      const token = await getToken();
      const response = await makeApiCall(token, `/devices/${data.id}`, 'PUT', { isSwitchOn: data.isSwitchOn });
      console.log('Update Device Response:', response);
      return response.json();
    },
    onSuccess: (data: Device) => {
      console.log('Device updated successfully:', data);
      setIsSwitchOn(data.isSwitchOn ?? false);
    },
    onError: (error) => {
      console.error('Failed to update device:', error);
    },
  });

  const controlDevice = async (status: boolean) => {
    const token = await getToken();
    const response = await makeApiCall(token, `/devices/control/${device.id}`, 'POST', { status });
    console.log('Control Device Response:', response);
    return response.json();
  };

  const fetchDeviceState = async () => {
    const token = await getToken();
    const response = await makeApiCall(token, `/devices/get-status/${device.id}`, 'GET');
    const data = await response.json();
    console.log('Fetched Device status:', data);
    if (data.success) {
      setIsSwitchOn(data.status);
    } else {
      console.error('Failed to fetch device status:', data.error);
    }
  };

  useEffect(() => {
    fetchDeviceState();
  }, []);

  const handleSwitchChange = async (value: boolean) => {
    setIsSwitchOn(value);

    try {
      const controlResponse = await controlDevice(value);
      if (controlResponse.success) {
        await updateDeviceMutation.mutateAsync({
          id: device.id,
          isSwitchOn: value,
        });
      } else {
        setIsSwitchOn(!value);
      }
    } catch (error) {
      console.error('Error controlling device:', error);
      setIsSwitchOn(!value);
    }
  };

  return <Switch value={isSwitchOn} onValueChange={handleSwitchChange} />;
};

export default DeviceToggle;
