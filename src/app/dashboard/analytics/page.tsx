
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlySalesPerformanceChart } from '@/components/dashboard/monthly-sales-performance-chart';
import { ProfitTrendAnalysisChart } from '@/components/dashboard/profit-trend-analysis-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { SalesByCategoryChart } from '@/components/dashboard/verification-status-chart';
import { useBusinessData } from '@/contexts/business-data-context';

export default function AnalyticsPage() {
  const { businessData, loading } = useBusinessData();

  return (
    <>
      <div className="flex-1">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Deep dive into your business performance.
        </p>
      </div>
      <main className="flex flex-1 flex-col gap-4 pt-4 sm:px-6 sm:py-0 md:gap-8">
        {loading || !businessData ? (
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Monthly Sales Performance</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {businessData ? (
                  <MonthlySalesPerformanceChart data={businessData.chartData} />
                ) : (
                  <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                    Upload a business file to see analytics
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Profit Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {businessData ? (
                  <ProfitTrendAnalysisChart data={businessData.chartData} />
                ) : (
                  <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                    Upload a business file to see analytics
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
           <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Sales By Category</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
               <SalesByCategoryChart />
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
