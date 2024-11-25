import { DataTable } from '@/components/DataTable/DataTable';
import ScheduleForm from '@/components/ScheduleForm';
import { Button } from '@/shadcn/ui/button';
import { makeApiCall } from '@/utils/api';
import { useAuth } from '@clerk/clerk-react';
import { Trash } from '@phosphor-icons/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { HttpStatusCode } from 'shared';

interface Schedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  deviceIds: string[];
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
      console.log('Device Info:', data);
    } catch (error) {
      console.error('Error', error);
    }
  };

  useEffect(() => {
    const deviceId = 'bffc73fa-e21b-454e-922f-a31aca521365';
    fetchDeviceInfo(deviceId);
  }, []);

  const {
    data: scheduleData = [],
    isLoading: isScheduleLoading,
    error,
  } = useQuery<Schedule[]>(['schedules'], async () => {
    const token = await getToken();
    const res = await makeApiCall(token, `/schedules`, 'GET');

    console.log('Response from /schedules:', res);

    if (res.status !== HttpStatusCode.OK_200) {
      throw new Error('Failed to fetch schedules');
    }

    const data = await res.json();
    console.log('Schedules data:', data);

    if (!Array.isArray(data.schedules)) {
      throw new Error('Expected an array of schedules');
    }

    return data.schedules;
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
      cell: ({ row }: { row: any }) => row.original.deviceIds.join(', '),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center">
          <Button variant="outline" className="p-1" onClick={() => handleDelete(row.original.id)}>
            <Trash className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];

  const hasSchedules = scheduleData.length > 0;

  return (
    <div>
      <div className="w-full flex justify-between">
        <h2 className="text-2xl font-bold">Schedule Lists</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add Schedule</Button>
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
            deviceIds: schedule.deviceIds,
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
