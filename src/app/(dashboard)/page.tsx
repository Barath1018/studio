'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import {
  CheckCircle,
  CreditCard,
  DollarSign,
  Tag,
  TrendingUp,
  Users,
  Upload,
} from 'lucide-react';

import { KpiCard } from '@/components/dashboard/kpi-card';
import { MonthlySalesPerformanceChart } from '@/components/dashboard/monthly-sales-performance-chart';
import { ProfitTrendAnalysisChart } from '@/components/dashboard/profit-trend-analysis-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { analyzeSheet } from '@/ai/flows/analyze-sheet';
import type { BusinessMetrics } from '@/ai/schemas/business-metrics';

const iconMap: { [key: string]: React.ReactNode } = {
  'Total Revenue': <DollarSign className="h-6 w-6 text-muted-foreground" />,
  'Total Expenses': <CreditCard className="h-6 w-6 text-muted-foreground" />,
  'Net Profit': <TrendingUp className="h-6 w-6 text-muted-foreground" />,
  'Avg. Order Value': <Tag className="h-6 w-6 text-muted-foreground" />,
  'Active Customers': <Users className="h-6 w-6 text-muted-foreground" />,
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a CSV file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setMetrics(null);

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const csvText = Papa.unparse(results.data);
          const generatedMetrics = await analyzeSheet({ sheet: csvText });
          setMetrics(generatedMetrics);
        } catch (error) {
          console.error('Error analyzing sheet:', error);
          toast({
            title: 'Analysis Failed',
            description: 'Could not analyze the provided sheet.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      },
      error: (error: any) => {
        console.error('Error parsing CSV:', error);
        toast({
          title: 'Parsing Failed',
          description: error.message,
          variant: 'destructive',
        });
        setLoading(false);
      },
    });
  };

  return (
    <>
      <div className="flex-1">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your business performance
        </p>
      </div>
      <main className="flex flex-1 flex-col gap-4 pt-4 sm:px-6 sm:py-0 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Data</CardTitle>
            <CardDescription>
              Upload a CSV file with your business data to automatically populate
              the dashboard. The AI will analyze it for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-1 w-full">
              <Input type="file" accept=".csv" onChange={handleFileChange} className="w-full" />
               <p className="text-xs text-muted-foreground mt-1">
                Please provide a CSV with columns like 'Date', 'Product', 'Revenue', 'Expenses', etc.
              </p>
            </div>
            <Button onClick={handleFileUpload} disabled={loading || !file}>
              <Upload className="mr-2 h-4 w-4" />
              {loading ? 'Analyzing...' : 'Analyze Sheet'}
            </Button>
          </CardContent>
        </Card>

        {loading && (
          <div className="text-center p-8">
            <p>AI is analyzing your data... this may take a moment.</p>
          </div>
        )}

        {metrics && (
          <>
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
          </>
        )}
      </main>
    </>
  );
}
