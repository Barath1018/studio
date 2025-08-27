'use client';

import { Pie, PieChart, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { status: 'Verified', count: 10890, fill: 'var(--color-verified)' },
  { status: 'Pending', count: 1455, fill: 'var(--color-pending)' },
];

const chartConfig = {
  count: {
    label: 'Count',
  },
  verified: {
    label: 'Verified',
    color: 'hsl(var(--chart-1))',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function VerificationStatusChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[300px]"
    >
      <PieChart>
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="status"
          innerRadius={60}
          strokeWidth={5}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="status" />}
          className="-translate-y-[2px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
