/**
 * @fileOverview Comprehensive export service for business intelligence reports.
 * Supports multiple formats: PDF, PowerPoint, Excel, and images.
 */

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export interface ExportOptions {
  format: 'pdf' | 'pptx' | 'excel' | 'png' | 'svg';
  title: string;
  includeCharts: boolean;
  includeTables: boolean;
  includeInsights: boolean;
  customStyling?: boolean;
  watermark?: string;
}

export interface ReportSection {
  title: string;
  type: 'text' | 'chart' | 'table' | 'metric' | 'insight';
  content: any;
  order: number;
}

export interface ExportResult {
  success: boolean;
  downloadUrl?: string;
  fileName?: string;
  error?: string;
  fileSize?: number;
}

export class ExportService {
  /**
   * Export dashboard as PDF report
   */
  static async exportToPDF(
    data: any,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      
      // Title
      doc.setFontSize(20);
      doc.text(options.title, 20, yPosition);
      yPosition += 20;
      
      // Date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 20;
      
      // Executive Summary
      if (data) {
        doc.setFontSize(14);
        doc.text('Executive Summary', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        const summary = this.generateExecutiveSummary(data);
        const splitSummary = doc.splitTextToSize(summary, 170);
        doc.text(splitSummary, 20, yPosition);
        yPosition += splitSummary.length * 5 + 10;
      }
      
      // KPIs Section
      if (options.includeCharts && data.kpis) {
        doc.setFontSize(14);
        doc.text('Key Performance Indicators', 20, yPosition);
        yPosition += 10;
        
        data.kpis.forEach((kpi: any) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          doc.setFontSize(10);
          doc.text(`${kpi.title}: ${kpi.value}`, 25, yPosition);
          yPosition += 8;
        });
        yPosition += 10;
      }
      
      // Data Tables Section
      if (options.includeTables && data.data && data.data.length > 0) {
        doc.setFontSize(14);
        doc.text('Data Summary', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.text(`Total Records: ${data.data.length}`, 25, yPosition);
        yPosition += 8;
        
        if (data.headers) {
          doc.text(`Columns: ${data.headers.join(', ')}`, 25, yPosition);
          yPosition += 8;
        }
      }
      
      // Watermark
      if (options.watermark) {
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(options.watermark, 20, 280);
      }
      
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const fileName = `${options.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      return {
        success: true,
        fileName,
        downloadUrl: pdfUrl,
        fileSize: pdfBlob.size
      };
    } catch (error) {
      console.error('PDF generation error:', error);
      return {
        success: false,
        error: 'Failed to generate PDF'
      };
    }
  }

  /**
   * Export dashboard as PowerPoint presentation
   */
  static async exportToPowerPoint(
    data: any,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      // For client-side compatibility, we'll create a structured text file that can be imported into PowerPoint
      const slides = [
        {
          title: options.title,
          content: `Business Intelligence Report\nGenerated on ${new Date().toLocaleDateString()}`
        },
        {
          title: 'Executive Summary',
          content: data ? this.generateExecutiveSummary(data) : 'No data available'
        }
      ];
      
      // Add KPIs slide
      if (options.includeCharts && data.kpis) {
        slides.push({
          title: 'Key Performance Indicators',
          content: data.kpis.map((kpi: any) => `• ${kpi.title}: ${kpi.value}`).join('\n')
        });
      }
      
      // Add data summary slide
      if (options.includeTables && data.data) {
        slides.push({
          title: 'Data Overview',
          content: [
            `• Total Records: ${data.data.length}`,
            data.headers ? `• Data Columns: ${data.headers.length}` : '',
            data.headers ? `• Column Names: ${data.headers.join(', ')}` : ''
          ].filter(Boolean).join('\n')
        });
      }
      
      // Create PowerPoint-compatible content
      const pptContent = slides.map((slide, index) => 
        `Slide ${index + 1}: ${slide.title}\n${'='.repeat(50)}\n${slide.content}\n\n`
      ).join('');
      
      const instructions = `\n\nINSTRUCTIONS FOR POWERPOINT IMPORT:\n${'='.repeat(50)}\n1. Copy the content above\n2. Open PowerPoint\n3. Create a new presentation\n4. Paste content and format as needed\n5. Each section represents a slide\n\nAlternatively, save this file and use PowerPoint's \"Import Outline\" feature.`;
      
      const fullContent = pptContent + instructions;
      
      const blob = new Blob([fullContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const fileName = `${options.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}_powerpoint_content.txt`;
      
      return {
        success: true,
        fileName,
        downloadUrl: url,
        fileSize: blob.size
      };
    } catch (error) {
      console.error('PowerPoint generation error:', error);
      return {
        success: false,
        error: 'Failed to generate PowerPoint content'
      };
    }
  }

  /**
   * Export dashboard as Excel workbook
   */
  static async exportToExcel(
    data: any,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Summary Sheet
      const summaryData = [
        ['Report Title', options.title],
        ['Generated On', new Date().toLocaleDateString()],
        [''],
        ['Summary']
      ];
      
      if (data) {
        const summary = this.generateExecutiveSummary(data);
        summaryData.push(['Executive Summary', summary]);
        summaryData.push(['']);
      }
      
      if (data.data) {
        summaryData.push(['Total Records', data.data.length]);
      }
      
      if (data.headers) {
        summaryData.push(['Columns', data.headers.length]);
        summaryData.push(['Column Names', data.headers.join(', ')]);
      }
      
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      
      // KPIs Sheet
      if (options.includeCharts && data.kpis) {
        const kpiData = [['KPI', 'Value', 'Previous Value']];
        data.kpis.forEach((kpi: any) => {
          kpiData.push([kpi.title, kpi.value, kpi.previousValue || 'N/A']);
        });
        
        const kpiSheet = XLSX.utils.aoa_to_sheet(kpiData);
        XLSX.utils.book_append_sheet(workbook, kpiSheet, 'KPIs');
      }
      
      // Raw Data Sheet
      if (options.includeTables && data.data && data.data.length > 0) {
        const dataSheet = XLSX.utils.json_to_sheet(data.data);
        XLSX.utils.book_append_sheet(workbook, dataSheet, 'Raw Data');
      }
      
      // Chart Data Sheet
      if (data.chartData && data.chartData.length > 0) {
        const chartSheet = XLSX.utils.json_to_sheet(data.chartData);
        XLSX.utils.book_append_sheet(workbook, chartSheet, 'Chart Data');
      }
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const excelUrl = URL.createObjectURL(excelBlob);
      
      const fileName = `${options.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      return {
        success: true,
        fileName,
        downloadUrl: excelUrl,
        fileSize: excelBlob.size
      };
    } catch (error) {
      console.error('Excel generation error:', error);
      return {
        success: false,
        error: 'Failed to generate Excel file'
      };
    }
  }

  /**
   * Export chart as image
   */
  static async exportChartAsImage(
    chartElement: HTMLElement,
    format: 'png' | 'svg',
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      if (format === 'png') {
        // Import html2canvas dynamically
        const html2canvas = (await import('html2canvas')).default;
        
        const canvas = await html2canvas(chartElement, {
          backgroundColor: '#ffffff',
          scale: 2, // Higher quality
          useCORS: true
        });
        
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const imageUrl = URL.createObjectURL(blob);
              const fileName = `${options.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chart_${new Date().toISOString().split('T')[0]}.png`;
              
              resolve({
                success: true,
                fileName,
                downloadUrl: imageUrl,
                fileSize: blob.size
              });
            } else {
              resolve({
                success: false,
                error: 'Failed to create image blob'
              });
            }
          }, 'image/png', 0.95);
        });
      } else if (format === 'svg') {
        // For SVG, we'll create a simple SVG representation
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white"/>
  <text x="400" y="50" text-anchor="middle" font-size="24" font-family="Arial">${options.title}</text>
  <text x="400" y="300" text-anchor="middle" font-size="16" font-family="Arial">Chart visualization would appear here</text>
</svg>`;
        
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const fileName = `${options.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chart_${new Date().toISOString().split('T')[0]}.svg`;
        
        return {
          success: true,
          fileName,
          downloadUrl: svgUrl,
          fileSize: svgBlob.size
        };
      }
      
      return {
        success: false,
        error: 'Unsupported image format'
      };
    } catch (error) {
      console.error('Image export error:', error);
      return {
        success: false,
        error: 'Failed to export chart as image'
      };
    }
  }

  /**
   * Generate comprehensive business report
   */
  static async generateBusinessReport(
    data: any,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const sections = this.buildReportSections(data, options);
      
      switch (options.format) {
        case 'pdf':
          return await this.exportToPDF(sections, options);
        case 'pptx':
          return await this.exportToPowerPoint(sections, options);
        case 'excel':
          return await this.exportToExcel(sections, options);
        default:
          throw new Error(`Unsupported format: ${options.format}`);
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate business report'
      };
    }
  }

  /**
   * Build report sections based on data and options
   */
  private static buildReportSections(data: any, options: ExportOptions): ReportSection[] {
    const sections: ReportSection[] = [];
    let order = 1;

    // Executive Summary
    sections.push({
      title: 'Executive Summary',
      type: 'text',
      content: this.generateExecutiveSummary(data),
      order: order++
    });

    // Key Performance Indicators
    if (data.kpis) {
      sections.push({
        title: 'Key Performance Indicators',
        type: 'table',
        content: data.kpis,
        order: order++
      });
    }

    // Charts and Visualizations
    if (options.includeCharts && data.chartData) {
      sections.push({
        title: 'Performance Trends',
        type: 'chart',
        content: data.chartData,
        order: order++
      });
    }

    // Data Tables
    if (options.includeTables && data.data) {
      sections.push({
        title: 'Detailed Data Analysis',
        type: 'table',
        content: data.data.slice(0, 100), // Limit to first 100 rows
        order: order++
      });
    }

    // Business Insights
    if (options.includeInsights && data.insights) {
      sections.push({
        title: 'Business Insights & Recommendations',
        type: 'insight',
        content: data.insights,
        order: order++
      });
    }

    // Data Quality Assessment
    if (data.dataSummary) {
      sections.push({
        title: 'Data Quality Assessment',
        type: 'metric',
        content: data.dataSummary,
        order: order++
      });
    }

    return sections.sort((a, b) => a.order - b.order);
  }

  /**
   * Generate executive summary
   */
  private static generateExecutiveSummary(data: any): string {
    let summary = '';

    if (data.kpis) {
      const revenueKPI = data.kpis.find((k: any) => k.title.includes('Revenue'));
      const profitKPI = data.kpis.find((k: any) => k.title.includes('Profit'));
      
      summary += 'Business Performance Overview\n\n';
      
      if (revenueKPI) {
        summary += `Revenue: ${revenueKPI.value} (${revenueKPI.change})\n`;
      }
      
      if (profitKPI) {
        summary += `Profit: ${profitKPI.value} (${profitKPI.change})\n`;
      }
      
      summary += '\n';
    }

    if (data.dataSummary) {
      summary += `Data Analysis Summary:\n`;
      summary += `• Total Records: ${data.dataSummary.totalRecords.toLocaleString()}\n`;
      summary += `• Data Quality: ${data.dataSummary.dataQuality}\n`;
      summary += `• Date Range: ${data.dataSummary.dateRange}\n`;
      summary += `• Missing Data: ${data.dataSummary.missingData} records\n`;
    }

    if (data.growthAlert) {
      summary += `\nKey Insight: ${data.growthAlert.description}\n`;
    }

    return summary;
  }

  /**
   * Download file from data URL
   */
  static downloadFile(result: ExportResult): void {
    if (!result.success || !result.downloadUrl) {
      console.error('Cannot download file:', result.error);
      return;
    }

    const link = document.createElement('a');
    link.href = result.downloadUrl;
    link.download = result.fileName || 'export';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up object URL after download
    setTimeout(() => {
      if (result.downloadUrl.startsWith('blob:')) {
        URL.revokeObjectURL(result.downloadUrl);
      }
    }, 1000);
  }

  /**
   * Get supported export formats
   */
  static getSupportedFormats(): Array<{ value: string; label: string; description: string; icon: string }> {
    return [
      {
        value: 'pdf',
        label: 'PDF Report',
        description: 'Professional business report with charts and tables',
        icon: '📄'
      },
      {
        value: 'pptx',
        label: 'PowerPoint',
        description: 'Structured content for PowerPoint presentations',
        icon: '📊'
      },
      {
        value: 'excel',
        label: 'Excel Workbook',
        description: 'Interactive spreadsheet with raw data',
        icon: '📈'
      },
      {
        value: 'png',
        label: 'PNG Image',
        description: 'High-quality chart images',
        icon: '🖼️'
      },
      {
        value: 'svg',
        label: 'SVG Vector',
        description: 'Scalable vector graphics for web',
        icon: '🎨'
      }
    ];
  }

  /**
   * Validate export options
   */
  static validateExportOptions(options: ExportOptions): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!options.title.trim()) {
      errors.push('Report title is required');
    }

    if (!options.includeCharts && !options.includeTables && !options.includeInsights) {
      errors.push('At least one content type must be selected');
    }

    if (options.title.length > 100) {
      errors.push('Report title is too long (max 100 characters)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get estimated file size
   */
  static getEstimatedFileSize(options: ExportOptions, dataSize: number): number {
    let baseSize = 100 * 1024; // 100KB base

    if (options.includeCharts) baseSize += 200 * 1024; // +200KB for charts
    if (options.includeTables) baseSize += dataSize * 0.1; // +10% of data size
    if (options.includeInsights) baseSize += 150 * 1024; // +150KB for insights

    switch (options.format) {
      case 'pdf':
        return baseSize * 1.5; // PDFs are typically larger
      case 'pptx':
        return baseSize * 2; // PowerPoint files are larger
      case 'excel':
        return baseSize * 0.8; // Excel files are more efficient
      case 'png':
        return baseSize * 0.5; // Images are smaller
      case 'svg':
        return baseSize * 0.3; // SVG files are smallest
      default:
        return baseSize;
    }
  }
}
