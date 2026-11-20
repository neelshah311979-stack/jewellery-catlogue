import * as THREE from 'three';

/**
 * Exact inner bore radius of createCathedralShankGeometry(1.48, ...).
 * Used to compute a mathematically snug comfort-fit scale on the ring finger.
 */
export const RING_SHANK_INNER_RADIUS = 1.48;

export interface FingerGeometryOptions {
  length: number;
  baseRadiusX: number;
  baseRadiusZ: number;
  curlAngle?: number;
  radialSegments?: number;
  lengthSegments?: number;
  /** Marks the ring finger so subtle grounded contact occlusion is baked beneath the ring shank */
  ringContactT?: number;
}

export interface SculptedHandRig {
  handGroup: THREE.Group;
  ringFingerGroup: THREE.Group;
  ringAnchor: THREE.Object3D;
  ringFitScale: number;
  ringWearY: number;
  geometries: THREE.BufferGeometry[];
}

/**
 * Computes the exact uniform scale for `ringGroup` so its inner gold bore
 * hugs the proximal phalanx snugly with zero skin clipping and zero loose gap.
 */
export function computeRingFitScale(
  fingerRadiusX: number,
  fingerRadiusZ: number,
  innerRingRadius = RING_SHANK_INNER_RADIUS
): number {
  const effectiveRadius = Math.max(fingerRadiusX, fingerRadiusZ);
  // 1.2% clearance seats the comfort-fit inner court curve snugly against the finger skin
  return (effectiveRadius * 1.012) / innerRingRadius;
}

/**
 * Evaluates a finger's organic center-axis curve (gentle relaxed dorsal arch)
 * and elliptical cross-section radii (rx, rz) at normalized parameter t in [0, 1].
 */
export function evaluateFingerProfile(
  t: number,
  opts: Required<Pick<FingerGeometryOptions, 'length' | 'baseRadiusX' | 'baseRadiusZ' | 'curlAngle'>>
): { y: number; z: number; rx: number; rz: number; slopeZ: number } {
  const { length, baseRadiusX, baseRadiusZ, curlAngle } = opts;

  // Smooth taper from MCP base -> proximal -> subtle PIP knuckle -> middle -> DIP -> slender tip
  const baseTaper = 1.0 - 0.30 * Math.pow(t, 1.12);

  // Subtle anatomical joint fullness (PIP around t=0.45, DIP around t=0.76)
  const pipSwell = 0.048 * Math.exp(-Math.pow((t - 0.45) / 0.068, 2));
  const dipSwell = 0.032 * Math.exp(-Math.pow((t - 0.76) / 0.055, 2));
  // Subtle proximal waist indentation where the ring naturally rests (t ~ 0.22)
  const ringSeat = -0.028 * Math.exp(-Math.pow((t - 0.22) / 0.09, 2));

  // Smooth elliptical fingertip cap closing cleanly over t in [0.91, 1.0]
  let tipCap = 1.0;
  if (t > 0.91) {
    const u = Math.min(1, (t - 0.91) / 0.09);
    tipCap = Math.sqrt(Math.max(0.0004, 1 - u * u));
  }

  const radialFactor = (baseTaper + pipSwell + dipSwell + ringSeat) * tipCap;
  const rx = baseRadiusX * radialFactor;
  const rz = baseRadiusZ * radialFactor * (1.0 - 0.08 * t);

  // Gentle natural flexion curve toward palmar (-Z) direction near the tip
  const y = t * length;
  const z = -curlAngle * length * Math.pow(t, 2.2) * 0.42;
  const slopeZ = -curlAngle * 2.2 * Math.pow(Math.max(t, 1e-4), 1.2) * 0.42;

  return { y, z, rx, rz, slopeZ };
}

/**
 * Builds a single continuous, watertight, sculpted organic finger geometry
 * with smooth knuckle transitions, natural palmar pad fullness, and rounded fingertip dome.
 */
export function createSculptedFingerGeometry(options: FingerGeometryOptions): THREE.BufferGeometry {
  const length = options.length;
  const baseRadiusX = options.baseRadiusX;
  const baseRadiusZ = options.baseRadiusZ;
  const curlAngle = options.curlAngle ?? 0.14;
  const radialSegments = options.radialSegments ?? 24;
  const lengthSegments = options.lengthSegments ?? 28;

  const positions: number[] = [];
  const uvs: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const rings = lengthSegments + 1;
  const stride = radialSegments + 1;
  const ringContactT = options.ringContactT;

  for (let i = 0; i < rings; i++) {
    const t = i / lengthSegments;
    const { y, z, rx, rz } = evaluateFingerProfile(t, {
      length,
      baseRadiusX,
      baseRadiusZ,
      curlAngle,
    });

    // Subtle organic base flare near MCP joint so finger root merges seamlessly into palm
    const rootBlend = t < 0.14 ? 1.0 + 0.08 * Math.pow(1 - t / 0.14, 2) : 1.0;

    // Subtle dorsal flattening along the distal nail bed (t in [0.80, 0.95])
    const nailBedFlat = Math.exp(-Math.pow((t - 0.87) / 0.06, 2));

    // Fine anatomical PIP & DIP dorsal knuckle skin-fold micro-ridges
    const pipCrease = Math.exp(-Math.pow((t - 0.46) / 0.035, 2)) * Math.sin((t - 0.46) * 260) * 0.0028;
    const dipCrease = Math.exp(-Math.pow((t - 0.75) / 0.028, 2)) * Math.sin((t - 0.75) * 310) * 0.0020;

    // Anatomical capillary blush (warmer rosy tint near fingertips, cuticles & knuckle pads)
    const tipBlush = Math.exp(-Math.pow((t - 0.90) / 0.12, 2));
    const pipWarmth = Math.exp(-Math.pow((t - 0.46) / 0.07, 2));
    const dipWarmth = Math.exp(-Math.pow((t - 0.75) / 0.055, 2));

    // Grounded soft contact shadow hugging right under the gold band on the ring finger
    const ringShadow =
      ringContactT !== undefined
        ? Math.exp(-Math.pow((t - ringContactT) / 0.042, 2)) * 0.27
        : 0;

    for (let j = 0; j <= radialSegments; j++) {
      const u = j / radialSegments;
      const theta = u * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      // Slightly fuller palmar (-Z) fingertip pad, slightly flatter dorsal (+Z) nail bed
      let localZ = sinT * rz * rootBlend;
      if (sinT > 0) {
        localZ *= 1.0 - 0.12 * nailBedFlat * sinT;
        localZ += (pipCrease + dipCrease) * sinT;
      } else {
        const padFullness = 1.0 + 0.10 * Math.exp(-Math.pow((t - 0.88) / 0.08, 2));
        localZ *= padFullness;
      }

      const vx = cosT * rx * rootBlend;
      const vy = y;
      const vz = z + localZ;

      positions.push(vx, vy, vz);
      uvs.push(u, t);

      // Vertex color multiplier around (1,1,1) for natural living skin warmth, 3D form modeling & crevice occlusion
      const dorsalFactor = Math.max(0, sinT);
      const sideFactor = Math.abs(cosT);
      const sideFormAO = Math.pow(sideFactor, 1.65) * 0.14;
      const interFingerAO = (1.0 - Math.min(1, t / 0.36)) * sideFactor * 0.13;
      const knuckleFoldShade =
        dorsalFactor *
        (Math.exp(-Math.pow((t - 0.46) / 0.024, 2)) * 0.085 +
          Math.exp(-Math.pow((t - 0.75) / 0.018, 2)) * 0.062);
      const blush = tipBlush * 0.095 + (pipWarmth * 0.065 + dipWarmth * 0.045) * dorsalFactor;

      const shade = 1.0 - sideFormAO - interFingerAO - knuckleFoldShade - ringShadow;
      const cr = Math.min(1.05, shade * (1.0 + blush * 0.60));
      const cg = Math.max(0.50, Math.min(1.02, shade * (1.0 - blush * 0.48 - ringShadow * 0.12)));
      const cb = Math.max(0.44, Math.min(1.02, shade * (1.0 - blush * 0.54 - ringShadow * 0.18)));
      colors.push(cr, cg, cb);
    }
  }

  // Side surface quads (counter-clockwise outward winding:
  // ring angle theta increases from +X toward +Z around +Y, so right-handed outward normal requires a -> d -> b)
  for (let i = 0; i < lengthSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * stride + j;
      const b = a + 1;
      const c = (i + 1) * stride + j + 1;
      const d = (i + 1) * stride + j;

      indices.push(a, d, b);
      indices.push(b, d, c);
    }
  }

  // Close base cap smoothly inside the palm (outward normal -Y)
  const baseCenterIdx = positions.length / 3;
  positions.push(0, 0, 0);
  uvs.push(0.5, 0);
  colors.push(0.94, 0.92, 0.91);
  for (let j = 0; j < radialSegments; j++) {
    indices.push(baseCenterIdx, j, j + 1);
  }

  // Close fingertip apex cleanly (+Y)
  const tipCenterIdx = positions.length / 3;
  const tipProf = evaluateFingerProfile(1.0, { length, baseRadiusX, baseRadiusZ, curlAngle });
  positions.push(0, tipProf.y + 0.004, tipProf.z);
  uvs.push(0.5, 1);
  colors.push(1.02, 0.94, 0.93);
  const lastRingStart = lengthSegments * stride;
  for (let j = 0; j < radialSegments; j++) {
    indices.push(tipCenterIdx, lastRingStart + j + 1, lastRingStart + j);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a sleek, manicured curved almond fingernail plate nestled cleanly
 * on the dorsal (+Z) fingertip surface.
 */
export function createSculptedNailGeometry(
  width = 0.22,
  length = 0.34,
  archHeight = 0.055
): THREE.BufferGeometry {
  const segU = 14;
  const segV = 14;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let iv = 0; iv <= segV; iv++) {
    const v = iv / segV; // 0 = cuticle base, 1 = almond free-edge tip
    // Classic slender almond manicure silhouette
    let halfWidthFactor: number;
    if (v < 0.22) {
      // Softly rounded cuticle arc
      const c = (0.22 - v) / 0.22;
      halfWidthFactor = Math.sqrt(Math.max(0.02, 1 - c * c * 0.72));
    } else if (v < 0.62) {
      halfWidthFactor = 1.0 - 0.08 * ((v - 0.22) / 0.40);
    } else {
      // Tapered almond tip
      const u = (v - 0.62) / 0.38;
      halfWidthFactor = 0.92 * Math.pow(Math.max(0.01, 1 - Math.pow(u, 1.85)), 0.55);
    }

    const rowHalfW = (width * 0.5) * halfWidthFactor;
    const y = (v - 0.35) * length;
    // Longitudinal gentle convex manicure curve
    const longCurve = Math.sin(v * Math.PI) * 0.022;

    for (let iu = 0; iu <= segU; iu++) {
      const u = iu / segU; // 0..1 across width
      const s = u * 2 - 1; // -1..+1
      const x = s * rowHalfW;
      // Transverse C-curve hugging the curved dorsal finger
      const z = Math.cos(s * Math.PI * 0.48) * archHeight + longCurve;

      positions.push(x, y, z);
      uvs.push(u, v);
    }
  }

  const stride = segU + 1;
  for (let iv = 0; iv < segV; iv++) {
    for (let iu = 0; iu < segU; iu++) {
      const a = iv * stride + iu;
      const b = a + 1;
      const c = (iv + 1) * stride + iu + 1;
      const d = (iv + 1) * stride + iu;
      // Front face points +Z (dorsal outward)
      indices.push(a, b, c);
      indices.push(a, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a single continuous, organic sculpted palm + wrist + slender lower forearm
 * for a left hand viewed from the dorsal (+Z) side.
 *
 * Coordinate convention:
 * - y = -3.15 (lower forearm) -> y = -1.65 (slender wrist) -> y = -0.10 (knuckle ridge) -> y = +0.08 (web apex)
 * - -X = ulnar/pinky side, +X = radial/thumb side (Left Hand dorsal view)
 * - +Z = smooth dorsal back of hand, -Z = gently concave palmar underside
 */
export function createSculptedPalmWristGeometry(
  radialSegments = 40,
  heightSegments = 34
): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const yMin = -3.15;
  const yMax = 0.08;
  const stride = radialSegments + 1;

  for (let i = 0; i <= heightSegments; i++) {
    const t = i / heightSegments; // 0 = forearm bottom, 1 = MCP knuckle ridge
    const y = THREE.MathUtils.lerp(yMin, yMax, t);

    // Sculpted anatomical width profile:
    // Forearm narrows gently to slender wrist (t ~ 0.46), then flares organically across metacarpals to knuckles (t ~ 0.90)
    let halfWidth: number;
    let halfDepth: number;
    let centerX = 0;
    let centerZ = 0;

    if (t < 0.46) {
      // Forearm tapering gracefully into the wrist
      const u = t / 0.46;
      const smooth = u * u * (3 - 2 * u);
      halfWidth = THREE.MathUtils.lerp(0.64, 0.54, smooth);
      halfDepth = THREE.MathUtils.lerp(0.43, 0.32, smooth);
      centerZ = THREE.MathUtils.lerp(-0.08, -0.03, smooth);
    } else if (t < 0.90) {
      // Wrist flaring cleanly into anatomical metacarpal palm
      const u = (t - 0.46) / 0.44;
      const smooth = u * u * (3 - 2 * u);
      const flare = Math.sin(u * Math.PI * 0.85);
      halfWidth = THREE.MathUtils.lerp(0.54, 0.81, smooth) + 0.04 * flare;
      halfDepth = THREE.MathUtils.lerp(0.32, 0.215, smooth) + 0.025 * Math.sin(u * Math.PI);
      // Slight radial fullness on thumb (+X) side of lower palm
      centerX = 0.03 * Math.sin(u * Math.PI);
      centerZ = THREE.MathUtils.lerp(-0.03, 0.005, smooth);
    } else {
      // Softly domed knuckle-web crown matching finger base thickness so there is zero sharp shadow step
      const u = (t - 0.90) / 0.10;
      const cap = Math.sqrt(Math.max(0.01, 1 - u * u));
      halfWidth = 0.81 * (0.90 + 0.10 * cap);
      halfDepth = 0.215 * (0.18 + 0.82 * cap);
      centerZ = 0.005 * (1 - u);
    }

    // Warm rosy capillary warmth along the dorsal knuckle ridge & subtle cool tone toward wrist
    const knuckleBlush = Math.exp(-Math.pow((t - 0.86) / 0.11, 2));
    const wristShade = Math.exp(-Math.pow((t - 0.46) / 0.14, 2)) * 0.035;

    for (let j = 0; j <= radialSegments; j++) {
      const u = j / radialSegments;
      const theta = u * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      // Superellipse palm cross-section (sleeker squared-oval dorsal/palmar silhouette than a raw cylinder)
      const exp = t > 0.50 ? 2.45 : 2.1;
      const sx = Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / exp);
      const sz = Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / exp);

      let vx = centerX + sx * halfWidth;
      let vz = centerZ + sz * halfDepth;

      // Subtle dorsal (+Z) metacarpal arch & tendon contour across the back of the hand
      let tendonShade = 0;
      if (t > 0.52 && t < 0.95 && sinT > 0) {
        const palmRegion = Math.sin(((t - 0.52) / 0.43) * Math.PI);
        // Gentle dorsal dome + realistic extensor tendon ridges
        const dome = 0.032 * palmRegion * (1 - cosT * cosT * 0.5);
        const tendonWave = Math.cos(cosT * Math.PI * 4) * Math.max(0, sinT);
        const tendons = 0.011 * palmRegion * tendonWave;
        vz += dome + tendons;
        tendonShade = palmRegion * (0.018 * (1 - tendonWave) * 0.5);
      }

      // Subtle palmar (-Z) hollow and soft thenar eminence on radial (+X) side
      if (t > 0.48 && t < 0.88 && sinT < 0) {
        const palmRegion = Math.sin(((t - 0.48) / 0.40) * Math.PI);
        const thenarBump = cosT > 0.15 ? 0.095 * palmRegion * Math.pow((cosT - 0.15) / 0.85, 1.5) : 0;
        const palmHollow = -0.025 * palmRegion * Math.exp(-Math.pow(cosT / 0.45, 2));
        vz -= thenarBump + palmHollow;
      }

      // Natural knuckle-arch slant (pinky side -X sits slightly lower than middle/index side)
      let vy = y;
      if (t > 0.65) {
        const ridgeBlend = (t - 0.65) / 0.35;
        // Parabolic knuckle arch peaking near middle finger (cosT ~ +0.18), sloping smoothly down to pinky (-1)
        const archOffset = 0.065 * ridgeBlend * (1 - 1.35 * Math.pow(cosT - 0.15, 2));
        vy += archOffset;
      }

      positions.push(vx, vy, vz);
      uvs.push(u, t);

      const dorsal = Math.max(0, sinT);
      const palmarWarmth = sinT < 0 ? Math.abs(sinT) * 0.03 : 0;
      const blush = knuckleBlush * dorsal * 0.055 + palmarWarmth;
      const baseLum = 1.0 - wristShade - tendonShade;
      colors.push(
        Math.min(1.04, baseLum * (1.0 + blush * 0.55)),
        Math.min(1.02, baseLum * (1.0 - blush * 0.45)),
        Math.min(1.02, baseLum * (1.0 - blush * 0.48))
      );
    }
  }

  // Outward winding matches finger loft (a -> d -> b)
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * stride + j;
      const b = a + 1;
      const c = (i + 1) * stride + j + 1;
      const d = (i + 1) * stride + j;

      indices.push(a, d, b);
      indices.push(b, d, c);
    }
  }

  // Close bottom forearm end cleanly (-Y)
  const botCenterIdx = positions.length / 3;
  positions.push(0, yMin, -0.10);
  uvs.push(0.5, 0);
  colors.push(0.96, 0.95, 0.94);
  for (let j = 0; j < radialSegments; j++) {
    indices.push(botCenterIdx, j, j + 1);
  }

  // Close top ridge cap cleanly (+Y)
  const topCenterIdx = positions.length / 3;
  positions.push(0.02, yMax + 0.04, 0.0);
  uvs.push(0.5, 1);
  colors.push(0.95, 0.92, 0.91);
  const topRingStart = heightSegments * stride;
  for (let j = 0; j < radialSegments; j++) {
    indices.push(topCenterIdx, topRingStart + j + 1, topRingStart + j);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Generates high-detail 512x512 procedural human dermal pore/micro-crease bump & roughness maps
 * for realistic velvety editorial skin shading with zero external image requests.
 */
export function createSkinTextures(): {
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const size = 512;
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');

  if (bCtx && rCtx) {
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);
    rCtx.fillStyle = '#b6b6b6';
    rCtx.fillRect(0, 0, size, size);

    // Deterministic fine skin pores & micro-relief diamonds
    let seed = 4219;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < 6200; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 0.55 + rand() * 1.45;
      const shade = Math.round(108 + rand() * 40);
      bCtx.fillStyle = `rgba(${shade},${shade},${shade},0.36)`;
      bCtx.beginPath();
      bCtx.arc(x, y, r, 0, Math.PI * 2);
      bCtx.fill();

      const rShade = Math.round(160 + rand() * 46);
      rCtx.fillStyle = `rgba(${rShade},${rShade},${rShade},0.28)`;
      rCtx.beginPath();
      rCtx.arc(x, y, r * 1.4, 0, Math.PI * 2);
      rCtx.fill();
    }

    // Subtle organic dermal micro-creases & cross-hatch skin tension lines
    bCtx.strokeStyle = 'rgba(104, 104, 104, 0.16)';
    bCtx.lineWidth = 0.85;
    for (let y = 5; y < size; y += 9) {
      bCtx.beginPath();
      bCtx.moveTo(0, y);
      for (let x = 0; x <= size; x += 22) {
        bCtx.lineTo(x, y + Math.sin(x * 0.065 + y * 0.4) * 1.35);
      }
      bCtx.stroke();
    }

    bCtx.strokeStyle = 'rgba(146, 146, 146, 0.10)';
    bCtx.lineWidth = 0.65;
    for (let x = 8; x < size; x += 14) {
      bCtx.beginPath();
      bCtx.moveTo(x, 0);
      for (let y = 0; y <= size; y += 26) {
        bCtx.lineTo(x + Math.cos(y * 0.055 + x) * 1.1, y);
      }
      bCtx.stroke();
    }
  }

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(3, 3);
  bumpMap.needsUpdate = true;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(3, 3);
  roughnessMap.needsUpdate = true;

  return { bumpMap, roughnessMap };
}

/**
 * Backwards-compatible helper returning the dermal micro-relief bump texture.
 */
export function createSkinMicroTexture(): THREE.CanvasTexture {
  return createSkinTextures().bumpMap;
}

/**
 * Generates a realistic sheer rose-nude manicured nail albedo texture (sRGB) featuring:
 * - Pale crescent lunula near the cuticle
 * - Warm translucent rosy-pink nail bed gradient
 * - Soft creamy-ivory natural free-edge manicure tip
 */
export function createNaturalNailTexture(): THREE.CanvasTexture {
  const w = 256;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Note: nail UV v=0 is cuticle base (canvas bottom if flipY=true), v=1 is free-edge tip (canvas top)
    const grad = ctx.createLinearGradient(0, h, 0, 0);
    grad.addColorStop(0.0, '#edd0ca');   // soft cuticle edge
    grad.addColorStop(0.16, '#f6e1dc');  // pale sheer lunula transition
    grad.addColorStop(0.32, '#e8bab0');  // translucent warm pink nail bed
    grad.addColorStop(0.68, '#ebc2b8');  // mid nail bed sheen
    grad.addColorStop(0.81, '#f4dfd7');  // soft smile-line blend
    grad.addColorStop(1.0, '#fbf3ec');   // creamy natural French free-edge tip
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle pale crescent lunula at the cuticle base (bottom center of canvas)
    const lunula = ctx.createRadialGradient(w * 0.5, h * 0.98, 6, w * 0.5, h * 0.96, w * 0.34);
    lunula.addColorStop(0, 'rgba(255, 248, 244, 0.65)');
    lunula.addColorStop(0.65, 'rgba(255, 245, 240, 0.25)');
    lunula.addColorStop(1, 'rgba(255, 245, 240, 0)');
    ctx.fillStyle = lunula;
    ctx.fillRect(0, h * 0.62, w, h * 0.38);

    // Subtle lateral sidewall translucency shading so edges tuck cleanly into the skin
    const sideGrad = ctx.createLinearGradient(0, 0, w, 0);
    sideGrad.addColorStop(0.0, 'rgba(175, 118, 108, 0.22)');
    sideGrad.addColorStop(0.16, 'rgba(175, 118, 108, 0)');
    sideGrad.addColorStop(0.84, 'rgba(175, 118, 108, 0)');
    sideGrad.addColorStop(1.0, 'rgba(175, 118, 108, 0.22)');
    ctx.fillStyle = sideGrad;
    ctx.fillRect(0, 0, w, h);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Assembles an anatomically accurate, editorial-grade sculpted Left Hand (Dorsal View)
 * with a mathematically locked `ringAnchor` on the Ring Finger (4th digit).
 *
 * - Viewing from +Z shows the smooth back (dorsal side) of the Left Hand:
 *   Pinky (far left, -X) -> Ring Finger (center-left, wearing the solitaire) -> Middle -> Index -> Thumb (far right, +X).
 * - `ringAnchor` is a child of `ringFingerGroup` rotated by +PI/2 around X so:
 *   - `ringGroup`'s local +Y (center diamond) points directly out +Z (dorsal face toward the camera)
 *   - `ringGroup`'s local Z (ring bore) aligns coaxially with the finger axis
 *   - Rotating `handGroup` via user drag keeps the ring 100% locked around the finger!
 */
export function buildSculptedLeftHand(
  skinMaterial: THREE.Material,
  nailMaterial: THREE.Material
): SculptedHandRig {
  const geometries: THREE.BufferGeometry[] = [];
  const register = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };

  const handGroup = new THREE.Group();

  // 1. Continuous sculpted forearm + wrist + dorsal palm
  const palmWristGeo = register(createSculptedPalmWristGeometry(40, 34));
  const palmWristMesh = new THREE.Mesh(palmWristGeo, skinMaterial);
  palmWristMesh.castShadow = true;
  palmWristMesh.receiveShadow = true;
  handGroup.add(palmWristMesh);

  // Subtle recessed interdigital web saddles tucked inside the dorsal silhouette (no protruding surface seams)
  const webSpecs = [
    { x: -0.39, y: -0.06, z: -0.03, rx: 0.13, ry: 0.11, rz: 0.11 },
    { x: 0.0, y: -0.01, z: -0.025, rx: 0.14, ry: 0.12, rz: 0.115 },
    { x: 0.38, y: -0.03, z: -0.03, rx: 0.135, ry: 0.115, rz: 0.11 },
  ];
  const webSphereGeo = register(new THREE.SphereGeometry(1, 14, 12));
  {
    const count = webSphereGeo.attributes.position.count;
    const webColors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      webColors[i * 3] = 0.94;
      webColors[i * 3 + 1] = 0.89;
      webColors[i * 3 + 2] = 0.88;
    }
    webSphereGeo.setAttribute('color', new THREE.BufferAttribute(webColors, 3));
  }
  webSpecs.forEach((w) => {
    const m = new THREE.Mesh(webSphereGeo, skinMaterial);
    m.position.set(w.x, w.y, w.z);
    m.scale.set(w.rx, w.ry, w.rz);
    handGroup.add(m);
  });

  // Helper to build a complete sculpted finger + sleek manicured rose-nude almond nail
  // Each finger starts tucked inside the metacarpal palm for a seamless organic silhouette
  const makeFinger = (spec: {
    length: number;
    rx: number;
    rz: number;
    x: number;
    y: number;
    z: number;
    splayZ: number;
    tiltX: number;
    curl: number;
    ringContactT?: number;
  }) => {
    const group = new THREE.Group();
    group.position.set(spec.x, spec.y, spec.z);
    group.rotation.set(spec.tiltX, 0, spec.splayZ);

    const fingerGeo = register(
      createSculptedFingerGeometry({
        length: spec.length,
        baseRadiusX: spec.rx,
        baseRadiusZ: spec.rz,
        curlAngle: spec.curl,
        ringContactT: spec.ringContactT,
      })
    );
    const fingerMesh = new THREE.Mesh(fingerGeo, skinMaterial);
    fingerMesh.castShadow = true;
    fingerMesh.receiveShadow = true;
    group.add(fingerMesh);

    // Position sleek manicured almond nail cleanly nestled into the dorsal (+Z) nail bed
    const nailT = 0.875;
    const tipProfile = evaluateFingerProfile(nailT, {
      length: spec.length,
      baseRadiusX: spec.rx,
      baseRadiusZ: spec.rz,
      curlAngle: spec.curl,
    });
    const nailGeo = register(
      createSculptedNailGeometry(tipProfile.rx * 1.32, spec.length * 0.155, tipProfile.rz * 0.28)
    );
    const nailMesh = new THREE.Mesh(nailGeo, nailMaterial);
    nailMesh.position.set(0, tipProfile.y + spec.length * 0.028, tipProfile.z + tipProfile.rz * 0.60);
    // Align nail slope subtly with fingertip dorsal curve
    nailMesh.rotation.x = Math.atan(tipProfile.slopeZ) * -0.55;
    group.add(nailMesh);

    return group;
  };

  // 2. Sculpted Left-Hand Digits (Dorsal View: Pinky on Left [-X] ... Index on Right [+X])
  // Tucked cleanly into the metacarpal bridge (`y` lowered by ~0.22, lengths extended) for zero seam
  const pinkyFinger = makeFinger({
    length: 1.98,
    rx: 0.166,
    rz: 0.150,
    x: -0.58,
    y: -0.34,
    z: 0.0,
    splayZ: 0.095,
    tiltX: 0.035,
    curl: 0.15,
  });

  const RING_FINGER_SPEC = {
    length: 2.52,
    rx: 0.196,
    rz: 0.178,
    x: -0.20,
    y: -0.22,
    z: 0.012,
    splayZ: 0.022,
    tiltX: 0.018,
    curl: 0.12,
    ringContactT: 0.285,
  };
  const ringFingerGroup = makeFinger(RING_FINGER_SPEC);

  const middleFinger = makeFinger({
    length: 2.72,
    rx: 0.206,
    rz: 0.186,
    x: 0.19,
    y: -0.17,
    z: 0.016,
    splayZ: -0.016,
    tiltX: 0.014,
    curl: 0.13,
  });

  const indexFinger = makeFinger({
    length: 2.46,
    rx: 0.196,
    rz: 0.178,
    x: 0.57,
    y: -0.24,
    z: 0.008,
    splayZ: -0.075,
    tiltX: 0.028,
    curl: 0.14,
  });

  // 3. Sculpted Thumb emerging gracefully on the radial (+X, right) side of the Left Hand (tucked smoothly into palm)
  const thumbGroup = new THREE.Group();
  thumbGroup.position.set(0.56, -0.98, -0.055);
  thumbGroup.rotation.set(0.08, -0.26, -0.50);

  const thumbGeo = register(
    createSculptedFingerGeometry({
      length: 1.74,
      baseRadiusX: 0.226,
      baseRadiusZ: 0.196,
      curlAngle: 0.09,
    })
  );
  const thumbMesh = new THREE.Mesh(thumbGeo, skinMaterial);
  thumbMesh.castShadow = true;
  thumbMesh.receiveShadow = true;
  thumbGroup.add(thumbMesh);

  const thumbTip = evaluateFingerProfile(0.875, {
    length: 1.74,
    baseRadiusX: 0.226,
    baseRadiusZ: 0.196,
    curlAngle: 0.09,
  });
  const thumbNailGeo = register(
    createSculptedNailGeometry(thumbTip.rx * 1.18, 1.74 * 0.145, thumbTip.rz * 0.26)
  );
  const thumbNailMesh = new THREE.Mesh(thumbNailGeo, nailMaterial);
  thumbNailMesh.position.set(-0.01, thumbTip.y + 0.036, thumbTip.z + thumbTip.rz * 0.56);
  thumbNailMesh.rotation.set(-0.05, 0.28, 0.04);
  thumbGroup.add(thumbNailMesh);

  handGroup.add(pinkyFinger, ringFingerGroup, middleFinger, indexFinger, thumbGroup);

  // 4. Exact Ring Seat Anchor locked directly inside `ringFingerGroup`
  // Anatomical wearing position: lower-middle of visible proximal phalanx (t = 0.285 after root immersion)
  const ringWearT = 0.285;
  const wearProfile = evaluateFingerProfile(ringWearT, {
    length: RING_FINGER_SPEC.length,
    baseRadiusX: RING_FINGER_SPEC.rx,
    baseRadiusZ: RING_FINGER_SPEC.rz,
    curlAngle: RING_FINGER_SPEC.curl,
  });

  const ringFitScale = computeRingFitScale(wearProfile.rx, wearProfile.rz, RING_SHANK_INNER_RADIUS);

  const ringAnchor = new THREE.Object3D();
  ringAnchor.name = 'left-ring-finger-anchor';
  ringAnchor.position.set(0, wearProfile.y, wearProfile.z);
  // Rotate +PI/2 around X so:
  // - ring local +Y (solitaire crown & diamond) points along finger dorsal +Z toward camera
  // - ring local Z (shank bore) aligns coaxially with the finger axis (Y)
  // Add subtle tangent alignment to match the finger's relaxed arch slope
  ringAnchor.rotation.set(Math.PI / 2 - Math.atan(wearProfile.slopeZ) * 0.6, 0, 0);
  ringFingerGroup.add(ringAnchor);

  return {
    handGroup,
    ringFingerGroup,
    ringAnchor,
    ringFitScale,
    ringWearY: wearProfile.y,
    geometries,
  };
}
