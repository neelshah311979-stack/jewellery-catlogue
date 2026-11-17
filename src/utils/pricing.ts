import { GoldPurity, PricingBreakdown, Currency } from '../types/jewelry';

// Live benchmark defaults (per PRD: 18K gold rate is ₹6,150 / $73 per gram)
export const DEFAULT_LIVE_18K_GOLD_RATE_INR = 6150;
export const INR_TO_USD_RATE = 1 / 84.5; // ~84.5 INR per USD

/**
 * Purity factor relative to 18K gold rate (which is 750/1000 pure)
 * 24K base = 18K / 0.75 = 8,200 INR/g
 */
export const PURITY_FACTORS: Record<GoldPurity, { rateMultiplier: number; densityMultiplier: number }> = {
  '10K': { rateMultiplier: 417 / 750, densityMultiplier: 0.90 }, // ~0.556
  '14K': { rateMultiplier: 585 / 750, densityMultiplier: 0.95 }, // ~0.780
  '18K': { rateMultiplier: 1.0, densityMultiplier: 1.0 },        // 1.000 (Base)
  'Platinum 950': { rateMultiplier: 4200 / 6150, densityMultiplier: 1.33 }, // denser platinum
};

/**
 * Calculates exact transparent price per the One Soul PRD formula:
 * Total Price = (Exact Gold Weight in Grams × Live Gold Rate) + Moissanite Stone Cost + Fixed Atelier Making Charge
 */
export function calculateItemPrice(params: {
  baseGoldWeightGrams: number;
  goldPurity: GoldPurity;
  live18kGoldRateInr?: number;
  stoneCostInr: number;
  makingChargeInr: number;
  caratMultiplier?: number;
}): PricingBreakdown {
  const {
    baseGoldWeightGrams,
    goldPurity,
    live18kGoldRateInr = DEFAULT_LIVE_18K_GOLD_RATE_INR,
    stoneCostInr,
    makingChargeInr,
    caratMultiplier = 1.0,
  } = params;

  const purityInfo = PURITY_FACTORS[goldPurity] || PURITY_FACTORS['18K'];
  const effectiveWeight = Math.round(baseGoldWeightGrams * purityInfo.densityMultiplier * 100) / 100;
  const effectiveRate = Math.round(live18kGoldRateInr * purityInfo.rateMultiplier);

  const goldComponentInr = Math.round(effectiveWeight * effectiveRate);
  const adjustedStoneCostInr = Math.round(stoneCostInr * caratMultiplier);
  const makingCharge = Math.round(makingChargeInr);

  const totalPriceInr = goldComponentInr + adjustedStoneCostInr + makingCharge;
  const totalPriceUsd = Math.round(totalPriceInr * INR_TO_USD_RATE);

  return {
    goldWeightGrams: effectiveWeight,
    goldPurity,
    purityFactor: purityInfo.rateMultiplier,
    effectiveGoldRatePerGramInr: effectiveRate,
    goldComponentInr,
    stoneComponentInr: adjustedStoneCostInr,
    makingChargeInr: makingCharge,
    totalPriceInr,
    totalPriceUsd,
  };
}

/**
 * Format currency with proper symbols and commas
 */
export function formatCurrency(amountInr: number, currency: Currency): string {
  if (currency === 'USD') {
    const usdAmount = Math.round(amountInr * INR_TO_USD_RATE);
    return `$${usdAmount.toLocaleString('en-US')}`;
  }

  return `₹${amountInr.toLocaleString('en-IN')}`;
}

/**
 * Budget filter matcher per Section 7.1 of PRD
 * Instant budget filters: 'under_25k', '25k_to_50k', '50k_to_100k', 'above_100k'
 */
export function matchesBudget(priceInr: number, budgetTier: string): boolean {
  if (budgetTier === 'all') return true;
  if (budgetTier === 'under_25k') return priceInr < 25000;
  if (budgetTier === '25k_to_50k') return priceInr >= 25000 && priceInr <= 50000;
  if (budgetTier === '50k_to_100k') return priceInr > 50000 && priceInr <= 100000;
  if (budgetTier === 'above_100k') return priceInr > 100000;
  return true;
}
