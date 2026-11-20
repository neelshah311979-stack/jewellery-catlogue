import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  cushionRadiusAtAngle,
  createCushionBrilliantGeometry,
  createRoundBrilliantMeleeGeometry,
  createCathedralShankGeometry,
  createEagleClawProngGeometry,
  createCathedralArchGeometry,
  createCushionRailGeometry,
  computeShoulderPaveSpecs,
  computeHiddenHaloSpecs,
} from './ringGeometry';

function assertAllFinite(geo: THREE.BufferGeometry, name: string) {
  const pos = geo.attributes.position;
  assert.ok(pos && pos.count > 0, `${name} should have position vertices`);
  for (let i = 0; i < pos.count; i++) {
    assert.ok(Number.isFinite(pos.getX(i)), `${name} vertex ${i} X must be finite`);
    assert.ok(Number.isFinite(pos.getY(i)), `${name} vertex ${i} Y must be finite`);
    assert.ok(Number.isFinite(pos.getZ(i)), `${name} vertex ${i} Z must be finite`);
  }
  const norm = geo.attributes.normal;
  assert.ok(norm && norm.count === pos.count, `${name} should have matching normals`);
  for (let i = 0; i < norm.count; i++) {
    const len = Math.hypot(norm.getX(i), norm.getY(i), norm.getZ(i));
    assert.ok(Number.isFinite(len) && len > 0.5, `${name} normal ${i} must be valid unit-like vector`);
  }
}

test('cushionRadiusAtAngle produces symmetric squircle radii wider at diagonals than cardinals', () => {
  const rCardinal = cushionRadiusAtAngle(0, 1.0, 2.75);
  const rDiagonal = cushionRadiusAtAngle(Math.PI / 4, 1.0, 2.75);
  assert.ok(rDiagonal > rCardinal, 'Cushion cut should bulge subtly toward 45-degree corners');
  assert.ok(Math.abs(rCardinal - cushionRadiusAtAngle(Math.PI / 2, 1.0, 2.75)) < 1e-6);
});

test('createCushionBrilliantGeometry produces a flat-faceted non-indexed brilliant gem with valid crown and pavilion', () => {
  const geo = createCushionBrilliantGeometry(0.62);
  assert.equal(geo.index, null, 'Gemstone geometry must be non-indexed for razor-sharp flat facets');
  assertAllFinite(geo, 'CushionBrilliant');
  assert.ok(geo.attributes.position.count >= 300, 'Should have full multi-tier brilliant facets');

  const box = geo.boundingBox!;
  assert.ok(box.max.y > 0.18 && box.max.y < 0.25, 'Crown table height should match real gem proportions');
  assert.ok(box.min.y < -0.45 && box.min.y > -0.55, 'Pavilion culet depth should match ~61% depth ratio');

  // Verify every facet normal points outward from gem center (0, -0.1, 0)
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  let outwardCount = 0;
  for (let i = 0; i < pos.count; i += 3) {
    const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
    const cy = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3 + 0.1;
    const cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
    const dot = cx * norm.getX(i) + cy * norm.getY(i) + cz * norm.getZ(i);
    if (dot > 0) outwardCount++;
  }
  assert.equal(outwardCount, pos.count / 3, 'Every diamond facet normal must face strictly outward');
  geo.dispose();
});

test('createCathedralShankGeometry and sculpted setting parts are finite and properly bounded', () => {
  const shank = createCathedralShankGeometry(1.48);
  assertAllFinite(shank, 'CathedralShank');
  assert.ok(shank.index !== null, 'Shank should be indexed smooth geometry');

  const archL = createCathedralArchGeometry(-1);
  const archR = createCathedralArchGeometry(1);
  const rail = createCushionRailGeometry();
  const melee = createRoundBrilliantMeleeGeometry();

  assertAllFinite(archL, 'CathedralArchLeft');
  assertAllFinite(archR, 'CathedralArchRight');
  assertAllFinite(rail, 'CushionRail');
  assertAllFinite(melee, 'RoundBrilliantMelee');

  for (let i = 0; i < 4; i++) {
    const prong = createEagleClawProngGeometry(i);
    assertAllFinite(prong, `EagleClawProng-${i}`);
    assert.ok(prong.boundingBox!.max.y > 2.2, `Prong ${i} tip should rise above the gem girdle to clasp crown`);
    prong.dispose();
  }

  shank.dispose();
  archL.dispose();
  archR.dispose();
  rail.dispose();
  melee.dispose();
});

test('shoulder pavé and hidden-halo melee placements produce exact counts and finite transforms', () => {
  const { stones, beads } = computeShoulderPaveSpecs(1.48, 8);
  assert.equal(stones.length, 16, '8 melee stones per shoulder = 16 shoulder pavé stones');
  assert.equal(beads.length, 32, '2 shared gold bead prongs per shoulder melee stone');

  for (const spec of [...stones, ...beads]) {
    assert.ok(Number.isFinite(spec.position.x) && Number.isFinite(spec.position.y) && Number.isFinite(spec.position.z));
    assert.ok(spec.scale > 0);
  }

  const halo = computeHiddenHaloSpecs(0.555, 1.94, 16);
  assert.equal(halo.length, 16, 'Hidden halo should place 16 gallery melee diamonds');
  for (const h of halo) {
    assert.ok(Math.hypot(h.position.x, h.position.z) > 0.45);
  }
});
