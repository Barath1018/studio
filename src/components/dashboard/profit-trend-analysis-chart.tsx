'use client';

import { Line, LineChart, CartesianGrid, XAxis, Tooltip, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface ProfitTrendAnalysisChartProps {
    data: { month: string; profit: number }[];
}

export function ProfitTrendAnalysisChart({ data }: ProfitTrendAnalysisChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: -10,
          right: 20,
          top: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Line
          dataKey="profit"
          type="monotone"
          stroke="var(--color-profit)"
          strokeWidth={2}
          dot={{
            fill: "var(--color-profit)",
            r: 4,
            strokeWidth: 2,
            stroke: "hsl(var(--background))"
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
