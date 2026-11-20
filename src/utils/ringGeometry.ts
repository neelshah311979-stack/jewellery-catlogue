import * as THREE from 'three';

export interface RingTransformSpec {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: number;
}

/**
 * Evaluates a squircle (superellipse) radial contour used for Royal Crown Cushion cuts.
 * exponent = 2 gives a perfect circle; ~2.7 gives a classic pillowed cushion square.
 */
export function cushionRadiusAtAngle(angle: number, baseRadius: number, exponent = 2.75): number {
  const c = Math.abs(Math.cos(angle));
  const s = Math.abs(Math.sin(angle));
  const norm = Math.pow(Math.pow(c, exponent) + Math.pow(s, exponent), 1 / exponent);
  // Normalize so average/flat radius aligns cleanly with baseRadius
  return (baseRadius / Math.max(norm, 1e-4)) * 0.94;
}

/**
 * Generates an authentic, razor-sharp flat-faceted Cushion-Modified Brilliant gemstone
 * (57+ facet architecture: octagonal table, 8 star facets, 8 kite/bezel facets,
 * 16 upper girdle facets, crisp faceted girdle, 16 lower girdle facets, 8 pavilion mains, and culet).
 *
 * Local coordinate convention:
 * - Girdle plane centered at y = 0
 * - Crown rises toward +Y (table at +0.34 * radius)
 * - Pavilion tapers toward -Y (culet at -0.80 * radius)
 */
export function createCushionBrilliantGeometry(radius = 0.62, cushionExponent = 2.75): THREE.BufferGeometry {
  const positions: number[] = [];

  const pushTri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  };

  // Helper to create a point on a contoured cushion ring at angle theta
  const ringPt = (theta: number, rScale: number, y: number, exp = cushionExponent): THREE.Vector3 => {
    const r = cushionRadiusAtAngle(theta, radius * rScale, exp);
    return new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r);
  };

  const tableY = radius * 0.34;
  const crownMidY = radius * 0.195;
  const girdleTopY = radius * 0.028;
  const girdleBotY = -radius * 0.028;
  const pavMidY = -radius * 0.33;
  const culetY = -radius * 0.80;

  const tableCenter = new THREE.Vector3(0, tableY, 0);
  const culet = new THREE.Vector3(0, culetY, 0);

  // Offset by PI/8 so flat sides of the cushion align cleanly with X and Z axes
  const baseOffset = Math.PI / 8;

  // 8 Table vertices (aligned with star valleys)
  const tableRing: THREE.Vector3[] = [];
  // 8 Mid-crown vertices (rotated by PI/8 relative to tableRing -> creates authentic Star + Kite bezel facets)
  const crownMidRing: THREE.Vector3[] = [];
  // 16 Upper & Lower Girdle vertices
  const girdleTop: THREE.Vector3[] = [];
  const girdleBot: THREE.Vector3[] = [];
  // 8 Pavilion Mid vertices (breaks pavilion into crisp lower-girdle + main pavilion facets)
  const pavMidRing: THREE.Vector3[] = [];

  for (let i = 0; i < 8; i++) {
    const aTable = baseOffset + (i * Math.PI * 2) / 8;
    const aMid = aTable + Math.PI / 8;
    tableRing.push(ringPt(aTable, 0.56, tableY, cushionExponent * 0.92));
    crownMidRing.push(ringPt(aMid, 0.79, crownMidY, cushionExponent));
    pavMidRing.push(ringPt(aMid, 0.58, pavMidY, cushionExponent * 0.9));
  }

  for (let i = 0; i < 16; i++) {
    const aGirdle = baseOffset + (i * Math.PI * 2) / 16;
    girdleTop.push(ringPt(aGirdle, 1.0, girdleTopY, cushionExponent));
    girdleBot.push(ringPt(aGirdle, 1.0, girdleBotY, cushionExponent));
  }

  // 1. Flat Table (8 triangles forming a mirror-flat octagonal cushion top, outward normal +Y)
  for (let i = 0; i < 8; i++) {
    const next = (i + 1) % 8;
    pushTri(tableCenter, tableRing[next], tableRing[i]);
  }

  // 2. Crown Star, Kite/Bezel, and Upper Girdle facets
  for (let i = 0; i < 8; i++) {
    const next = (i + 1) % 8;
    const prev = (i + 7) % 8;
    const gEven = (2 * i) % 16;         // aligned with tableRing[i]
    const gOdd = (2 * i + 1) % 16;      // aligned with crownMidRing[i]
    const gNextEven = (2 * i + 2) % 16; // aligned with tableRing[next]

    // Star facet: connects table edge (tableRing[i]..tableRing[next]) down to crownMidRing[i]
    pushTri(tableRing[i], tableRing[next], crownMidRing[i]);

    // Bezel / Kite facet upper half + lower half (split along tableRing[i] -> girdleTop[gEven])
    // Connects tableRing[i] to crownMidRing[prev], girdleTop[gEven], crownMidRing[i]
    pushTri(tableRing[i], crownMidRing[i], girdleTop[gEven]);
    pushTri(tableRing[i], girdleTop[gEven], crownMidRing[prev]);

    // Upper girdle facets flanking crownMidRing[i]
    pushTri(crownMidRing[i], girdleTop[gOdd], girdleTop[gEven]);
    pushTri(crownMidRing[i], girdleTop[gNextEven], girdleTop[gOdd]);
  }

  // 3. Faceted Girdle Waist (16 crisp vertical rectangular bands -> 32 triangles)
  for (let i = 0; i < 16; i++) {
    const next = (i + 1) % 16;
    pushTri(girdleTop[i], girdleTop[next], girdleBot[next]);
    pushTri(girdleTop[i], girdleBot[next], girdleBot[i]);
  }

  // 4. Lower Girdle & Pavilion Main Facets tapering cleanly to Culet
  for (let i = 0; i < 8; i++) {
    const prev = (i + 7) % 8;
    const gEven = (2 * i) % 16;
    const gOdd = (2 * i + 1) % 16;
    const gNextEven = (2 * i + 2) % 16;

    // Lower girdle facets connecting girdleBot -> pavMidRing[i]
    pushTri(girdleBot[gEven], girdleBot[gOdd], pavMidRing[i]);
    pushTri(girdleBot[gOdd], girdleBot[gNextEven], pavMidRing[i]);

    // Pavilion Main facets connecting girdleBot[gEven], pavMidRing[prev/i], and culet
    pushTri(girdleBot[gEven], pavMidRing[i], culet);
    pushTri(girdleBot[gEven], culet, pavMidRing[prev]);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

/**
 * Generates a crisp flat-faceted Round Brilliant melee diamond (used for InstancedMesh
 * micro-pavé shoulder stones and hidden-halo collar stones).
 */
export function createRoundBrilliantMeleeGeometry(radius = 0.048): THREE.BufferGeometry {
  return createCushionBrilliantGeometry(radius, 2.0);
}

/**
 * Generates a sculpted Comfort-Fit Cathedral Solitaire Ring Shank with a genuine
 * D-shaped court cross-section (gently curved interior for comfort fit, crisp lustrous
 * outer dome, graceful cathedral shoulder taper & rise toward the crown seat).
 *
 * Ring lies in the XY plane with finger axis along Z, crown centered at +Y (angle = PI/2).
 */
export function createCathedralShankGeometry(
  innerRadius = 1.48,
  tubularSegments = 96,
  radialSegments = 24
): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= tubularSegments; i++) {
    const u = i / tubularSegments;
    // Start at bottom (-PI/2) and sweep full 360° around XY plane
    const theta = -Math.PI / 2 + u * Math.PI * 2;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    // Distance from top crown apex (theta = +PI/2 -> sinT = 1)
    const crownProximity = Math.max(0, sinT); // 0 on bottom half, 1 at top crown
    // Subtle cathedral shoulder thickening/rise right before the crown gallery
    const shoulderBell = Math.exp(-Math.pow((theta - Math.PI / 2) / 0.52, 2));
    // Slight pinch right at the very top bridge under the stone gallery
    const underGalleryPinch = Math.exp(-Math.pow((theta - Math.PI / 2) / 0.16, 2));

    // Radial height (thickness) of the band: slender at base (0.145), sculpted deeper at cathedral shoulders (0.195), sleek bridge under gallery (0.125)
    const bandHeight = 0.145 + shoulderBell * 0.055 - underGalleryPinch * 0.065;
    // Axial width across finger (Z): substantial luxury width (0.24 at base, 0.25 at shoulders, narrowing gracefully to 0.17 at gallery bridge)
    const bandHalfWidth = (0.125 + crownProximity * 0.015 - underGalleryPinch * 0.038);

    // Comfort-fit inner radius stays circular for the finger
    const rInner = innerRadius;

    for (let j = 0; j <= radialSegments; j++) {
      const v = j / radialSegments;
      const phi = v * Math.PI * 2;

      // D-profile court cross-section in local (radialOffset, axialZ):
      // sin(phi) >= 0 is outer lustrous dome; sin(phi) < 0 is gently curved comfort-fit interior
      const zNorm = Math.cos(phi);
      const sPhi = Math.sin(phi);

      let radialOffset: number;
      if (sPhi >= 0) {
        // Outer high-dome luxury court profile with crisp shoulder fullness
        radialOffset = bandHeight * (0.18 + 0.82 * Math.pow(sPhi, 0.84));
      } else {
        // Comfort-fit gently domed interior (flatter than outer profile)
        radialOffset = bandHeight * (0.18 + 0.18 * sPhi);
      }

      const r = rInner + radialOffset;
      // Softly bevel the edges slightly along Z
      const z = zNorm * bandHalfWidth * (sPhi >= 0 ? 1.0 - 0.08 * Math.pow(sPhi, 2) : 0.96);

      const x = cosT * r;
      const y = sinT * r;

      positions.push(x, y, z);
      uvs.push(u * 4, v);
    }
  }

  const stride = radialSegments + 1;
  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);
      indices.push(a, d, b);
      indices.push(b, d, c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

/**
 * Creates a gracefully swept tapered tubular geometry along a CatmullRomCurve3,
 * used for sculpted cathedral shoulder arches and tapered eagle-claw prongs.
 */
export function createTaperedTubeGeometry(
  curve: THREE.CatmullRomCurve3,
  radiusStart: number,
  radiusMid: number,
  radiusEnd: number,
  tubularSegments = 28,
  radialSegments = 12
): THREE.BufferGeometry {
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const pt = new THREE.Vector3();
  const vertex = new THREE.Vector3();

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    curve.getPointAt(t, pt);
    const N = frames.normals[i];
    const B = frames.binormals[i];

    // Smooth quadratic Bezier radius taper along curve length
    const invT = 1 - t;
    const radius = invT * invT * radiusStart + 2 * invT * t * radiusMid + t * t * radiusEnd;

    for (let j = 0; j <= radialSegments; j++) {
      const v = j / radialSegments;
      const phi = v * Math.PI * 2;
      const cosP = Math.cos(phi);
      const sinP = Math.sin(phi);

      vertex.copy(pt)
        .addScaledVector(N, cosP * radius)
        .addScaledVector(B, sinP * radius);

      positions.push(vertex.x, vertex.y, vertex.z);
      uvs.push(t, v);
    }
  }

  const stride = radialSegments + 1;
  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);
      indices.push(a, d, b);
      indices.push(b, d, c);
    }
  }

  // Cap the tip cleanly so eagle-claw prongs are closed solids
  const tipCenterIdx = positions.length / 3;
  const endPt = curve.getPointAt(1);
  const endTan = curve.getTangentAt(1);
  positions.push(
    endPt.x + endTan.x * radiusEnd * 0.9,
    endPt.y + endTan.y * radiusEnd * 0.9,
    endPt.z + endTan.z * radiusEnd * 0.9
  );
  uvs.push(1, 0.5);

  const lastRingStart = tubularSegments * stride;
  for (let j = 0; j < radialSegments; j++) {
    indices.push(lastRingStart + j, lastRingStart + j + 1, tipCenterIdx);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

/**
 * Generates one of the 4 sculpted jewelers' eagle-claw prongs hugging the corners of
 * the Royal Crown Cushion gemstone.
 */
export function createEagleClawProngGeometry(
  cornerIndex: number,
  gemCenterY = 2.08,
  gemRadius = 0.62,
  baseY = 1.62
): THREE.BufferGeometry {
  const angle = Math.PI / 4 + (cornerIndex * Math.PI) / 2;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  // Corner distance of the cushion cut at 45 degrees
  const cornerR = cushionRadiusAtAngle(angle, gemRadius, 2.75);

  const curve = new THREE.CatmullRomCurve3([
    // Anchor deep into lower gallery collet seat
    new THREE.Vector3(cosA * (cornerR * 0.44), baseY, sinA * (cornerR * 0.44)),
    // Sweep outward around the pavilion & hidden-halo gallery rail
    new THREE.Vector3(cosA * (cornerR * 0.85), baseY + 0.22, sinA * (cornerR * 0.85)),
    // Hug tightly around the crisp cushion girdle corner
    new THREE.Vector3(cosA * (cornerR * 1.035), gemCenterY + 0.02, sinA * (cornerR * 1.035)),
    // Arch gracefully up and over the crown corner bezel
    new THREE.Vector3(cosA * (cornerR * 0.95), gemCenterY + gemRadius * 0.30, sinA * (cornerR * 0.95)),
    // Tapered eagle-claw tip resting cleanly on the crown bezel facet
    new THREE.Vector3(cosA * (cornerR * 0.72), gemCenterY + gemRadius * 0.285, sinA * (cornerR * 0.72)),
  ]);

  return createTaperedTubeGeometry(curve, 0.052, 0.044, 0.015, 28, 12);
}

/**
 * Generates a swept cathedral shoulder arch rising from either side of the shank
 * up to embrace the upper hidden-halo gallery collar.
 */
export function createCathedralArchGeometry(
  side: -1 | 1,
  innerRadius = 1.48,
  galleryY = 1.92,
  galleryReachX = 0.48
): THREE.BufferGeometry {
  const startAngle = Math.PI / 2 - side * 0.44;
  const midAngle = Math.PI / 2 - side * 0.27;
  // Bury the base start inside the shank cross-section so the join looks like seamless single-cast gold
  const baseR = innerRadius + 0.095;
  const midR = innerRadius + 0.17;

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(Math.cos(startAngle) * baseR, Math.sin(startAngle) * baseR, 0),
    new THREE.Vector3(Math.cos(midAngle) * midR, Math.sin(midAngle) * midR + 0.08, 0),
    new THREE.Vector3(side * (galleryReachX + 0.11), galleryY - 0.05, 0),
    new THREE.Vector3(side * galleryReachX, galleryY + 0.01, 0),
  ]);

  return createTaperedTubeGeometry(curve, 0.092, 0.068, 0.044, 24, 14);
}

/**
 * Generates a closed cushion-contoured metallic gallery rail (used for the hidden-halo
 * collar encircling the gemstone pavilion just under the girdle).
 */
export function createCushionRailGeometry(
  railRadius = 0.52,
  tubeRadius = 0.045,
  yOffset = 1.94,
  segments = 64
): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const r = cushionRadiusAtAngle(theta, railRadius, 2.75);
    pts.push(new THREE.Vector3(Math.cos(theta) * r, yOffset, Math.sin(theta) * r));
  }
  const curve = new THREE.CatmullRomCurve3(pts, true);
  return new THREE.TubeGeometry(curve, segments, tubeRadius, 12, true);
}

/**
 * Computes exact positions & orientations for the French-cut micro-pavé diamonds
 * nestled along the upper shoulders of the cathedral shank, plus flanking gold bead prongs.
 */
export function computeShoulderPaveSpecs(
  innerRadius = 1.48,
  stonesPerSide = 8
): { stones: RingTransformSpec[]; beads: RingTransformSpec[] } {
  const stones: RingTransformSpec[] = [];
  const beads: RingTransformSpec[] = [];
  const up = new THREE.Vector3(0, 1, 0);

  for (const side of [-1, 1] as const) {
    for (let k = 0; k < stonesPerSide; k++) {
      // Sweep down each shoulder from near the cathedral gallery toward 3 o'clock / 9 o'clock
      const angularOffset = 0.30 + k * 0.088;
      const theta = Math.PI / 2 - side * angularOffset;

      const shoulderBell = Math.exp(-Math.pow((theta - Math.PI / 2) / 0.52, 2));
      const underGalleryPinch = Math.exp(-Math.pow((theta - Math.PI / 2) / 0.16, 2));
      const bandHeight = 0.145 + shoulderBell * 0.055 - underGalleryPinch * 0.065;

      // Seat the diamond girdle flush into the top outer crown of the shank
      const rStone = innerRadius + bandHeight + 0.012;
      const normal = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0).normalize();
      const pos = normal.clone().multiplyScalar(rStone);
      const quat = new THREE.Quaternion().setFromUnitVectors(up, normal);

      // Gentle graduation in melee size down the shank
      const scale = 1.0 - k * 0.032;
      stones.push({ position: pos, quaternion: quat, scale });

      // Two micro gold bead prongs flanking each melee diamond along +/- Z
      const beadAngle = theta + side * 0.044;
      const beadNorm = new THREE.Vector3(Math.cos(beadAngle), Math.sin(beadAngle), 0).normalize();
      const rBead = innerRadius + bandHeight + 0.008;
      for (const zSign of [-1, 1] as const) {
        const bPos = beadNorm.clone().multiplyScalar(rBead);
        bPos.z = zSign * 0.058 * scale;
        beads.push({
          position: bPos,
          quaternion: new THREE.Quaternion(),
          scale: 0.92 * scale,
        });
      }
    }
  }

  return { stones, beads };
}

/**
 * Computes positions & outward orientations for the 16 hidden-halo diamonds set around
 * the gallery rail underneath the main cushion stone.
 */
export function computeHiddenHaloSpecs(
  railRadius = 0.555,
  yOffset = 1.94,
  count = 16
): RingTransformSpec[] {
  const specs: RingTransformSpec[] = [];
  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < count; i++) {
    // Skip exact 45-degree prong corners slightly by shifting phase by PI/16
    const theta = (i + 0.5) * ((Math.PI * 2) / count);
    const r = cushionRadiusAtAngle(theta, railRadius, 2.75);
    const pos = new THREE.Vector3(Math.cos(theta) * r, yOffset, Math.sin(theta) * r);
    const outward = new THREE.Vector3(Math.cos(theta), 0.14, Math.sin(theta)).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(up, outward);
    specs.push({ position: pos, quaternion: quat, scale: 0.72 });
  }

  return specs;
}
