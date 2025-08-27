'use client';

import {
  CheckCircle,
  CreditCard,
  DollarSign,
  Tag,
  TrendingUp,
} from 'lucide-react';

import { KpiCard } from '@/components/dashboard/kpi-card';
import { MonthlySalesPerformanceChart } from '@/components/dashboard/monthly-sales-performance-chart';
import { ProfitTrendAnalysisChart } from '@/components/dashboard/profit-trend-analysis-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Dashboard() {
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
          <AlertTitle className="font-semibold">
            Strong Revenue Growth
          </AlertTitle>
          <AlertDescription className="text-sm">
            Revenue increased by 12.6% this month. Great job!
          </AlertDescription>
        </Alert>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <KpiCard
            title="Total Revenue"
            value="$619,983"
            change="+$12,649 vs last month"
            icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
          />
          <KpiCard
            title="Total Expenses"
            value="$442,698"
            change="+$1,312 vs last month"
            icon={<CreditCard className="h-6 w-6 text-muted-foreground" />}
          />
          <KpiCard
            title="Net Profit"
            value="$177,285"
            change="+$6,325 vs last month"
            icon={<TrendingUp className="h-6 w-6 text-muted-foreground" />}
          />
          <KpiCard
            title="Avg. Order Value"
            value="+87.5%"
            change="+2.4% vs last month"
            icon={<Tag className="h-6 w-6 text-muted-foreground" />}
          />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Monthly Sales Performance</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <MonthlySalesPerformanceChart />
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Profit Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ProfitTrendAnalysisChart />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
