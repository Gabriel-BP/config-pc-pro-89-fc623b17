
/**
 * Simple currency conversion utility
 * Note: In a production environment, you would use a real API for current rates
 */

const exchangeRates: Record<string, number> = {
  'USD': 0.92, // 1 USD = 0.92 EUR
  'GBP': 1.17, // 1 GBP = 1.17 EUR
  '$': 0.92,   // Dollar symbol
  '£': 1.17,   // Pound symbol
  // Default to 1 for EUR or unknown currencies
};

/**
 * Convert a price from any currency to Euros
 * @param value The price value
 * @param currency The currency code or symbol
 * @returns The price in Euros
 */
export const convertToEuros = (value: number, currency: string): number => {
  // If it's already in euros, return the value
  if (currency === 'EUR' || currency === '€') {
    return value;
  }
  
  // Get the exchange rate, default to 1 if not found
  const rate = exchangeRates[currency] || 1;
  
  // Convert to EUR and round to 2 decimal places
  return Math.round((value * rate) * 100) / 100;
};

/**
 * Format a price in euros
 * @param value The price value in euros
 * @returns Formatted price string with euro symbol
 */
export const formatEuroPrice = (value: number): string => {
  return `${value.toFixed(2)} €`;
};
