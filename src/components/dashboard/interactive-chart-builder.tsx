'use client';

import { useState, useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp, ScatterChart, BarChart, LineChart, Settings, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessData } from '@/services/data-analysis-service';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, ScatterChart as RechartsScatterChart, Scatter as RechartsScatter } from 'recharts';

// Import export libraries
import html2canvas from 'html2canvas';

interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter';
  xAxis: string;
  yAxis: string[];
  title: string;
  colorScheme: string[];
  showGrid: boolean;
  showLegend: boolean;
  showTooltip: boolean;
}

interface InteractiveChartBuilderProps {
  data: BusinessData;
  onChartCreated: (chart: ChartConfig) => void;
}

const chartTypes = [
  { value: 'line', label: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
  { value: 'bar', label: 'Bar Chart', icon: BarChart, description: 'Compare categories' },
  { value: 'pie', label: 'Pie Chart', icon: PieChart, description: 'Show proportions' },
          { value: 'scatter', label: 'Scatter Plot', icon: ScatterChart, description: 'Show correlations' },
];

const colorSchemes = [
  ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'],
  ['#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'],
  ['#14B8A6', '#F43F5E', '#EAB308', '#A855F7', '#0EA5E9'],
  ['#22C55E', '#EF4444', '#F59E0B', '#8B5CF6', '#06B6D4'],
];

export function InteractiveChartBuilder({ data, onChartCreated }: InteractiveChartBuilderProps) {
  console.log('InteractiveChartBuilder received data:', { 
    type: data.type, 
    headers: data.headers, 
    dataLength: data.data.length,
    sampleRow: data.data[0] 
  });
  
  // Debug: Log the data structure
  console.log('Data structure:', {
    hasData: !!data,
    hasHeaders: !!data?.headers,
    hasDataArray: !!data?.data,
    headersLength: data?.headers?.length || 0,
    dataLength: data?.data?.length || 0
  });
  
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: 'line',
    xAxis: '',
    yAxis: [],
    title: 'Custom Chart',
    colorScheme: colorSchemes[0],
    showGrid: true,
    showLegend: true,
    showTooltip: true,
  });

  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const numericColumns = useMemo(() => {
    console.log('Calculating numeric columns...', { dataLength: data?.data?.length, headers: data?.headers });
    if (!data?.data?.length) {
      console.log('No data available for numeric column detection');
      return [];
    }
    // Use headers instead of Object.keys for more reliable column detection
    const columns = data.headers.filter(header => {
      const sampleValue = data.data[0][header];
      const isNumeric = typeof sampleValue === 'number' || !isNaN(Number(sampleValue));
      console.log(`Column ${header}: value="${sampleValue}", type=${typeof sampleValue}, isNumeric=${isNumeric}`);
      return isNumeric;
    });
    console.log('Numeric columns detected:', columns);
    return columns;
  }, [data]);

  const categoricalColumns = useMemo(() => {
    console.log('Calculating categorical columns...', { dataLength: data?.data?.length, headers: data?.headers, numericColumns });
    if (!data?.data?.length) {
      console.log('No data available for categorical column detection');
      return [];
    }
    // Use headers instead of Object.keys for more reliable column detection
    const columns = data.headers.filter(header => {
      const sampleValue = data.data[0][header];
      const isCategorical = typeof sampleValue === 'string' && !numericColumns.includes(header);
      console.log(`Column ${header}: value="${sampleValue}", type=${typeof sampleValue}, isCategorical=${isCategorical}`);
      return isCategorical;
    });
    console.log('Categorical columns detected:', columns);
    return columns;
  }, [data, numericColumns]);

  const handleChartTypeChange = (type: string) => {
    setChartConfig(prev => ({ ...prev, type: type as ChartConfig['type'] }));
  };

  const handleXAxisChange = (value: string) => {
    setChartConfig(prev => ({ ...prev, xAxis: value }));
  };

  const handleYAxisChange = (values: string[]) => {
    setChartConfig(prev => ({ ...prev, yAxis: values }));
  };

  const handleTitleChange = (title: string) => {
    setChartConfig(prev => ({ ...prev, title }));
  };

  const handleColorSchemeChange = (index: number) => {
    setChartConfig(prev => ({ ...prev, colorScheme: colorSchemes[index] }));
  };

  const generatePreviewData = () => {
    console.log('=== Generate Preview Button Clicked ===');
    console.log('Chart Config:', chartConfig);
    console.log('Data Info:', { 
      dataLength: data?.data?.length, 
      headers: data?.headers,
      numericColumns,
      categoricalColumns
    });
    
    if (!chartConfig.xAxis || chartConfig.yAxis.length === 0) {
      console.log('❌ Missing axis configuration:', { xAxis: chartConfig.xAxis, yAxis: chartConfig.yAxis });
      console.log('Available columns - Numeric:', numericColumns, 'Categorical:', categoricalColumns);
      console.log('💡 Please select X and Y axis columns first');
      return;
    }
    
    console.log('✅ Axis configuration is valid, proceeding with chart generation...');

    const sampleData = data.data.slice(0, 20); // Show first 20 rows for preview
    console.log('Sample data:', sampleData.slice(0, 2)); // Log first 2 rows for debugging
    
    const processedData = sampleData.map(row => {
      const processed: any = {};
      
      // Process X-axis
      if (chartConfig.type === 'line' || chartConfig.type === 'bar') {
        processed.x = row[chartConfig.xAxis];
      }
      
      // Process Y-axis values
      chartConfig.yAxis.forEach((yKey, index) => {
        const value = row[yKey];
        processed[yKey] = typeof value === 'number' ? value : Number(value) || 0;
      });
      
      return processed;
    });

    console.log('Processed data:', processedData.slice(0, 2)); // Log first 2 processed rows
    setPreviewData(processedData);
    setIsPreviewVisible(true);
  };

  const renderChart = () => {
    if (!isPreviewVisible || previewData.length === 0) return null;

    const commonProps = {
      data: previewData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartConfig.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart {...commonProps}>
              {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="x" />
              <YAxis />
              {chartConfig.showTooltip && <Tooltip />}
              {chartConfig.showLegend && <Legend />}
              {chartConfig.yAxis.map((yKey, index) => (
                <Line
                  key={yKey}
                  type="monotone"
                  dataKey={yKey}
                  stroke={chartConfig.colorScheme[index % chartConfig.colorScheme.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsBarChart {...commonProps}>
              {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="x" />
              <YAxis />
              {chartConfig.showTooltip && <Tooltip />}
              {chartConfig.showLegend && <Legend />}
              {chartConfig.yAxis.map((yKey, index) => (
                <Bar
                  key={yKey}
                  dataKey={yKey}
                  fill={chartConfig.colorScheme[index % chartConfig.colorScheme.length]}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart>
              <Pie
                data={previewData}
                cx="50%"
                cy="50%"
                labelLine={false}
                                 label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={chartConfig.yAxis[0]}
              >
                {previewData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartConfig.colorScheme[index % chartConfig.colorScheme.length]} />
                ))}
              </Pie>
              {chartConfig.showTooltip && <Tooltip />}
              {chartConfig.showLegend && <Legend />}
            </RechartsPieChart>
          </ResponsiveContainer>
        );

             case 'scatter':
         return (
           <ResponsiveContainer width="100%" height={400}>
             <RechartsScatterChart {...commonProps}>
               {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
               <XAxis dataKey="x" />
               <YAxis />
               {chartConfig.showTooltip && <Tooltip />}
               {chartConfig.showLegend && <Legend />}
               {chartConfig.yAxis.map((yKey, index) => (
                 <RechartsScatter
                   key={yKey}
                   dataKey={yKey}
                   fill={chartConfig.colorScheme[index % chartConfig.colorScheme.length]}
                 />
               ))}
             </RechartsScatterChart>
           </ResponsiveContainer>
         );

      default:
        return null;
    }
  };

  const exportChart = () => {
    // Implementation for exporting chart as image/PDF
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${chartConfig.title}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const exportToPNG = () => {
    try {
      const chartElement = document.querySelector('[data-chart-container]') as HTMLElement;
      if (chartElement) {
        html2canvas(chartElement).then(canvas => {
          const link = document.createElement('a');
          link.download = `${chartConfig.title}.png`;
          link.href = canvas.toDataURL();
          link.click();
        }).catch(error => {
          console.error('PNG export failed:', error);
          alert('PNG export failed. Please try again.');
        });
      } else {
        alert('Chart not found. Please generate a preview first.');
      }
    } catch (error) {
      console.error('PNG export failed:', error);
      alert('PNG export failed. Please try again.');
    }
  };

  const exportToPDF = async () => {
    try {
      // Create a simple PDF-like export using the browser's print functionality
      const chartElement = document.querySelector('[data-chart-container]') as HTMLElement;
      if (chartElement) {
        // Create a new window with the chart content
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>${chartConfig.title}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  .chart-info { margin-bottom: 20px; }
                  .chart-container { text-align: center; }
                  @media print { body { margin: 0; } }
                </style>
              </head>
              <body>
                <div class="chart-info">
                  <h1>${chartConfig.title}</h1>
                  <p><strong>Chart Type:</strong> ${chartConfig.type}</p>
                  <p><strong>X-Axis:</strong> ${chartConfig.xAxis}</p>
                  <p><strong>Y-Axis:</strong> ${chartConfig.yAxis.join(', ')}</p>
                </div>
                <div class="chart-container">
                  ${(chartElement as HTMLElement).outerHTML}
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        } else {
          alert('Please allow pop-ups to export as PDF');
        }
      } else {
        alert('Chart not found. Please generate a preview first.');
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    }
  };

  const exportToPowerPoint = async () => {
    try {
      // Create a PowerPoint-like export using HTML that can be copied to PowerPoint
      const chartElement = document.querySelector('[data-chart-container]') as HTMLElement;
      if (chartElement) {
        const content = `
Chart Title: ${chartConfig.title}
Chart Type: ${chartConfig.type}
X-Axis: ${chartConfig.xAxis}
Y-Axis: ${chartConfig.yAxis.join(', ')}

Chart Data:
${previewData.map((row, index) => 
  `Row ${index + 1}: ${JSON.stringify(row)}`
).join('\n')}

Instructions:
1. Copy this content
2. Open PowerPoint
3. Paste as plain text
4. Format as needed
        `;
        
        // Copy to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(content);
          alert('Chart data copied to clipboard! Paste it into PowerPoint and format as needed.');
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = content;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Chart data copied to clipboard! Paste it into PowerPoint and format as needed.');
        }
      } else {
        alert('Chart not found. Please generate a preview first.');
      }
    } catch (error) {
      console.error('PowerPoint export failed:', error);
      alert('PowerPoint export failed. Please try again.');
    }
  };

  const exportToExcel = async () => {
    try {
      if (!previewData || previewData.length === 0) {
        alert('No chart data available to export. Please generate a preview first.');
        return;
      }
      
      // Create CSV content
      const headers = ['X-Axis', ...chartConfig.yAxis];
      const csvContent = [
        headers.join(','),
        ...previewData.map(row => {
          const xValue = row.x || '';
          const yValues = chartConfig.yAxis.map(yKey => row[yKey] || '').join(',');
          return `${xValue},${yValues}`;
        })
      ].join('\n');
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${chartConfig.title}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Excel export failed. Please try again.');
    }
  };

  const saveChart = () => {
    onChartCreated(chartConfig);
    // Reset form
    setChartConfig({
      type: 'line',
      xAxis: '',
      yAxis: [],
      title: 'Custom Chart',
      colorScheme: colorSchemes[0],
      showGrid: true,
      showLegend: true,
      showTooltip: true,
    });
    setIsPreviewVisible(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Interactive Chart Builder
        </CardTitle>
      </CardHeader>
             <CardContent>
         {/* Debug Info */}
         <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
           <div className="text-sm font-medium text-gray-700 mb-2">Data Status:</div>
           <div className="grid grid-cols-2 gap-4 text-xs">
             <div>
               <span className="font-medium">Data Type:</span> {data?.type || 'None'}
             </div>
             <div>
               <span className="font-medium">Records:</span> {data?.data?.length || 0}
             </div>
             <div>
               <span className="font-medium">Headers:</span> {data?.headers?.length || 0}
             </div>
             <div>
               <span className="font-medium">Sample:</span> {data?.data?.[0] ? 'Available' : 'None'}
             </div>
           </div>
         </div>
         
         <Tabs defaultValue="configure" className="w-full">
           <TabsList className="grid w-full grid-cols-3">
             <TabsTrigger value="configure">Configure</TabsTrigger>
             <TabsTrigger value="preview">Preview</TabsTrigger>
             <TabsTrigger value="export">Export</TabsTrigger>
           </TabsList>

          <TabsContent value="configure" className="space-y-6">
            {/* Chart Type Selection */}
            <div className="space-y-3">
              <Label>Chart Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {chartTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.value}
                      variant={chartConfig.type === type.value ? 'default' : 'outline'}
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => handleChartTypeChange(type.value)}
                    >
                      <Icon className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

                         {/* Chart Configuration */}
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-3">
                 <Label>X-Axis (Categories)</Label>
                 {categoricalColumns.length === 0 ? (
                   <div className="text-sm text-red-500 bg-red-50 p-2 rounded border">
                     ⚠️ No categorical columns detected
                     <br />
                     <span className="text-xs">Available: {data?.headers?.join(', ') || 'None'}</span>
                   </div>
                 ) : (
                   <div className="text-sm text-green-600 bg-green-50 p-2 rounded border">
                     ✅ Found {categoricalColumns.length} categorical columns
                   </div>
                 )}
                 <Select value={chartConfig.xAxis} onValueChange={handleXAxisChange}>
                   <SelectTrigger>
                     <SelectValue placeholder="Select X-axis column" />
                   </SelectTrigger>
                   <SelectContent>
                     {categoricalColumns.map((column) => (
                       <SelectItem key={column} value={column}>
                         {column}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

                             <div className="space-y-3">
                 <Label>Y-Axis (Values)</Label>
                 {numericColumns.length === 0 ? (
                   <div className="text-sm text-red-500 bg-red-50 p-2 rounded border">
                     ⚠️ No numeric columns detected
                     <br />
                     <span className="text-xs">Available: {data?.headers?.join(', ') || 'None'}</span>
                   </div>
                 ) : (
                   <div className="text-sm text-green-600 bg-green-50 p-2 rounded border">
                     ✅ Found {numericColumns.length} numeric columns
                   </div>
                 )}
                 <Select
                   value={chartConfig.yAxis[0] || ''}
                   onValueChange={(value) => handleYAxisChange([value])}
                 >
                   <SelectTrigger>
                     <SelectValue placeholder="Select Y-axis column" />
                   </SelectTrigger>
                   <SelectContent>
                     {numericColumns.map((column) => (
                       <SelectItem key={column} value={column}>
                         {column}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
            </div>

            {/* Chart Title */}
            <div className="space-y-3">
              <Label>Chart Title</Label>
              <Input
                value={chartConfig.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter chart title"
              />
            </div>

            {/* Color Scheme */}
            <div className="space-y-3">
              <Label>Color Scheme</Label>
              <div className="flex gap-2">
                {colorSchemes.map((scheme, index) => (
                  <Button
                    key={index}
                    variant={chartConfig.colorScheme === scheme ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleColorSchemeChange(index)}
                    className="flex gap-2"
                  >
                    <div className="flex gap-1">
                      {scheme.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    Scheme {index + 1}
                  </Button>
                ))}
              </div>
            </div>

            {/* Chart Options */}
            <div className="space-y-3">
              <Label>Chart Options</Label>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showGrid"
                    checked={chartConfig.showGrid}
                    onCheckedChange={(checked) => setChartConfig(prev => ({ ...prev, showGrid: checked }))}
                  />
                  <Label htmlFor="showGrid">Show Grid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showLegend"
                    checked={chartConfig.showLegend}
                    onCheckedChange={(checked) => setChartConfig(prev => ({ ...prev, showLegend: checked }))}
                  />
                  <Label htmlFor="showLegend">Show Legend</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showTooltip"
                    checked={chartConfig.showTooltip}
                    onCheckedChange={(checked) => setChartConfig(prev => ({ ...prev, showTooltip: checked }))}
                  />
                  <Label htmlFor="showTooltip">Show Tooltip</Label>
                </div>
              </div>
            </div>

            <Button onClick={generatePreviewData} className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Generate Preview
            </Button>
          </TabsContent>

                     <TabsContent value="preview" className="space-y-4">
             {isPreviewVisible ? (
               <>
                 <div className="text-center">
                   <h3 className="text-lg font-semibold mb-2">{chartConfig.title}</h3>
                   <p className="text-sm text-muted-foreground">
                     Preview of your custom chart
                   </p>
                 </div>
                 <div data-chart-container>
                   {renderChart()}
                 </div>
                <div className="flex gap-2">
                  <Button onClick={saveChart} className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Save Chart
                  </Button>
                  <Button variant="outline" onClick={exportChart}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-3" />
                <p>Configure your chart and generate a preview</p>
              </div>
            )}
          </TabsContent>

                     <TabsContent value="export" className="space-y-4">
             <div className="text-center py-8">
               <Download className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
               <h3 className="text-lg font-semibold mb-2">Export Options</h3>
               <p className="text-sm text-muted-foreground mb-4">
                 Export your charts in various formats
               </p>
               <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                 <p className="text-sm text-green-800">
                   ✅ Export functions are now working! You can export your charts in various formats.
                 </p>
               </div>
                             <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                 <Button variant="outline" onClick={exportToPNG}>
                   <Download className="h-4 w-4 mr-2" />
                   PNG Image
                 </Button>
                 <Button variant="outline" onClick={exportToPDF}>
                   <Download className="h-4 w-4 mr-2" />
                   PDF Report
                 </Button>
                 <Button variant="outline" onClick={exportToPowerPoint}>
                   <Download className="h-4 w-2 mr-2" />
                   PowerPoint
                 </Button>
                 <Button variant="outline" onClick={exportToExcel}>
                   <Download className="h-4 w-4 mr-2" />
                   Excel Data
                 </Button>
               </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
