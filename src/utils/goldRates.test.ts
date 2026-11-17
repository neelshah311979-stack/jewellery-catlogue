import test from 'node:test';
import assert from 'node:assert/strict';
import { getFilteredGoldHistory, getRateForPurity, analyzeGoldTrend, DAILY_GOLD_RATE_HISTORY } from './goldRates';

test('daily gold history returns correct day slices', () => {
  const history7 = getFilteredGoldHistory(7);
  assert.equal(history7.length, 7);

  const history15 = getFilteredGoldHistory(15);
  assert.equal(history15.length, 15);

  const history30 = getFilteredGoldHistory(30);
  assert.equal(history30.length, 30);
});

test('rate for purity retrieves correct purity values', () => {
  const today = DAILY_GOLD_RATE_HISTORY[0];
  assert.equal(getRateForPurity(today, '24K'), 8200);
  assert.equal(getRateForPurity(today, '18K'), 6150);
  assert.equal(getRateForPurity(today, '14K'), 4797);
});

test('gold trend analysis calculates net change, high, and low accurately', () => {
  const history7 = getFilteredGoldHistory(7);
  const analysis = analyzeGoldTrend(history7, '18K');

  assert.equal(analysis.currentRate, 6150);
  assert.ok(analysis.highestRate >= analysis.lowestRate);
  assert.equal(analysis.highestRate, Math.max(...history7.map(r => r.rate18k)));
  assert.equal(analysis.lowestRate, Math.min(...history7.map(r => r.rate18k)));
  assert.equal(analysis.netChange, 6150 - history7[history7.length - 1].rate18k);
});
