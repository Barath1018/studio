'use client';

import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { region: 'North', children: 1860 },
  { region: 'East', children: 3050 },
  { region: 'South', children: 2370 },
  { region: 'West', children: 2730 },
  { region: 'Central', children: 2090 },
];

const chartConfig = {
  children: {
    label: 'Children',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function RegionalDistributionChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="region"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="children" fill="var(--color-children)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
