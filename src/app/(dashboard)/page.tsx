import {
  CheckCircle,
  CreditCard,
  DollarSign,
  Tag,
  TrendingUp,
  Users,
} from 'lucide-react';
import { generateBusinessMetrics } from '@/ai/flows/generate-business-metrics';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { MonthlySalesPerformanceChart } from '@/components/dashboard/monthly-sales-performance-chart';
import { ProfitTrendAnalysisChart } from '@/components/dashboard/profit-trend-analysis-chart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import React from 'react';

const iconMap: { [key: string]: React.ReactNode } = {
  'Total Revenue': <DollarSign className="h-6 w-6 text-muted-foreground" />,
  'Total Expenses': <CreditCard className="h-6 w-6 text-muted-foreground" />,
  'Net Profit': <TrendingUp className="h-6 w-6 text-muted-foreground" />,
  'Avg. Order Value': <Tag className="h-6 w-6 text-muted-foreground" />,
  'Active Customers': <Users className="h-6 w-6 text-muted-foreground" />,
};

export default async function Dashboard() {
  const metrics = await generateBusinessMetrics();

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
          <AlertTitle className="font-semibold">{metrics.growthAlert.title}</AlertTitle>
          <AlertDescription className="text-sm">
            {metrics.growthAlert.description}
          </AlertDescription>
        </Alert>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {metrics.kpis.map((kpi) => (
            <KpiCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              icon={
                iconMap[kpi.title] || (
                  <DollarSign className="h-6 w-6 text-muted-foreground" />
                )
              }
            />
          ))}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Monthly Sales Performance</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <MonthlySalesPerformanceChart data={metrics.chartData} />
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Profit Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ProfitTrendAnalysisChart data={metrics.chartData} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.reports.slice(0, 3).map((report) => (
                    <TableRow key={report.name}>
                      <TableCell className="font-medium">
                        {report.name}
                      </TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report.status === 'Final' ? 'default' : 'secondary'
                          }
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {metrics.notifications.map((notification, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    {notification.time}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
