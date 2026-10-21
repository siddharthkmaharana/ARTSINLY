/**
 * ARTSINLY MONETARY ARITHMETIC & INTEGER MINOR UNIT UTILITY
 * 
 * Database Rule:
 * "Store money as integer minor units, such as paise for INR, or use an appropriate
 *  exact decimal type. Never use floating-point arithmetic for payments."
 * 
 * Invariants:
 * 1. 1 INR = 100 paise. All database columns and API payment contracts operate in paise (Int).
 * 2. Strictly ZERO floating-point arithmetic (no `amount * 0.15` or float division).
 * 3. Proportional allocations use basis points (1 bp = 0.01% = 1/10000) with integer division.
 * 4. Remainder balancing guarantees conservation: `net + commission + tds === gross` always.
 */

export const BASIS_POINTS_DIVISOR = 10000;
export const PERCENT_DIVISOR = 100;

/**
 * Validate that a value is a strict, non-negative integer representation of minor units (paise).
 * Rejects NaN, Infinity, negative values, and non-integer floating points.
 */
export function validatePaise(paise: unknown): number {
  if (typeof paise !== "number" || !Number.isFinite(paise) || Number.isNaN(paise)) {
    throw new TypeError(`Invalid monetary amount: expected finite integer, received ${paise}`);
  }
  if (!Number.isInteger(paise)) {
    throw new TypeError(`Monetary violation: paise must be an exact integer without fractional decimals, received ${paise}`);
  }
  if (paise < 0) {
    throw new RangeError(`Monetary violation: negative amounts are not permitted, received ${paise}`);
  }
  return paise;
}

/**
 * Convert user-entered INR rupee string or numeric decimal into exact integer paise:
 * e.g. "126.99" => 12699 paise; 450 => 45000 paise; "0.50" => 50 paise.
 * Uses string splitting to completely bypass IEEE 754 floating-point precision flaws.
 */
export function rupeesToPaise(rupeesInput: string | number): number {
  if (typeof rupeesInput === "number") {
    if (!Number.isFinite(rupeesInput) || rupeesInput < 0) {
      throw new RangeError(`Invalid rupee number: ${rupeesInput}`);
    }
    // Convert to 2-decimal string to avoid float multiplication errors (e.g. 19.99 * 100 = 1998.9999999999998)
    rupeesInput = rupeesInput.toFixed(2);
  }

  const clean = rupeesInput.trim().replace(/,/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) {
    throw new TypeError(`Invalid rupee format: "${rupeesInput}". Expected format like "120" or "120.50".`);
  }

  const parts = clean.split(".");
  const whole = parseInt(parts[0], 10);
  const frac = parts[1] ? parts[1].padEnd(2, "0") : "00";
  const fractional = parseInt(frac.substring(0, 2), 10);

  return whole * 100 + fractional;
}

/**
 * Convert integer paise to human-readable Indian Rupee string:
 * e.g. 12699 paise => "126.99"
 */
export function paiseToRupeesString(paise: number): string {
  const validated = validatePaise(paise);
  const rupees = Math.floor(validated / 100);
  const remainder = validated % 100;
  return `${rupees}.${remainder.toString().padStart(2, "0")}`;
}

/**
 * Format integer paise into Indian locale currency display:
 * e.g. 12699 paise => "₹126.99"
 */
export function formatPaise(paise: number): string {
  const validated = validatePaise(paise);
  const rupees = Math.floor(validated / 100);
  const remainder = validated % 100;
  return `₹${rupees.toLocaleString("en-IN")}.${remainder.toString().padStart(2, "0")}`;
}

/**
 * Exact integer multiplication of unit price by item quantity.
 */
export function multiplyPaise(unitPricePaise: number, quantity: number): number {
  validatePaise(unitPricePaise);
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new RangeError(`Invalid quantity: ${quantity}`);
  }
  return unitPricePaise * quantity;
}

/**
 * Exact integer summation of minor units.
 */
export function sumPaise(amounts: number[]): number {
  return amounts.reduce((acc, curr) => {
    validatePaise(curr);
    return acc + curr;
  }, 0);
}

/**
 * Integer calculation of basis points (1 bp = 0.01% = 1/10000).
 * e.g. 1500 bps = 15.00%
 */
export function calculateBasisPointsPaise(amountPaise: number, basisPoints: number): number {
  validatePaise(amountPaise);
  if (!Number.isInteger(basisPoints) || basisPoints < 0) {
    throw new RangeError(`Invalid basis points: ${basisPoints}`);
  }
  return Math.floor((amountPaise * basisPoints) / BASIS_POINTS_DIVISOR);
}

/**
 * Integer calculation of percentage (e.g. 5% tax).
 */
export function calculatePercentagePaise(amountPaise: number, percentInt: number): number {
  validatePaise(amountPaise);
  if (!Number.isInteger(percentInt) || percentInt < 0) {
    throw new RangeError(`Invalid percentage: ${percentInt}`);
  }
  return Math.floor((amountPaise * percentInt) / PERCENT_DIVISOR);
}

export interface ArtisanSettlementBreakdown {
  grossPaise: number;
  commissionPaise: number;
  tdsPaise: number;
  netPaise: number;
  commissionRatePercent: number;
  tdsRatePercent: number;
  artisanSharePercent: number;
}

/**
 * Calculates fair-trade payout economics under Indian Section 194-O (1% TDS):
 * - Marketplace Commission: 15% (1500 basis points)
 * - Section 194-O TDS: 1% (100 basis points)
 * - Net to Artisan: Remainder (8400 basis points / 84%)
 * 
 * Strict Invariant:
 * netPaise + commissionPaise + tdsPaise === grossPaise (exact integer conservation)
 */
export function calculateFairTradeSettlement(grossPaiseInput: number): ArtisanSettlementBreakdown {
  const gross = Math.floor(validatePaise(grossPaiseInput));

  // Integer arithmetic: 1500 bps (15%) platform commission
  const commissionPaise = Math.floor((gross * 1500) / BASIS_POINTS_DIVISOR);

  // Integer arithmetic: 100 bps (1%) statutory TDS under Section 194-O
  const tdsPaise = Math.floor((gross * 100) / BASIS_POINTS_DIVISOR);

  // Remainder allocation guarantees zero penny-rounding leakage or discrepancy
  const netPaise = gross - commissionPaise - tdsPaise;

  // Invariant verification check
  if (commissionPaise + tdsPaise + netPaise !== gross) {
    throw new Error(`Critical monetary accounting invariant violated: ${commissionPaise} + ${tdsPaise} + ${netPaise} !== ${gross}`);
  }

  return {
    grossPaise: gross,
    commissionPaise,
    tdsPaise,
    netPaise,
    commissionRatePercent: 15,
    tdsRatePercent: 1,
    artisanSharePercent: 84,
  };
}
