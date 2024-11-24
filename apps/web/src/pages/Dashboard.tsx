import { useEffect, useState } from 'react';
import { makeApiCall } from '@/utils/api'; // Import makeApiCall
import { CheckCircle, Checks, Clock, Info } from '@phosphor-icons/react';
import { Tooltip } from '@radix-ui/react-tooltip';
import { Progress } from '@/shadcn/ui/progress';
import { TooltipContent, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { PowerConsumptionAreaChart } from '@/components/CaseStatusAreaChart';
import { useAuth } from '@clerk/clerk-react'; // Import useAuth for token management

const Dashboard = () => {
  const { getToken } = useAuth(); // Get the token from Clerk
  const [metrics, setMetrics] = useState({
    total: { value: 0, prevValue: 0 },
    connected: { value: 0, prevValue: 0 },
    totalLoad: { value: 0, prevValue: 0 },
  });
  const [powerConsumptionData, setPowerConsumptionData] = useState([]); // State for power consumption data

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = await getToken(); // Get the token
        const response = await makeApiCall(token, '/devices/metrics', 'GET'); // Use makeApiCall

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMetrics(data.metrics);
            setPowerConsumptionData(data.powerConsumptionData); // Set the power consumption data
          } else {
            console.error('Failed to fetch metrics:', data.error);
          }
        } else {
          console.error('Failed to fetch metrics:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, [getToken]); // Add getToken as a dependency

  return (
    <main className="mx-auto max-w-7xl">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Dashboard</h1>
        </div>

        <div className="flex flex-wrap -mx-2">
          <div className="w-full sm:w-1/3 px-2 mb-4">
            <div className="border-t-4 border-indigo-500 p-4 h-full rounded-lg shadow">
              <div className="flex items-center">
                <Checks className="h-4 w-4 text-indigo-500 mr-2" />
                <p>Total Devices</p>
              </div>
              <p className="text-2xl font-bold mt-2">{metrics.total.value}</p>
              <div className="mt-4">
                <p>
                  <span
                    className={`${metrics.total.value - metrics.total.prevValue >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {`${metrics.total.value - metrics.total.prevValue >= 0 ? '+' : '-'}${Math.abs(metrics.total.value - metrics.total.prevValue)}`}
                  </span>
                  {' since last week'}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/3 px-2 mb-4">
            <div className="border-t-4 border-green-500 p-4 h-full rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <p>Connected Devices</p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    {Object.entries(metrics).map(([key, value]) => {
                      if (key === 'total') return null;
                      return (
                        <p key={key}>
                          <span className="text-muted-foreground">{key[0].toUpperCase() + key.slice(1)}</span>
                          <span className="text-sm ml-1 font-semibold">{value.value}</span>
                        </p>
                      );
                    })}
                  </TooltipContent>
                </Tooltip>
              </div>
              {metrics.connected.value && <p className="text-2xl font-bold mt-2">{metrics.connected.value}</p>}
              <div className="mt-4">
                <p>
                  <span
                    className={`${metrics.connected.value - metrics.connected.prevValue >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {`${metrics.connected.value - metrics.connected.prevValue >= 0 ? '+' : '-'}${Math.abs(metrics.connected.value - metrics.connected.prevValue).toFixed(1)}%`}
                  </span>
                  {' since last week'}
                </p>
              </div>
              <Progress
                value={metrics.connected.value > 0 ? (metrics.connected.value / metrics.connected.prevValue) * 100 : 0}
                className="mt-2 h-2 [&>div]:bg-green-500"
              />
            </div>
          </div>
          <div className="w-full sm:w-1/3 px-2 mb-4">
            <div className="border-t-4 border-orange-500 p-4 h-full rounded-lg shadow">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-orange-500 mr-2" />
                <p>Total Load</p>
              </div>
              <p className="text-2xl font-bold mt-2">{metrics.totalLoad.value} MWH</p>
              <div className="mt-4">
                <p>
                  <span
                    className={`${metrics.totalLoad.value - metrics.totalLoad.prevValue >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {`${metrics.totalLoad.value - metrics.totalLoad.prevValue >= 0 ? '+' : '-'}${Math.abs(metrics.totalLoad.value - metrics.totalLoad.prevValue).toFixed(1)} MWH`}
                  </span>
                  {' since last week'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Power Consumption Chart Section */}
        <div className="mt-8">
          <PowerConsumptionAreaChart powerConsumptionData={powerConsumptionData} /> {/* Use fetched data */}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
