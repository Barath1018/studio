/**
 * @fileOverview A mock service to simulate fetching data from a real business system.
 */

/**
 * Simulates calling an external API to get the current number of active customers.
 * In a real application, this would make an actual network request to a database or API.
 * @returns A promise that resolves to the number of active customers.
 */
export async function fetchActiveCustomers(): Promise<number> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 250));
  
  // In a real-world scenario, this would be a dynamic value from a database.
  // For this example, we'll return a consistent but realistic number.
  return 1423;
}
