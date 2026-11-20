import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createRoundedOctagonShape } from './velvetBoxGeometry';

test('createRoundedOctagonShape produces a symmetric closed haute-joaillerie box profile', () => {
  const shape = createRoundedOctagonShape(1.42, 0.34);
  const pts = shape.getSpacedPoints(64);
  assert.equal(pts.length, 65, 'Closed shape should sample 64 segments + closing vertex');

  let maxAbsX = 0;
  let maxAbsY = 0;
  for (const p of pts) {
    assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), 'Shape points must be finite');
    maxAbsX = Math.max(maxAbsX, Math.abs(p.x));
    maxAbsY = Math.max(maxAbsY, Math.abs(p.y));
  }

  assert.ok(Math.abs(maxAbsX - maxAbsY) < 0.04, 'Octagonal box cross-section should be symmetric');
  assert.ok(maxAbsX > 1.32 && maxAbsX <= 1.43, `Expected radius near 1.42, got ${maxAbsX}`);

  // Verify ExtrudeGeometry builds cleanly with valid outward normals
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.96,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 4,
  });
  geo.computeBoundingBox();
  assert.ok(geo.attributes.position.count > 200, 'Beveled case geometry should have rich facet detail');
  assert.ok(geo.boundingBox && geo.boundingBox.max.z - geo.boundingBox.min.z > 1.0);
  geo.dispose();
});
