import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { makeApiCall } from '@/utils/api';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent } from '@/shadcn/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { z } from 'zod';
import CustomDropdown from './CustomDropdown';

export interface Schedule {
  id: string;
  userId: string;
  name: string;
  startTime: string;
  endTime: string;
  selectedDevices: string[];
}

export interface Device {
  id: string;
  userId: string;
  name: string;
  identifier?: string;
  serialNumber: string;
  usage: string;
  type: string;
  location: string;
  averageEnergyCost: number;
  minOffTime: number;
  brownOutVoltageChange: number;
  brownOutFrequencyChange: number;
  utility: string;
  country: string;
  meterServiceId: string;
  isConnectedToPrimaryDevice: boolean;
  utilitySmartPanel?: string;
  countrySmartPanel?: string;
  meterServiceIdSmartPanel?: string;
  maxLoad?: number;
  isSwitchOn: boolean;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ScheduleFormProps {
  onClose: () => void;
  isOpen: boolean;
}

const scheduleFormSchema = z.object({
  name: z.string().nonempty('Name is required'),
  startTime: z.string().nonempty('Start time is required'),
  endTime: z.string().nonempty('End time is required'),
  selectedDevices: z.array(z.string()).min(1, 'At least one device must be selected'),
});

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onClose, isOpen }) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const form = useForm<z.infer<typeof scheduleFormSchema>>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      name: '',
      startTime: '',
      endTime: '',
      selectedDevices: [],
    },
  });

  useEffect(() => {
    const fetchDevices = async () => {
      const token = await getToken();
      const response = await makeApiCall(token, '/devices', 'GET');
      if (!response.ok) {
        throw new Error('Failed to fetch devices');
      }
      const data = await response.json();
      setDevices(data);
    };

    fetchDevices();
  }, [getToken]);

  const handleDeviceToggle = (deviceId: string) => {
    setSelectedDeviceIds((prev) => {
      const newSelectedIds = prev.includes(deviceId) ? prev.filter((id) => id !== deviceId) : [...prev, deviceId];
      // Update the form's selectedDevices field
      form.setValue('selectedDevices', newSelectedIds);
      return newSelectedIds;
    });
  };

  const { mutate, isLoading } = useMutation(
    async (data: z.infer<typeof scheduleFormSchema>) => {
      const token = await getToken();
      const response = await makeApiCall(
        token,
        '/schedules', // Always POST to create a new schedule
        'POST',
        {
          name: data.name,
          startTime: data.startTime,
          endTime: data.endTime,
          deviceIds: selectedDeviceIds,
        }
      );
      if (response.status !== 200 && response.status !== 201) {
        const errorData = await response.json();
        throw new Error(String(errorData.message));
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success('Schedule created successfully');
        queryClient.invalidateQueries(['schedules']);
        onClose();
      },
      onError: (error: Error) => {
        console.error(error);
        toast.error('Failed to create schedule');
      },
    }
  );

  const onSubmit = form.handleSubmit(async (data) => {
    await mutate({
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      selectedDevices: selectedDeviceIds,
    });
  });

  const filteredDevices = devices.filter((device) => device.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-full">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Create Schedule</h2>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Label htmlFor="name">Schedule Name</Label>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Label htmlFor="startTime">Start Time</Label>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Label htmlFor="endTime">End Time</Label>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selectedDevices"
                render={({ fieldState }) => (
                  <FormItem>
                    <Label htmlFor="selectedDevices">Select Devices</Label>
                    <FormControl>
                      <div className="flex flex-wrap items-center gap-2 rounded-md w-full">
                        <Input
                          value={searchTerm}
                          className="text-md font-sm w-full"
                          placeholder="Search devices..."
                          autoComplete="off"
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onFocus={() => setDropdownOpen(true)}
                        />
                        <CustomDropdown
                          trigger={null}
                          items={filteredDevices.map((device) => ({
                            id: device.id,
                            name: device.name,
                            selected: selectedDeviceIds.includes(device.id),
                          }))}
                          onItemToggle={handleDeviceToggle}
                          isOpen={dropdownOpen}
                          onOpenChange={setDropdownOpen}
                        />
                      </div>
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                    {/* Render selected devices as badges */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedDeviceIds.map((deviceId) => {
                        const device = devices.find((d) => d.id === deviceId);
                        return (
                          device && (
                            <span
                              key={deviceId}
                              className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full"
                            >
                              {device.name}
                              <button
                                type="button"
                                className="ml-1 text-white"
                                onClick={() => handleDeviceToggle(deviceId)}
                              >
                                &times;
                              </button>
                            </span>
                          )
                        );
                      })}
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="px-12" type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Create Schedule'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleForm;
