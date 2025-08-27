'use server';
/**
 * @fileOverview A flow for generating realistic business intelligence metrics.
 *
 * - generateBusinessMetrics - Generates a comprehensive set of mock business data.
 */

import { ai } from '@/ai/genkit';
import { BusinessMetrics, BusinessMetricsSchema } from '@/ai/schemas/business-metrics';

const prompt = ai.definePrompt({
    name: 'businessMetricsPrompt',
    output: { schema: BusinessMetricsSchema },
    prompt: `You are a business intelligence analyst. Generate a realistic but fictional set of business metrics for a mid-sized e-commerce company called InsightEdge for the current year.

    The data should be consistent and tell a plausible story. For example, revenue should be higher than expenses, and profit should be the difference. Chart data should show reasonable trends, not random noise.

    Provide the following:
    - 4 KPIs: Total Revenue, Total Expenses, Net Profit, and Avg. Order Value.
    - 12 months of sales and profit data for charts.
    - 3 recent notifications of different types (success, warning, info).
    - 5 recent reports of different types and statuses.
    - 1 positive growth alert for the main dashboard.
    `,
});

const generateBusinessMetricsFlow = ai.defineFlow(
  {
    name: 'generateBusinessMetricsFlow',
    outputSchema: BusinessMetricsSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);


export async function generateBusinessMetrics(): Promise<BusinessMetrics> {
    return generateBusinessMetricsFlow();
}
