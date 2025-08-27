'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlySalesPerformanceChart } from '@/components/dashboard/monthly-sales-performance-chart';
import { ProfitTrendAnalysisChart } from '@/components/dashboard/profit-trend-analysis-chart';

interface AnalyticsPageProps {
  chartData: { month: string; sales: number, profit: number }[];
}


export default function AnalyticsPage({ chartData }: Partial<AnalyticsPageProps>) {
  if (!chartData) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Deep dive into your business performance.
          </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Analytics Data</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Upload a CSV on the dashboard page to see your analytics.</p>
            </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <>
      <div className="flex-1">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Deep dive into your business performance.
        </p>
      </div>
      <main className="flex flex-1 flex-col gap-4 pt-4 sm:px-6 sm:py-0 md:gap-8">
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
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Customer Demographics</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {/* Placeholder for another chart */}
              <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                Chart coming soon
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {/* Placeholder for another chart */}
              <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                Chart coming soon
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
