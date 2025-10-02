/**
 * Robust price parser that handles all price format variations in the database
 */

/**
 * Parse a price value from various formats into a formatted string
 * Handles: numbers, strings with £, nested {from: value}, shorthand (£750k), ranges
 */
export function parsePrice(value: any): string | null {
  if (!value) return null;

  // Handle nested object with 'from' property
  if (typeof value === 'object' && value.from) {
    value = value.from;
  }

  // Handle direct numbers
  if (typeof value === 'number') {
    return `£${value.toLocaleString()}`;
  }

  // Handle strings
  if (typeof value === 'string') {
    // Remove £ and commas for processing
    let cleaned = value.replace(/£|,/g, '').trim();

    // Handle shorthand notation (750k, 1.2M, etc.)
    if (cleaned.match(/k$/i)) {
      const num = parseFloat(cleaned.replace(/k$/i, ''));
      if (!isNaN(num)) {
        return `£${(num * 1000).toLocaleString()}`;
      }
    }
    if (cleaned.match(/m$/i)) {
      const num = parseFloat(cleaned.replace(/m$/i, ''));
      if (!isNaN(num)) {
        return `£${(num * 1000000).toLocaleString()}`;
      }
    }

    // Handle ranges (keep as-is)
    if (cleaned.includes('-') || value.includes('to')) {
      return value.startsWith('£') ? value : `£${value}`;
    }

    // Try to parse as plain number
    const num = parseFloat(cleaned);
    if (!isNaN(num) && num > 0) {
      return `£${num.toLocaleString()}`;
    }

    // Return as-is if it already looks formatted
    if (value.startsWith('£')) {
      return value;
    }
  }

  return null;
}

/**
 * Extract price for a specific bedroom type from development prices object
 * Handles multiple key variations: 'studio', '1bed', '1-bed', 'oneBed', '1', etc.
 */
export function extractPriceFromDevelopment(
  prices: any,
  bedType: 'studio' | '1bed' | '2bed' | '3bed' | '4bed'
): string | null {
  if (!prices) return null;

  // Define all possible key variations for each bedroom type
  const keyVariations: Record<string, string[]> = {
    studio: ['studio', 'Studio', 'STUDIO', '0', '0bed', '0-bed'],
    '1bed': ['1bed', '1-bed', 'oneBed', 'one_bed', '1', '1 bed', '1Bed', '1-Bed'],
    '2bed': ['2bed', '2-bed', 'twoBed', 'two_bed', '2', '2 bed', '2Bed', '2-Bed'],
    '3bed': ['3bed', '3-bed', 'threeBed', 'three_bed', '3', '3 bed', '3Bed', '3-Bed'],
    '4bed': ['4bed', '4-bed', 'fourBed', 'four_bed', '4', '4 bed', '4Bed', '4-Bed']
  };

  const possibleKeys = keyVariations[bedType] || [];

  // Try each possible key variation
  for (const key of possibleKeys) {
    if (prices[key] !== undefined && prices[key] !== null) {
      const parsed = parsePrice(prices[key]);
      if (parsed) return parsed;
    }
  }

  return null;
}

/**
 * Extract all available prices from a development's prices object
 * Returns an object with standardized bedroom type keys
 */
export function extractAllPrices(prices: any): {
  studio: string | null;
  oneBed: string | null;
  twoBed: string | null;
  threeBed: string | null;
  fourBed: string | null;
  range: string | null;
} {
  if (!prices) {
    return {
      studio: null,
      oneBed: null,
      twoBed: null,
      threeBed: null,
      fourBed: null,
      range: null
    };
  }

  return {
    studio: extractPriceFromDevelopment(prices, 'studio'),
    oneBed: extractPriceFromDevelopment(prices, '1bed'),
    twoBed: extractPriceFromDevelopment(prices, '2bed'),
    threeBed: extractPriceFromDevelopment(prices, '3bed'),
    fourBed: extractPriceFromDevelopment(prices, '4bed'),
    range: prices.range ? (typeof prices.range === 'string' ? prices.range : null) : null
  };
}
