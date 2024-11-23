// apps/web/src/pages/ScheduleDetails.tsx

import { DataTable } from '@/components/DataTable/DataTable';
import { makeApiCall } from '@/utils/api';
import { useAuth } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HttpStatusCode } from '@ingeniti/shared';
import { Button } from '@/shadcn/ui/button'; // You can replace this with your button implementation
import ScheduleForm from '@/components/ScheduleForm';
import React, { useEffect, useState } from 'react';
import { Trash } from '@phosphor-icons/react'; // Import the Trash icon

// Define the type for a schedule
interface Schedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  deviceIds: string[]; // This will now contain device names
}

const ScheduleDetailsPage: React.FC = () => {
  const { getToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const queryClient = useQueryClient();

  const fetchDeviceInfo = async (deviceId: string) => {
    try {
      const token = await getToken();
      const response = await makeApiCall(token, `/devices/freeze-device/${deviceId}`, 'POST', {
        state: 1,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch device info');
      }

      const data = await response.json();
      console.log('Device Info:', data); // Log the result
    } catch (error) {
      console.error('Error', error);
    }
  };

  // Example usage of fetchDeviceInfo
  useEffect(() => {
    const deviceId = 'bffc73fa-e21b-454e-922f-a31aca521365'; // Replace with the actual device ID you want to fetch
    fetchDeviceInfo(deviceId);
  }, []);

  const {
    data: scheduleData = [], // Default to an empty array
    isLoading: isScheduleLoading,
    error,
  } = useQuery<Schedule[]>(['schedules'], async () => {
    const token = await getToken();
    const res = await makeApiCall(token, `/schedules`, 'GET');

    // Log the response for debugging
    console.log('Response from /schedules:', res);

    if (res.status !== HttpStatusCode.OK_200) {
      throw new Error('Failed to fetch schedules');
    }

    // Log the JSON data
    const data = await res.json();
    console.log('Schedules data:', data); // Log the actual data returned

    // Ensure the data is an array
    if (!Array.isArray(data.schedules)) {
      throw new Error('Expected an array of schedules');
    }

    return data.schedules; // Return the schedules array
  });

  const deleteScheduleMutation = useMutation(
    async (scheduleId: string) => {
      const token = await getToken();
      const res = await makeApiCall(token, `/schedules/${scheduleId}`, 'DELETE');
      if (res.status !== HttpStatusCode.OK_200) {
        throw new Error('Failed to delete schedule');
      }
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['schedules']);
      },
    }
  );

  const handleDelete = (scheduleId: string) => {
    deleteScheduleMutation.mutate(scheduleId);
  };

  const scheduleColumns = [
    {
      accessorKey: 'name',
      header: 'Schedule Name',
    },
    {
      accessorKey: 'startTime',
      header: 'Start Time',
    },
    {
      accessorKey: 'endTime',
      header: 'End Time',
    },
    {
      accessorKey: 'deviceIds',
      header: 'Devices',
      cell: ({ row }) => row.original.deviceIds.join(', '),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Button
            variant="outline"
            className="p-1"
            onClick={() => handleDelete(row.original.id)} // Call delete directly
          >
            <Trash className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];

  const hasSchedules = scheduleData.length > 0; // Check length directly

  return (
    <div>
      <div className="w-full flex justify-between">
        <h2 className="text-2xl font-bold">Schedule Lists</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add Schedule</Button> {/* Open the modal */}
      </div>
      {error ? (
        <div className="text-center mt-16">
          <p>Error fetching schedules: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      ) : !hasSchedules ? (
        <div className="text-center mt-16">
          <p>No Schedules found</p>
        </div>
      ) : (
        <DataTable
          columns={scheduleColumns}
          data={scheduleData.map((schedule) => ({
            id: schedule.id,
            name: schedule.name,
            startTime: new Date(schedule.startTime).toLocaleString(),
            endTime: new Date(schedule.endTime).toLocaleString(),
            deviceIds: schedule.deviceIds, // This now contains device names
          }))}
          isLoading={isScheduleLoading}
          error={error as string}
        />
      )}
      <ScheduleForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSchedule(null);
        }}
      />
    </div>
  );
};

export default ScheduleDetailsPage;
