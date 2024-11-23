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

  const freezeDevice = async (state: number) => {
    const token = await getToken();
    const response = await makeApiCall(token, `/devices/freeze-device/${device.id}`, 'POST', { state });
    console.log('Freeze Device Response:', response);
    return response.json();
  };

  const fetchDeviceState = async () => {
    const token = await getToken();
    const response = await makeApiCall(token, `/devices/get-device-state/${device.id}`, 'GET');
    const data = await response.json();
    console.log('Fetched Device State:', data);
    if (data.success) {
      setIsSwitchOn(data.state);
    } else {
      console.error('Failed to fetch device state:', data.error);
    }
  };

  useEffect(() => {
    fetchDeviceState();
  }, []);

  const handleSwitchChange = async (value: boolean) => {
    const newState = value ? 0 : 1;
    console.log('Switch changed to:', value);
    setIsSwitchOn(value);

    try {
      const freezeResponse = await freezeDevice(newState);
      console.log('Freeze Response:', freezeResponse);
      if (freezeResponse.success) {
        await updateDeviceMutation.mutateAsync({
          id: device.id,
          isSwitchOn: value,
        });
      } else {
        console.log('Reverting switch state due to freeze failure');
        setIsSwitchOn(!value);
      }
    } catch (error) {
      console.error('Error freezing/unfreezing device:', error);
      setIsSwitchOn(!value);
    }
  };

  return <Switch value={isSwitchOn} onValueChange={handleSwitchChange} />;
};

export default DeviceToggle;
