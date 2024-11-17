// apps/web/src/pages/ScheduleDetails.tsx

import { DataTable } from '@/components/DataTable/DataTable';
import { makeApiCall } from '@/utils/api';
import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { HttpStatusCode } from '@ingeniti/shared';
import { Button } from '@/shadcn/ui/button';
import { Spinner } from '@phosphor-icons/react';
import ScheduleForm from '@/components/ScheduleForm';
import React, { useState } from 'react';

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

  if (isScheduleLoading) {
    return (
      <div className="w-full h-full p-5 flex items-center justify-center text-primary">
        <Spinner className="animate-spin size-6" />
      </div>
    );
  }

  const scheduleColumns = [
    {
      accessorKey: 'name', // Changed to show the name of the schedule
      header: 'Schedule Name',
    },
    {
      accessorKey: 'startTime', // Added start time column
      header: 'Start Time',
    },
    {
      accessorKey: 'endTime', // Added end time column
      header: 'End Time',
    },
    {
      accessorKey: 'deviceIds', // Added devices column
      header: 'Devices',
      cell: ({ row }) => row.original.deviceIds.join(', '), // Join device names for display
    },
  ];

  const hasSchedules = scheduleData.length > 0; // Check length directly

  return (
    <div>
      <div className="w-full flex justify-between">
        <h2 className="text-2xl font-bold">Schedule Details</h2>
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
            name: schedule.name,
            startTime: new Date(schedule.startTime).toLocaleString(),
            endTime: new Date(schedule.endTime).toLocaleString(),
            deviceIds: schedule.deviceIds, // This now contains device names
          }))}
          isLoading={isScheduleLoading}
          error={error as string}
        />
      )}
      <ScheduleForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ScheduleDetailsPage;
