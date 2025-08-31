'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EnhancedKPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  previousValue?: number;
}

export function EnhancedKPICard({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  previousValue 
}: EnhancedKPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeBadgeVariant = () => {
    switch (trend) {
      case 'up':
        return 'default';
      case 'down':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getCardBackground = () => {
    switch (title) {
      case 'Total Revenue':
        return 'bg-green-50';
      case 'Total Expenses':
        return 'bg-red-50';
      case 'Net Profit':
        return 'bg-blue-50';
      case 'Avg. Order Value':
        return 'bg-amber-50';
      default:
        return '';
    }
  };

  const getIconBackground = () => {
    switch (title) {
      case 'Total Revenue':
        return 'bg-green-100 text-green-600';
      case 'Total Expenses':
        return 'bg-red-100 text-red-600';
      case 'Net Profit':
        return 'bg-blue-100 text-blue-600';
      case 'Avg. Order Value':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${getCardBackground()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${getIconBackground()}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-2">
          <div className={`text-xs ${getTrendColor()}`}>
            {change}
          </div>
          {previousValue && (
            <div className="text-xs text-muted-foreground">
              Prev: {typeof previousValue === 'number' ? 
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0
                }).format(previousValue) : 
                previousValue
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

