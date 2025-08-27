'use client';

import { Line, LineChart, CartesianGrid, XAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', children: 186 },
  { month: 'February', children: 305 },
  { month: 'March', children: 237 },
  { month: 'April', children: 273 },
  { month: 'May', children: 209 },
  { month: 'June', children: 214 },
];

const chartConfig = {
  children: {
    label: 'Children',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ChildrenOnboardedChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
          top: 5,
          bottom: 5
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Line
          dataKey="children"
          type="monotone"
          stroke="var(--color-children)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
