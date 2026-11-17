import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateItemPrice, formatCurrency, matchesBudget, DEFAULT_LIVE_18K_GOLD_RATE_INR } from './pricing';

test('pricing formula adheres strictly to Total = (Gold Weight * Rate) + Stone Cost + Making Charge', () => {
  const result = calculateItemPrice({
    baseGoldWeightGrams: 4.5,
    goldPurity: '18K',
    live18kGoldRateInr: 6150,
    stoneCostInr: 18000,
    makingChargeInr: 7500,
    caratMultiplier: 1.0,
  });

  const expectedGoldCost = 4.5 * 6150; // 27,675
  assert.equal(result.goldComponentInr, 27675);
  assert.equal(result.stoneComponentInr, 18000);
  assert.equal(result.makingChargeInr, 7500);
  assert.equal(result.totalPriceInr, 27675 + 18000 + 7500); // 53,175
  assert.ok(result.totalPriceUsd > 0);
});

test('pricing adapts correctly when 14K gold is selected', () => {
  const result18k = calculateItemPrice({
    baseGoldWeightGrams: 4.0,
    goldPurity: '18K',
    live18kGoldRateInr: DEFAULT_LIVE_18K_GOLD_RATE_INR,
    stoneCostInr: 15000,
    makingChargeInr: 6000,
  });

  const result14k = calculateItemPrice({
    baseGoldWeightGrams: 4.0,
    goldPurity: '14K',
    live18kGoldRateInr: DEFAULT_LIVE_18K_GOLD_RATE_INR,
    stoneCostInr: 15000,
    makingChargeInr: 6000,
  });

  // 14K should have lower gold cost than 18K due to lower gold purity
  assert.ok(result14k.goldComponentInr < result18k.goldComponentInr);
  assert.ok(result14k.totalPriceInr < result18k.totalPriceInr);
});

test('currency formatting renders correct currency symbols for INR and USD', () => {
  const formattedInr = formatCurrency(50000, 'INR');
  assert.ok(formattedInr.includes('₹') || formattedInr.includes('INR'));

  const formattedUsd = formatCurrency(50000, 'USD');
  assert.ok(formattedUsd.includes('$'));
});

test('budget tier matching groups products accurately', () => {
  assert.equal(matchesBudget(19500, 'under_25k'), true);
  assert.equal(matchesBudget(35000, 'under_25k'), false);
  assert.equal(matchesBudget(35000, '25k_to_50k'), true);
  assert.equal(matchesBudget(75000, '50k_to_100k'), true);
  assert.equal(matchesBudget(145000, 'above_100k'), true);
});
