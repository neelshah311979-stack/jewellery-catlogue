import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  RING_SHANK_INNER_RADIUS,
  computeRingFitScale,
  evaluateFingerProfile,
  createSculptedFingerGeometry,
  createSculptedNailGeometry,
  createSculptedPalmWristGeometry,
  buildSculptedLeftHand,
} from './handGeometry';

function assertFiniteGeometry(geo: THREE.BufferGeometry, label: string) {
  const pos = geo.getAttribute('position');
  const norm = geo.getAttribute('normal');
  assert.ok(pos && pos.count > 20, `${label} should have vertices`);
  assert.ok(norm && norm.count === pos.count, `${label} should have normals`);

  for (let i = 0; i < pos.count; i++) {
    assert.ok(Number.isFinite(pos.getX(i)), `${label} finite x`);
    assert.ok(Number.isFinite(pos.getY(i)), `${label} finite y`);
    assert.ok(Number.isFinite(pos.getZ(i)), `${label} finite z`);

    const nx = norm.getX(i);
    const ny = norm.getY(i);
    const nz = norm.getZ(i);
    const len = Math.hypot(nx, ny, nz);
    assert.ok(Number.isFinite(len) && len > 0.5 && len < 1.5, `${label} unit normal at ${i}`);
  }
}

test('computeRingFitScale produces a snug comfort-fit around elliptical fingers without clipping', () => {
  assert.equal(RING_SHANK_INNER_RADIUS, 1.48, 'Must match createCathedralShankGeometry innerRadius');
  const rx = 0.195;
  const rz = 0.175;
  const scale = computeRingFitScale(rx, rz);
  const scaledInnerRadius = RING_SHANK_INNER_RADIUS * scale;

  assert.ok(scaledInnerRadius > rx, 'Scaled ring inner bore must clear finger width');
  assert.ok(scaledInnerRadius > rz, 'Scaled ring inner bore must clear finger depth');
  assert.ok(scaledInnerRadius < rx * 1.04, 'Scaled ring should stay snug without any visible side air gap');
});

test('sculpted finger, nail, and palm-wrist geometries have finite vertices and outward normals', () => {
  const fingerGeo = createSculptedFingerGeometry({
    length: 2.3,
    baseRadiusX: 0.205,
    baseRadiusZ: 0.185,
  });
  assertFiniteGeometry(fingerGeo, 'sculpted finger');

  // Verify mid-finger side normals point outward radially (dot(radial, normal) > 0)
  const pos = fingerGeo.getAttribute('position');
  const norm = fingerGeo.getAttribute('normal');
  const midProfile = evaluateFingerProfile(0.5, {
    length: 2.3,
    baseRadiusX: 0.205,
    baseRadiusZ: 0.185,
    curlAngle: 0.14,
  });
  let midSamples = 0;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (Math.abs(y - midProfile.y) < 0.08) {
      const dx = pos.getX(i);
      const dz = pos.getZ(i) - midProfile.z;
      const dot = dx * norm.getX(i) + dz * norm.getZ(i);
      assert.ok(dot > 0, `Finger normal at vertex ${i} must point outward (dot=${dot})`);
      midSamples++;
    }
  }
  assert.ok(midSamples >= 12, 'Should verify outward normals around finger circumference');

  const nailGeo = createSculptedNailGeometry(0.22, 0.34, 0.055);
  assertFiniteGeometry(nailGeo, 'sculpted nail');

  const palmGeo = createSculptedPalmWristGeometry(32, 24);
  assertFiniteGeometry(palmGeo, 'sculpted palm-wrist');

  fingerGeo.dispose();
  nailGeo.dispose();
  palmGeo.dispose();
});

test('buildSculptedLeftHand orients ringAnchor so diamond faces dorsal +Z and ring wraps finger coaxially', () => {
  const skinMat = new THREE.MeshStandardMaterial();
  const nailMat = new THREE.MeshStandardMaterial();
  const rig = buildSculptedLeftHand(skinMat, nailMat);

  rig.handGroup.updateMatrixWorld(true);

  const worldQuat = new THREE.Quaternion();
  rig.ringAnchor.getWorldQuaternion(worldQuat);

  // In ringGroup local space, +Y is the diamond crown direction and +Z is the band bore axis
  const diamondDir = new THREE.Vector3(0, 1, 0).applyQuaternion(worldQuat).normalize();
  const boreAxis = new THREE.Vector3(0, 0, 1).applyQuaternion(worldQuat).normalize();

  assert.ok(diamondDir.z > 0.94, `Diamond must face dorsal +Z toward viewer (got z=${diamondDir.z.toFixed(3)})`);
  assert.ok(Math.abs(boreAxis.y) > 0.94, `Ring bore must align coaxially with finger Y-axis (got |y|=${Math.abs(boreAxis.y).toFixed(3)})`);

  // Verify anchor remains strictly locked to ringFingerGroup under arbitrary hand drag rotations
  rig.handGroup.position.set(0.1, -0.25, 0.3);
  rig.handGroup.rotation.set(0.35, -0.65, 0.18);
  rig.handGroup.scale.setScalar(1.15);
  rig.handGroup.updateMatrixWorld(true);

  const anchorWorldPos = new THREE.Vector3();
  rig.ringAnchor.getWorldPosition(anchorWorldPos);

  const expectedLocal = rig.ringAnchor.position.clone();
  const expectedWorld = expectedLocal.applyMatrix4(rig.ringFingerGroup.matrixWorld);
  assert.ok(anchorWorldPos.distanceTo(expectedWorld) < 1e-5, 'Ring anchor must stay strictly locked during hand rotation');

  // Verify every mesh using skinMaterial has a populated vertex color attribute (prevents black meshes when vertexColors=true)
  let skinMeshCount = 0;
  rig.handGroup.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.material === skinMat) {
      skinMeshCount++;
      const colorAttr = obj.geometry.getAttribute('color');
      assert.ok(
        colorAttr && colorAttr.count === obj.geometry.getAttribute('position').count,
        'Every skin mesh must include matching vertex color attributes'
      );
    }
  });
  assert.ok(skinMeshCount >= 8, `Expected palm, web saddles, and 5 digits to use skinMaterial (got ${skinMeshCount})`);

  rig.geometries.forEach((g) => g.dispose());
  skinMat.dispose();
  nailMat.dispose();
});
