'use server';

import {
  CheckCircle,
  CreditCard,
  DollarSign,
  Tag,
  TrendingUp,
  Users,
} from 'lucide-react';

import { KpiCard } from '@/components/dashboard/kpi-card';
import { MonthlySalesPerformanceChart } from '@/components/dashboard/monthly-sales-performance-chart';
import { ProfitTrendAnalysisChart } from '@/components/dashboard/profit-trend-analysis-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateBusinessMetrics } from '@/ai/flows/generate-business-metrics';

const iconMap: { [key: string]: React.ReactNode } = {
  'Total Revenue': <DollarSign className="h-6 w-6 text-muted-foreground" />,
  'Total Expenses': <CreditCard className="h-6 w-6 text-muted-foreground" />,
  'Net Profit': <TrendingUp className="h-6 w-6 text-muted-foreground" />,
  'Avg. Order Value': <Tag className="h-6 w-6 text-muted-foreground" />,
  'Active Customers': <Users className="h-6 w-6 text-muted-foreground" />,
};

export default async function Dashboard() {
  const metrics = await generateBusinessMetrics();
  const { kpis, chartData, growthAlert } = metrics;

  return (
    <>
      <div className="flex-1">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your business performance
        </p>
      </div>
      <main className="flex flex-1 flex-col gap-4 pt-4 sm:px-6 sm:py-0 md:gap-8">
        <Alert className="bg-green-50 border-green-200 text-green-800 [&>svg]:text-green-600">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="font-semibold">{growthAlert.title}</AlertTitle>
          <AlertDescription className="text-sm">
            {growthAlert.description}
          </AlertDescription>
        </Alert>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              icon={iconMap[kpi.title] || <DollarSign className="h-6 w-6 text-muted-foreground" />}
            />
          ))}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Monthly Sales Performance</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <MonthlySalesPerformanceChart data={chartData} />
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Profit Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ProfitTrendAnalysisChart data={chartData} />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
