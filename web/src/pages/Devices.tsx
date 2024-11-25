import { useEffect, useState } from 'react';
import { makeApiCall } from '@/utils/api';
import { useAuth } from '@clerk/clerk-react';
import { DataTable } from '@/components/DataTable/DataTable';

interface Device {
  id: string;
  name: string;
  type: string;
  isOnline: boolean;
  totalEnergyConsumed: number;
  isSwitchOn: boolean;
  tuyaDeviceState: string;
}

const DevicesPage: React.FC = () => {
  const { getToken } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = await getToken();
        const response = await makeApiCall(token, '/devices', 'GET');

        if (!response.ok) {
          throw new Error('Failed to fetch devices');
        }

        const data = await response.json();
        const devicesWithState = await Promise.all(
          data.map(async (device: Device) => {
            const stateResponse = await makeApiCall(token, `/devices/get-device-state/${device.id}`, 'GET');
            const stateData = stateResponse.ok ? await stateResponse.json() : { state: 'Unknown' };

            // Update to extract the state value correctly
            const deviceState =
              stateData.success && stateData.state.result
                ? stateData.state.result.state === 1
                  ? 'On'
                  : 'Off'
                : 'Error fetching state';

            return {
              ...device,
              tuyaDeviceState: deviceState,
              totalEnergyConsumed: device.totalEnergyConsumed || 0, // Set default value to 0
            };
          })
        );

        setDevices(devicesWithState);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [getToken]);

  const deviceColumns = [
    {
      accessorKey: 'name',
      header: 'Device Name',
    },
    {
      accessorKey: 'type',
      header: 'Device Type',
    },
    {
      accessorKey: 'isOnline',
      header: 'Connectivity Status',
      cell: ({ row }) => (row.original.isOnline ? 'Online' : 'Offline'),
    },
    {
      accessorKey: 'totalEnergyConsumed',
      header: 'Total Energy Consumed (kWh)',
    },
    {
      accessorKey: 'isSwitchOn',
      header: 'Switch Status',
      cell: ({ row }) => (row.original.isSwitchOn ? 'On' : 'Off'),
    },
    {
      accessorKey: 'tuyaDeviceState',
      header: 'Device State',
    },
  ];

  return (
    <div>
      <div className="w-full flex justify-between">
        <h2 className="text-2xl font-bold">Devices List</h2>
      </div>
      {error ? (
        <div className="text-center mt-16">
          <p>Error fetching devices: {error}</p>
        </div>
      ) : isLoading ? (
        <div className="text-center mt-16">
          <p>Loading devices...</p>
        </div>
      ) : (
        <DataTable columns={deviceColumns} data={devices} isLoading={isLoading} error={error} />
      )}
    </div>
  );
};

export default DevicesPage;
