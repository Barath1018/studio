'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';
import { analyzeSheet } from '@/ai/flows/analyze-sheet';
import type { BusinessMetrics } from '@/ai/schemas/business-metrics';
import DashboardPage from '@/components/dashboard/dashboard-page';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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

  // Enhance children with the necessary props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        metrics,
        loading,
        file,
        handleFileChange,
        handleFileUpload,
        // Pass specific parts of metrics to child pages
        reports: metrics?.reports,
        notifications: metrics?.notifications,
        chartData: metrics?.chartData,
      } as any);
    }
    return child;
  });

  return <DashboardPage>{childrenWithProps}</DashboardPage>;
}
