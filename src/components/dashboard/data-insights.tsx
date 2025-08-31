'use client';

import { Lightbulb, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataSummary, Insight } from '@/services/data-analysis-service';

interface DataInsightsProps {
  dataSummary: DataSummary;
  insights: Insight[];
}

export function DataInsights({ dataSummary, insights }: DataInsightsProps) {
  const getDataQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'revenue':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'costs':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'operations':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'customers':
        return <Lightbulb className="h-5 w-5 text-purple-600" />;
      default:
        return <Lightbulb className="h-5 w-5 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Data Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Data Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {dataSummary.totalRecords.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {dataSummary.dateRange}
              </div>
              <div className="text-sm text-gray-600">Date Range</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Data Quality:</span>
              <Badge className={getDataQualityColor(dataSummary.dataQuality)}>
                {dataSummary.dataQuality.charAt(0).toUpperCase() + dataSummary.dataQuality.slice(1)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Missing Data:</span>
              <span className="text-sm font-medium">
                {dataSummary.missingData} records
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Duplicate Records:</span>
              <span className="text-sm font-medium">
                {dataSummary.duplicateRecords} records
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Business Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.category)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Lightbulb className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Upload data to see business insights</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

