'use client';

import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { month: 'Jan', sales: 45000 },
  { month: 'Feb', sales: 52000 },
  { month: 'Mar', sales: 63000 },
  { month: 'Apr', sales: 58000 },
  { month: 'May', sales: 47000 },
  { month: 'Jun', sales: 49000 },
  { month: 'Jul', sales: 54000 },
  { month: 'Aug', sales: 60000 },
  { month: 'Sep', sales: 56000 },
  { month: 'Oct', sales: 59000 },
  { month: 'Nov', sales: 65000 },
  { month: 'Dec', sales: 72000 },
];

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function MonthlySalesPerformanceChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart 
        accessibilityLayer 
        data={chartData} 
        margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
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
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
