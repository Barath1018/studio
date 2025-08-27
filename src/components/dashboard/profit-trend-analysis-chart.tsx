'use client';

import { Line, LineChart, CartesianGrid, XAxis, Tooltip, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { month: 'Jan', profit: 12000 },
  { month: 'Feb', profit: 15000 },
  { month: 'Mar', profit: 18000 },
  { month: 'Apr', profit: 17000 },
  { month: 'May', profit: 22000 },
  { month: 'Jun', profit: 28000 },
  { month: 'Jul', profit: 24000 },
  { month: 'Aug', profit: 20000 },
  { month: 'Sep', profit: 18000 },
  { month: 'Oct', profit: 8000 },
  { month: 'Nov', profit: 10000 },
  { month: 'Dec', profit: 17000 },
];

const chartConfig = {
  profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function ProfitTrendAnalysisChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
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
