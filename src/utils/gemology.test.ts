import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyGraCertificate, GEMOLOGICAL_COMPARISON_TABLE, STONE_CUTS_GUIDE } from './gemology';

test('GRA Certificate verification validates known certificates successfully', () => {
  const result = verifyGraCertificate('GRA-98241088');
  assert.equal(result.isValidFormat, true);
  assert.ok(result.certificate !== null);
  assert.equal(result.certificate?.colorGrade, 'D');
  assert.equal(result.certificate?.clarityGrade, 'VVS1');
  assert.equal(result.certificate?.shapeAndCut, 'Oval Brilliant');
});

test('GRA verification handles inputs without hyphens and normalizes lowercase', () => {
  const result = verifyGraCertificate('gra98241088');
  assert.equal(result.isValidFormat, true);
  assert.ok(result.certificate !== null);
  assert.equal(result.certificate?.certificateNumber, 'GRA-98241088');
});

test('GRA verification rejects invalid strings', () => {
  const result = verifyGraCertificate('invalid-xyz');
  assert.equal(result.isValidFormat, false);
  assert.equal(result.certificate, null);
});

test('Gemological table has complete 4C metrics and durability ratings', () => {
  const hardnessRow = GEMOLOGICAL_COMPARISON_TABLE.find(row => row.property.includes('Hardness'));
  assert.ok(hardnessRow);
  assert.equal(hardnessRow?.oneSoulMoissanite, '9.25 / 10');

  const cuts = STONE_CUTS_GUIDE;
  assert.ok(cuts.length >= 5);
  const oval = cuts.find(c => c.id === 'classic-oval');
  assert.ok(oval);
  assert.equal(oval?.facetsCount, 58);
});
