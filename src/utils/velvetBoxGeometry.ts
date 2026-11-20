import * as THREE from 'three';

export interface LuxuryVelvetBoxRig {
  boxGroup: THREE.Group;
  lidPivot: THREE.Group;
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
  textures: THREE.Texture[];
}

/**
 * Builds a rounded octagonal squircle 2D shape for a Place Vendome / Mumbai haute-joaillerie ring box.
 */
export function createRoundedOctagonShape(radius = 1.38, cornerCut = 0.34): THREE.Shape {
  const r = radius;
  const c = radius * (1 - cornerCut);
  const pts: Array<[number, number]> = [
    [-c, r],
    [c, r],
    [r, c],
    [r, -c],
    [c, -r],
    [-c, -r],
    [-r, -c],
    [-r, c],
  ];

  const shape = new THREE.Shape();
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const curr = pts[i];
    const next = pts[(i + 1) % n];

    // Smooth chamfer blend around each octagonal vertex
    const pStartX = curr[0] + (prev[0] - curr[0]) * 0.22;
    const pStartY = curr[1] + (prev[1] - curr[1]) * 0.22;
    const pEndX = curr[0] + (next[0] - curr[0]) * 0.22;
    const pEndY = curr[1] + (next[1] - curr[1]) * 0.22;

    if (i === 0) {
      shape.moveTo(pStartX, pStartY);
    } else {
      shape.lineTo(pStartX, pStartY);
    }
    shape.quadraticCurveTo(curr[0], curr[1], pEndX, pEndY);
  }
  shape.closePath();
  return shape;
}

/**
 * Procedural plush crushed-velvet micro-pile bump & roughness maps (zero-404).
 */
export function createVelvetFabricTextures(): {
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const size = 256;
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');

  let seed = 8821;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  if (bCtx && rCtx) {
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);
    rCtx.fillStyle = '#e0e0e0';
    rCtx.fillRect(0, 0, size, size);

    // Dense micro-pile velvet fibers
    for (let i = 0; i < 6500; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const shade = Math.round(92 + rand() * 72);
      bCtx.fillStyle = `rgba(${shade},${shade},${shade},0.48)`;
      bCtx.fillRect(x, y, 1.4, 1.4);

      const rShade = Math.round(195 + rand() * 55);
      rCtx.fillStyle = `rgba(${rShade},${rShade},${rShade},0.35)`;
      rCtx.fillRect(x, y, 2.0, 2.0);
    }

    // Subtle brushed directional velvet nap waves
    for (let y = 0; y < size; y += 3) {
      const wave = 122 + Math.round(Math.sin(y * 0.24) * 14);
      bCtx.fillStyle = `rgba(${wave},${wave},${wave},0.16)`;
      bCtx.fillRect(0, y, size, 1.5);
    }
  }

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(5, 5);
  bumpMap.needsUpdate = true;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(5, 5);
  roughnessMap.needsUpdate = true;

  return { bumpMap, roughnessMap };
}

/**
 * Procedural ivory silk-satin lid liner with crisp gold-foil "ONE SOUL · MUMBAI" monogram.
 */
export function createLidSilkEmblemTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Warm lustrous champagne-ivory silk satin gradient
    const bg = ctx.createRadialGradient(size * 0.5, size * 0.48, 20, size * 0.5, size * 0.5, size * 0.56);
    bg.addColorStop(0, '#fcf8f0');
    bg.addColorStop(0.62, '#f2e9da');
    bg.addColorStop(1, '#dfd2be');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    // Subtle silk diagonal weave sheen
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1;
    for (let i = -size; i < size * 2; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + size, size);
      ctx.stroke();
    }

    // Fine double gold-foil inner border frame
    ctx.strokeStyle = '#b98b3f';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(58, 58, size - 116, size - 116);
    ctx.strokeStyle = 'rgba(185, 139, 63, 0.45)';
    ctx.lineWidth = 1;
    ctx.strokeRect(68, 68, size - 136, size - 136);

    // Subtle star crest & gold-foil atelier typography
    ctx.fillStyle = '#9c712c';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 22px Georgia, serif';
    ctx.fillText('✦', size * 0.5, size * 0.36);

    ctx.font = '600 32px Georgia, "Times New Roman", serif';
    ctx.fillText('ONE SOUL', size * 0.5, size * 0.48);

    ctx.font = '500 13px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = '#7e5a22';
    ctx.fillText('H A U T E   J O A I L L E R I E', size * 0.5, size * 0.57);
    ctx.font = '500 11px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('M U M B A I', size * 0.5, size * 0.63);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Builds a multi-part sculpted haute-joaillerie velvet ring presentation box
 * with beveled octagonal body, crushed velvet micro-pile, brushed 18K gold piping & front clasp,
 * rear barrel hinges, twin tufted pillow bolsters with natural ring slit, and gold-foil silk lid liner.
 */
export function buildLuxuryVelvetBox(maxAnisotropy = 4): LuxuryVelvetBoxRig {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const regGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const regMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  const { bumpMap: velvetBump, roughnessMap: velvetRough } = createVelvetFabricTextures();
  velvetBump.anisotropy = maxAnisotropy;
  velvetRough.anisotropy = maxAnisotropy;
  textures.push(velvetBump, velvetRough);

  const silkEmblemTex = createLidSilkEmblemTexture();
  silkEmblemTex.anisotropy = maxAnisotropy;
  textures.push(silkEmblemTex);

  // Deep royal Bordeaux crushed velvet with velvety grazing sheen
  const velvetOuterMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x450e1d,
      roughness: 0.94,
      roughnessMap: velvetRough,
      bumpMap: velvetBump,
      bumpScale: 0.012,
      metalness: 0.0,
      sheen: 0.95,
      sheenRoughness: 0.58,
      sheenColor: new THREE.Color(0x962745),
      envMapIntensity: 0.45,
    })
  );

  // Slightly richer interior burgundy velvet cushion lining
  const velvetCushionMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x380a16,
      roughness: 0.96,
      roughnessMap: velvetRough,
      bumpMap: velvetBump,
      bumpScale: 0.01,
      metalness: 0.0,
      sheen: 0.92,
      sheenRoughness: 0.62,
      sheenColor: new THREE.Color(0x7e2039),
      envMapIntensity: 0.35,
    })
  );

  // Warm champagne-gold box hardware (bezel trim, push-button clasp, barrel hinges)
  const hardwareGoldMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xe6bf6e,
      roughness: 0.16,
      metalness: 1.0,
      clearcoat: 0.25,
      envMapIntensity: 1.4,
    })
  );

  // Satin gold-foil stamped lid interior plate
  const lidSilkMat = regMat(
    new THREE.MeshPhysicalMaterial({
      map: silkEmblemTex,
      roughness: 0.46,
      metalness: 0.04,
      sheen: 0.55,
      sheenRoughness: 0.45,
      sheenColor: new THREE.Color(0xfff9ee),
      envMapIntensity: 0.55,
    })
  );

  const boxGroup = new THREE.Group();

  // 1. Sculpted Beveled Octagonal Lower Case
  const outerShape = createRoundedOctagonShape(1.42, 0.34);
  const lowerCaseGeo = regGeo(
    new THREE.ExtrudeGeometry(outerShape, {
      depth: 0.96,
      bevelEnabled: true,
      bevelThickness: 0.085,
      bevelSize: 0.065,
      bevelSegments: 5,
      curveSegments: 16,
    })
  );
  // Orient extrusion along +Y so base sits from y = -1.08 to y = -0.02
  lowerCaseGeo.rotateX(-Math.PI / 2);
  lowerCaseGeo.translate(0, -1.04, 0);

  const lowerCaseMesh = new THREE.Mesh(lowerCaseGeo, velvetOuterMat);
  lowerCaseMesh.castShadow = true;
  lowerCaseMesh.receiveShadow = true;
  boxGroup.add(lowerCaseMesh);

  // 2. Crisp 18K Gold Trim Piping hugging the rim seam
  const rimPts = outerShape.getSpacedPoints(72).map((p) => new THREE.Vector3(p.x * 1.028, 0.01, -p.y * 1.028));
  const rimCurve = new THREE.CatmullRomCurve3(rimPts, true);
  const rimPipingGeo = regGeo(new THREE.TubeGeometry(rimCurve, 80, 0.028, 12, true));
  const rimPipingMesh = new THREE.Mesh(rimPipingGeo, hardwareGoldMat);
  boxGroup.add(rimPipingMesh);

  // Subtle recessed inner gold collar framing the velvet cushion
  const innerRimPts = outerShape.getSpacedPoints(64).map((p) => new THREE.Vector3(p.x * 0.91, 0.045, -p.y * 0.91));
  const innerRimCurve = new THREE.CatmullRomCurve3(innerRimPts, true);
  const innerRimGeo = regGeo(new THREE.TubeGeometry(innerRimCurve, 72, 0.018, 10, true));
  const innerRimMesh = new THREE.Mesh(innerRimGeo, hardwareGoldMat);
  boxGroup.add(innerRimMesh);

  // 3. Brushed 18K Gold Front Push-Clasp Button (+Z front face)
  const claspBackplateGeo = regGeo(new THREE.BoxGeometry(0.32, 0.14, 0.055));
  const claspBackplate = new THREE.Mesh(claspBackplateGeo, hardwareGoldMat);
  claspBackplate.position.set(0, -0.05, 1.48);
  boxGroup.add(claspBackplate);

  const claspButtonGeo = regGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.06, 20));
  claspButtonGeo.rotateX(Math.PI / 2);
  const claspButton = new THREE.Mesh(claspButtonGeo, hardwareGoldMat);
  claspButton.position.set(0, -0.05, 1.515);
  boxGroup.add(claspButton);

  // 4. Twin Rear Metallic Barrel Hinges (-Z rear edge)
  const hingeGeo = regGeo(new THREE.CylinderGeometry(0.036, 0.036, 0.28, 14));
  hingeGeo.rotateZ(Math.PI / 2);
  const leftHinge = new THREE.Mesh(hingeGeo, hardwareGoldMat);
  leftHinge.position.set(-0.52, 0.02, -1.46);
  const rightHinge = new THREE.Mesh(hingeGeo, hardwareGoldMat);
  rightHinge.position.set(0.52, 0.02, -1.46);
  boxGroup.add(leftHinge, rightHinge);

  // 5. Twin Tufted Velvet Pillow Bolsters forming a real sculpted ring slit in the center!
  const bolsterGeo = regGeo(new THREE.CylinderGeometry(0.54, 0.54, 1.86, 28, 1, false, 0, Math.PI));
  bolsterGeo.rotateZ(Math.PI / 2);

  // Front tufted bolster
  const frontBolster = new THREE.Mesh(bolsterGeo, velvetCushionMat);
  frontBolster.position.set(0, -0.15, 0.56);
  frontBolster.scale.set(1.0, 0.44, 1.0);
  frontBolster.receiveShadow = true;
  boxGroup.add(frontBolster);

  // Rear tufted bolster
  const rearBolster = new THREE.Mesh(bolsterGeo, velvetCushionMat);
  rearBolster.position.set(0, -0.15, -0.56);
  rearBolster.scale.set(1.0, 0.44, 1.0);
  rearBolster.receiveShadow = true;
  boxGroup.add(rearBolster);

  // Recessed dark velvet bed directly under the ring slot
  const bedShape = createRoundedOctagonShape(1.26, 0.34);
  const bedGeo = regGeo(new THREE.ShapeGeometry(bedShape, 12));
  bedGeo.rotateX(-Math.PI / 2);
  const bedMesh = new THREE.Mesh(bedGeo, velvetCushionMat);
  bedMesh.position.y = -0.15;
  bedMesh.receiveShadow = true;
  boxGroup.add(bedMesh);

  // 6. Hinged Upper Lid Assembly (pivots smoothly along rear hinge at z = -1.44)
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 0.03, -1.44);
  boxGroup.add(lidPivot);

  const lidCaseGeo = regGeo(
    new THREE.ExtrudeGeometry(outerShape, {
      depth: 0.72,
      bevelEnabled: true,
      bevelThickness: 0.095,
      bevelSize: 0.065,
      bevelSegments: 5,
      curveSegments: 16,
    })
  );
  lidCaseGeo.rotateX(-Math.PI / 2);
  lidCaseGeo.translate(0, 0.06, 1.44);

  const lidMesh = new THREE.Mesh(lidCaseGeo, velvetOuterMat);
  lidMesh.castShadow = true;
  lidMesh.receiveShadow = true;
  lidPivot.add(lidMesh);

  // Gold rim trim along the bottom lip of the hinged lid
  const lidRimMesh = new THREE.Mesh(rimPipingGeo, hardwareGoldMat);
  lidRimMesh.position.set(0, 0.02, 1.44);
  lidPivot.add(lidRimMesh);

  // Crisp ivory silk-satin lid liner stamped with "ONE SOUL · MUMBAI" flush on the underside of the lid
  const linerGeo = regGeo(new THREE.PlaneGeometry(2.04, 2.04));
  linerGeo.rotateX(Math.PI / 2);
  const linerMesh = new THREE.Mesh(linerGeo, lidSilkMat);
  linerMesh.position.set(0, -0.046, 1.44);
  lidPivot.add(linerMesh);

  // Fine recessed gold trim framing the ivory silk lid liner
  const lidInnerTrim = new THREE.Mesh(innerRimGeo, hardwareGoldMat);
  lidInnerTrim.position.set(0, -0.042, 1.44);
  lidPivot.add(lidInnerTrim);

  return {
    boxGroup,
    lidPivot,
    geometries,
    materials,
    textures,
  };
}
