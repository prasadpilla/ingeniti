import { TrendUp } from '@phosphor-icons/react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shadcn/ui/chart';

export interface PowerConsumptionData {
  deviceId: string;
  deviceName: string;
  timestamp: string;
  energy: number;
}

export interface PowerConsumptionChartProps {
  powerConsumptionData: PowerConsumptionData[];
}

const chartConfig = {
  used: {
    label: 'Usage',
    color: '#28a745',
  },
} satisfies ChartConfig;

export function PowerConsumptionAreaChart({ powerConsumptionData }: { powerConsumptionData: PowerConsumptionData[] }) {
  return (
    <div className="w-full rounded-lg border p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <TrendUp className="h-6 w-6 text-gray-700 mr-2" />
          <h2 className="text-2xl font-semibold">Device Power Consumption</h2>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="h-[300px] w-full mt-4">
        <AreaChart data={powerConsumptionData} margin={{ left: -10, right: -10, top: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="timestamp" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="gradientUsed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="energy"
            type="linear"
            fill="url(#gradientUsed)"
            stroke="#28a745"
            strokeWidth={3}
            stackId="1"
            name="Power Consumed"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
