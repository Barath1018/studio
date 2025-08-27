'use client';

import React, { useState } from 'react';
import type { BusinessMetrics } from '@/ai/schemas/business-metrics';
import DashboardPage from '@/components/dashboard/dashboard-page';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);

  // This function will be passed to the main page to update the layout's state
  const handleMetricsChange = (newMetrics: BusinessMetrics | null) => {
    setMetrics(newMetrics);
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Pass the metrics data and the handler function to the child page
      return React.cloneElement(child, {
        metrics,
        handleMetricsChange,
        // Pass specific parts of metrics for other pages to use
        reports: metrics?.reports,
        notifications: metrics?.notifications,
        chartData: metrics?.chartData,
      } as any);
    }
    return child;
  });

  return <DashboardPage>{childrenWithProps}</DashboardPage>;
}
