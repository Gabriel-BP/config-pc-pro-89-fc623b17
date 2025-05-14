
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper function to safely parse string values from filters to numbers
 */
export function parseNumberFilter(value: string | number | undefined): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Helper function to safely parse boolean values from filters
 */
export function parseBooleanFilter(value: string | boolean | undefined): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lowercased = value.toLowerCase();
    if (lowercased === 'true' || lowercased === 'yes' || lowercased === 'si' || lowercased === 'sí') return true;
    if (lowercased === 'false' || lowercased === 'no') return false;
  }
  return undefined;
}

/**
 * Helper function to safely extract number from a string (e.g. "400 mm" -> 400)
 */
export function extractNumberFromString(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.match(/(\d+(\.\d+)?)/);
  if (match) {
    return parseFloat(match[1]);
  }
  return undefined;
}

/**
 * Extract and normalize numeric values for comparative operations 
 * For use with fields that might store values like "4.70 GHz"
 */
export function normalizeNumericField(value: any): number | null {
  // If already a number, return it
  if (typeof value === 'number') return value;
  
  // If undefined or null, return null
  if (value === undefined || value === null) return null;
  
  // If string, try to extract number
  if (typeof value === 'string') {
    // Extract numbers like "4.70" from strings like "4.70 GHz"
    const numberMatch = value.match(/(\d+(\.\d+)?)/);
    if (numberMatch) {
      return parseFloat(numberMatch[1]);
    }
  }
  
  return null;
}

/**
 * Create a MongoDB query for numeric range that handles both numeric fields
 * and string fields with embedded numeric values
 */
export function createNumericRangeQuery(fieldPath: string, minValue: number, maxValue: number) {
  return {
    $expr: {
      $and: [
        // Check if the field exists
        { $ne: [{ $type: `$${fieldPath}` }, "missing"] },
        {
          $let: {
            vars: {
              // Extract numeric value:
              // If field is a number, use it directly
              // If field is a string, extract numeric part using regex
              extractedValue: {
                $cond: {
                  if: { $eq: [{ $type: `$${fieldPath}` }, "number"] },
                  then: `$${fieldPath}`,
                  else: {
                    $cond: {
                      if: { $eq: [{ $type: `$${fieldPath}` }, "string"] },
                      then: {
                        $convert: {
                          input: { 
                            $regexFind: { 
                              input: `$${fieldPath}`, 
                              regex: /(\d+(\.\d+)?)/ 
                            } 
                          }.match,
                          to: "double",
                          onError: null,
                          onNull: null
                        }
                      },
                      else: null
                    }
                  }
                }
              }
            },
            in: {
              $and: [
                { $gte: ["$$extractedValue", minValue] },
                { $lte: ["$$extractedValue", maxValue] }
              ]
            }
          }
        }
      ]
    }
  };
}

