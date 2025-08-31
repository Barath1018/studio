// TEMPORARILY DISABLED - This AI flow is not needed for the file-based dashboard
// 'use server';
// /**
//  * @fileOverview A flow for generating realistic business intelligence metrics.
//  *
//  * - generateBusinessMetrics - Generates a comprehensive set of mock business data.
//  */

// import { ai } from '@/ai/genkit';
// import { BusinessMetrics, BusinessMetricsSchema } from '@/ai/schemas/business-metrics';
// import { z } from 'zod';
// import { fetchActiveCustomers } from '@/services/business-service';

// const getActiveCustomersTool = ai.defineTool(
//   {
//     name: 'getActiveCustomers',
//     description: 'Returns the current number of active customers for the business.',
//     outputSchema: z.number(),
//   },
//   async () => {
//     return await fetchActiveCustomers();
//   }
// )

// const prompt = ai.definePrompt({
//     name: 'businessMetricsPrompt',
//     output: { schema: BusinessMetricsSchema },
//     tools: [getActiveCustomersTool],
//     prompt: `You are a business intelligence analyst for a mid-sized e-commerce company called InsightEdge.

//     Your primary task is to use the available tools to fetch real-time data and then generate any remaining fictional-but-plausible data to complete the dashboard.

//     First, call the 'getActiveCustomers' call the 'getActiveCustomers' tool to get the precise number of active customers.
//     Then, create a new KPI card titled 'Active Customers'. The value for this card MUST be the number returned by the tool.

//     Finally, generate the rest of the data to be consistent and tell a plausible story for the current year. For example, revenue should be higher than expenses, and profit should be the difference. Chart data should show reasonable trends, not random noise.

//     Provide the following:
//     - 4 KPIs: Total Revenue, Total Expenses, Net Profit, and the 'Active Customers' KPI you just created.
//     - 12 months of sales and profit data for charts.
//     - 3 recent notifications of different types (success, warning, info).
//     - 5 recent reports of different types and statuses.
//     - 1 positive growth alert for the main dashboard.
//     `,
// });

// const generateBusinessMetricsFlow = ai.defineFlow(
//   {
//     name: 'generateBusinessMetricsFlow',
//     outputSchema: BusinessMetricsSchema,
//   },
//   async () => {
//     const { output } = await prompt();
//     return output!;
//     return output!;
//   }
// );


// export async function generateBusinessMetrics(): Promise<BusinessMetrics> {
//     return generateBusinessMetricsFlow();
// }
