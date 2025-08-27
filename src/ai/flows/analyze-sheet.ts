'use server';
/**
 * @fileOverview A flow for analyzing a CSV sheet to generate business metrics.
 *
 * - analyzeSheet - Analyzes CSV data and generates a business intelligence report.
 */

import { ai } from '@/ai/genkit';
import { BusinessMetrics, BusinessMetricsSchema } from '@/ai/schemas/business-metrics';
import { z } from 'zod';

const AnalyzeSheetInputSchema = z.object({
  sheet: z.string().describe('The full content of the CSV file as a single string.'),
});

const prompt = ai.definePrompt({
    name: 'sheetAnalysisPrompt',
    input: { schema: AnalyzeSheetInputSchema },
    output: { schema: BusinessMetricsSchema },
    prompt: `You are a business intelligence analyst. Your task is to analyze the provided CSV data and generate a full business metrics dashboard.

    The user has provided the following data from their business operations:
    \`\`\`csv
    {{{sheet}}}
    \`\`\`

    From this data, you must derive all the necessary information to populate the dashboard.
    - Calculate totals for revenue, expenses, and net profit.
    - Create KPI cards for these, including a plausible "change vs last month" metric.
    - If customer data is available, create a KPI for "Active Customers". If not, generate a realistic number.
    - Aggregate the data to provide 12 months of sales and profit data for charts. If the sheet doesn't cover 12 months, you must extrapolate creatively to fill the gaps.
    - Generate 3 recent notifications based on interesting events you find or infer from the data (e.g., a large sale, a spike in expenses).
    - Generate 5 recent reports. The names and types should reflect the data provided (e.g., "Q3 Sales Analysis").
    - Come up with 1 positive growth alert for the main dashboard based on a key insight from the data.
    `,
});

const analyzeSheetFlow = ai.defineFlow(
  {
    name: 'analyzeSheetFlow',
    inputSchema: AnalyzeSheetInputSchema,
    outputSchema: BusinessMetricsSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function analyzeSheet(input: z.infer<typeof AnalyzeSheetInputSchema>): Promise<BusinessMetrics> {
    return analyzeSheetFlow(input);
}
