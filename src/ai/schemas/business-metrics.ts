/**
 * @fileOverview Defines the data structures for business intelligence metrics.
 *
 * - BusinessMetricsSchema - The Zod schema for the business metrics object.
 * - BusinessMetrics - The TypeScript type inferred from the schema.
 */

import { z } from 'zod';

const KpiSchema = z.object({
  title: z.string().describe('The title of the Key Performance Indicator (e.g., "Total Revenue").'),
  value: z.string().describe('The current value of the KPI (e.g., "$542,389" or "1,423").'),
  change: z.string().describe('The change from the previous period (e.g., "+$5,230 vs last month" or "+2.1%").'),
});

const ChartDataPointSchema = z.object({
  month: z.string().describe('The month abbreviation (e.g., "Jan", "Feb").'),
  sales: z.number().describe('The total sales for the month.'),
  profit: z.number().describe('The total profit for the month.'),
});

const NotificationSchema = z.object({
  title: z.string().describe('The title of the notification.'),
  description: z.string().describe('A brief description of the notification.'),
  time: z.string().describe('A relative time string (e.g., "2 hours ago").'),
  type: z.enum(['success', 'warning', 'info']).describe('The type of notification.'),
});

const ReportSchema = z.object({
    name: z.string().describe('The name of the report.'),
    date: z.string().describe('The date the report was generated, in YYYY-MM-DD format.'),
    type: z.string().describe('The category or type of the report (e.g., "Financial", "Sales").'),
    status: z.enum(['Final', 'Draft']).describe('The status of the report.'),
});


export const BusinessMetricsSchema = z.object({
  kpis: z.array(KpiSchema).describe('An array of 4 key performance indicators.'),
  chartData: z.array(ChartDataPointSchema).describe('An array of 12 data points for monthly charts.'),
  notifications: z.array(NotificationSchema).describe('An array of 3 recent notifications.'),
  reports: z.array(ReportSchema).describe('An array of 5 generated business reports.'),
  growthAlert: z.object({
    title: z.string().describe('A title for a significant business growth alert.'),
    description: z.string().describe('A description for the business growth alert.'),
  }),
});

export type BusinessMetrics = z.infer<typeof BusinessMetricsSchema>;
