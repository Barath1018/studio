'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, ScatterChart as RechartsScatterChart, Scatter as RechartsScatter } from 'recharts';
import { BusinessData } from '@/services/data-analysis-service';

interface ChartConfig {
  id: number;
  type: 'line' | 'bar' | 'pie' | 'scatter';
  xAxis: string;
  yAxis: string[];
  title: string;
  colorScheme: string[];
  showGrid: boolean;
  showLegend: boolean;
  showTooltip: boolean;
}

interface SavedChartRendererProps {
  chart: ChartConfig;
  data: BusinessData;
}

export function SavedChartRenderer({ chart, data }: SavedChartRendererProps) {
  // Process the data for this specific chart
  const chartData = useMemo(() => {
    if (!data?.data?.length || !chart.xAxis || chart.yAxis.length === 0) {
      return [];
    }

    // Use first 50 rows for better performance
    const sampleData = data.data.slice(0, 50);
    
    return sampleData.map(row => {
      const processed: any = {};
      
      // Process X-axis
      if (chart.type === 'line' || chart.type === 'bar') {
        processed.x = row[chart.xAxis];
      }
      
      // Process Y-axis values
      chart.yAxis.forEach((yKey) => {
        const value = row[yKey];
        processed[yKey] = typeof value === 'number' ? value : Number(value) || 0;
      });
      
      return processed;
    });
  }, [chart, data]);

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No data available for this chart</p>
        </div>
      );
    }

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chart.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart {...commonProps}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="x" />
              <YAxis />
              {chart.showTooltip && <Tooltip />}
              {chart.showLegend && <Legend />}
              {chart.yAxis.map((yKey, index) => (
                <Line
                  key={yKey}
                  type="monotone"
                  dataKey={yKey}
                  stroke={chart.colorScheme[index % chart.colorScheme.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart {...commonProps}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="x" />
              <YAxis />
              {chart.showTooltip && <Tooltip />}
              {chart.showLegend && <Legend />}
              {chart.yAxis.map((yKey, index) => (
                <Bar
                  key={yKey}
                  dataKey={yKey}
                  fill={chart.colorScheme[index % chart.colorScheme.length]}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey={chart.yAxis[0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chart.colorScheme[index % chart.colorScheme.length]} />
                ))}
              </Pie>
              {chart.showTooltip && <Tooltip />}
              {chart.showLegend && <Legend />}
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsScatterChart {...commonProps}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="x" />
              <YAxis />
              {chart.showTooltip && <Tooltip />}
              {chart.showLegend && <Legend />}
              {chart.yAxis.map((yKey, index) => (
                <RechartsScatter
                  key={yKey}
                  dataKey={yKey}
                  fill={chart.colorScheme[index % chart.colorScheme.length]}
                />
              ))}
            </RechartsScatterChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Unknown chart type: {chart.type}</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{chart.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
        <div className="mt-2 text-xs text-muted-foreground text-center">
          <p>Chart: {chart.type} | X: {chart.xAxis} | Y: {chart.yAxis.join(', ')}</p>
        </div>
      </CardContent>
    </Card>
  );
}

