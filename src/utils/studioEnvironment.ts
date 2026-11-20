import * as THREE from 'three';

export type GemToneKey = 'd-color-icy' | 'vivid-pink' | 'champagne';

export interface GemOpticalPreset {
  bodyTint: THREE.Color;
  dispersionStrength: number;
  fireTint: THREE.Color;
  brillianceBoost: number;
}

export const GEM_OPTICAL_PRESETS: Record<GemToneKey, GemOpticalPreset> = {
  'd-color-icy': {
    bodyTint: new THREE.Color(0.985, 0.992, 1.0),
    dispersionStrength: 1.12,
    fireTint: new THREE.Color(0.95, 0.98, 1.0),
    brillianceBoost: 1.14,
  },
  'vivid-pink': {
    bodyTint: new THREE.Color(1.0, 0.34, 0.56),
    dispersionStrength: 1.0,
    fireTint: new THREE.Color(1.0, 0.65, 0.84),
    brillianceBoost: 1.08,
  },
  champagne: {
    bodyTint: new THREE.Color(1.0, 0.72, 0.34),
    dispersionStrength: 1.02,
    fireTint: new THREE.Color(1.0, 0.86, 0.58),
    brillianceBoost: 1.1,
  },
};

/**
 * Generates a high-contrast jeweler's light-tent equirectangular environment texture.
 * Real polished 18K gold and diamonds look metallic & crystalline ONLY when crisp
 * white overhead/side softbox panels sit beside deep dark negative-fill studio cards.
 */
export function createJewelerStudioEnvTexture(
  renderer: THREE.WebGLRenderer
): { rawEnvTexture: THREE.CanvasTexture; pmremTexture: THREE.Texture; dispose: () => void } {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Studio dome base: high-contrast neutral negative-fill + warm studio table bounce underneath
    const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
    baseGrad.addColorStop(0.0, '#e2dfd8');   // bright overhead diffuser zenith
    baseGrad.addColorStop(0.16, '#2b2723');  // crisp dark contrast collar
    baseGrad.addColorStop(0.36, '#62594e');  // warm studio midtone bounce
    baseGrad.addColorStop(0.50, '#1c1815');  // crisp horizon negative-fill band (gives gold liquid depth!)
    baseGrad.addColorStop(0.64, '#8d7f6c');  // warm champagne table bounce
    baseGrad.addColorStop(0.84, '#594d3f');  // warm lower fill so bottom gold stays molten, never black
    baseGrad.addColorStop(1.0, '#362d24');   // soft grounded studio base
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Primary overhead softbox dome (crisp pure white luminous crown reflection)
    const zenithGrad = ctx.createLinearGradient(0, 0, 0, height * 0.22);
    zenithGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    zenithGrad.addColorStop(0.65, 'rgba(255, 252, 245, 0.92)');
    zenithGrad.addColorStop(1, 'rgba(255, 252, 245, 0.0)');
    ctx.fillStyle = zenithGrad;
    ctx.fillRect(0, 0, width, height * 0.22);

    // 3. Sharp vertical jeweler light-tent diffuser panels (create sleek specular ribbons along curved gold)
    const drawSoftbox = (
      x: number,
      y: number,
      w: number,
      h: number,
      color: string,
      blur = 8
    ) => {
      ctx.save();
      ctx.filter = `blur(${blur}px)`;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    };

    // High-key studio strip lights around the 360° perimeter separated by dark negative-fill gaps
    drawSoftbox(65, 60, 125, 210, '#ffffff', 6);
    drawSoftbox(295, 48, 95, 230, '#fffaf0', 5);
    drawSoftbox(520, 62, 130, 200, '#f4f8ff', 6); // subtle cool daylight fill
    drawSoftbox(760, 50, 105, 225, '#ffffff', 5);
    drawSoftbox(930, 85, 65, 165, '#fff6e0', 6);

    // Crisp horizontal reflector strip just below horizon (makes the underside of the shank gleam!)
    drawSoftbox(30, 295, 240, 38, '#f5efe2', 7);
    drawSoftbox(380, 305, 280, 42, '#fffdf7', 7);
    drawSoftbox(740, 298, 220, 36, '#efe6d5', 7);

    // Sharp black negative-fill cards right next to softboxes (signature luxury jewelry photography trick!)
    drawSoftbox(212, 70, 58, 205, '#070606', 3);
    drawSoftbox(428, 65, 68, 215, '#050506', 3);
    drawSoftbox(676, 75, 58, 200, '#070606', 3);

    // Pinpoint jewelers' LED spotlight cluster dots (trigger dazzling diamond scintillation flashes!)
    const spots: Array<[number, number, number, string]> = [
      [120, 95, 18, '#ffffff'],
      [255, 58, 12, '#eef6ff'],
      [345, 115, 16, '#fffdf4'],
      [485, 52, 14, '#ffffff'],
      [585, 105, 20, '#f5faff'],
      [715, 65, 13, '#ffffff'],
      [815, 112, 18, '#fffaf0'],
      [955, 78, 15, '#ffffff'],
      [180, 195, 10, '#ffffff'],
      [620, 185, 11, '#f0f7ff'],
      [880, 190, 10, '#fff7e6'],
    ];
    for (const [cx, cy, r, col] of spots) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, col);
      g.addColorStop(0.45, col);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const rawEnvTexture = new THREE.CanvasTexture(canvas);
  rawEnvTexture.mapping = THREE.EquirectangularReflectionMapping;
  rawEnvTexture.colorSpace = THREE.SRGBColorSpace;
  rawEnvTexture.wrapS = THREE.RepeatWrapping;
  rawEnvTexture.wrapT = THREE.ClampToEdgeWrapping;
  rawEnvTexture.minFilter = THREE.LinearMipmapLinearFilter;
  rawEnvTexture.magFilter = THREE.LinearFilter;
  rawEnvTexture.needsUpdate = true;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const pmremRT = pmremGenerator.fromEquirectangular(rawEnvTexture);
  pmremGenerator.dispose();

  return {
    rawEnvTexture,
    pmremTexture: pmremRT.texture,
    dispose: () => {
      rawEnvTexture.dispose();
      pmremRT.dispose();
    },
  };
}

/**
 * Creates a subtle procedural hand-polished gold micro-roughness texture so 18K gold
 * exhibits organic jeweler's buffing realism rather than sterile uniform CGI gloss.
 */
export function createGoldMicroPolishTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Base mid-high gloss (roughness multiplier ~0.85..1.0)
    ctx.fillStyle = '#e6e6e6';
    ctx.fillRect(0, 0, size, size);
    // Ultra-fine circumferential buffing strokes
    for (let y = 0; y < size; y++) {
      const v = 215 + Math.floor(Math.sin(y * 0.7) * 12 + Math.cos(y * 2.3) * 8);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(0, y, size, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 2);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Physically-inspired Multi-Bounce Internal Reflection & Spectral Dispersion Shader
 * for VVS1 Moissanite / Diamond gemstones.
 *
 * Works identically on Hardware GPUs and Software WebGL (no milky transmission passes),
 * producing razor-sharp flat facets, high-contrast black/white diamond arrow reflections,
 * internal pavilion scintillation, and authentic 0.104 chromatic rainbow fire.
 */
export function createDiamondOpticalMaterial(
  envMap: THREE.Texture,
  initialTone: GemToneKey = 'd-color-icy'
): THREE.ShaderMaterial {
  const preset = GEM_OPTICAL_PRESETS[initialTone];

  return new THREE.ShaderMaterial({
    uniforms: {
      uEnvMap: { value: envMap },
      uBodyTint: { value: preset.bodyTint.clone() },
      uFireTint: { value: preset.fireTint.clone() },
      uMetalReflectionTint: { value: new THREE.Color(0xf4cf76) },
      uDispersion: { value: preset.dispersionStrength },
      uBrilliance: { value: preset.brillianceBoost },
      uEnvRotation: { value: 0.0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      varying vec3 vLocalPos;
      varying vec3 vLocalNormal;

      void main() {
        vLocalPos = position;
        vLocalNormal = normalize(normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        #ifdef USE_INSTANCING
          worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
          mat3 instMat = mat3(modelMatrix * instanceMatrix);
          vWorldNormal = normalize(instMat * normal);
        #else
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
        #endif
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uEnvMap;
      uniform vec3 uBodyTint;
      uniform vec3 uFireTint;
      uniform vec3 uMetalReflectionTint;
      uniform float uDispersion;
      uniform float uBrilliance;
      uniform float uEnvRotation;

      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      varying vec3 vLocalPos;
      varying vec3 vLocalNormal;

      const float PI = 3.14159265359;
      const float INV_TWO_PI = 0.15915494309;
      const float INV_PI = 0.31830988618;

      vec3 sampleEnv(vec3 dir) {
        vec3 d = normalize(dir);
        float c = cos(uEnvRotation);
        float s = sin(uEnvRotation);
        vec3 rotD = vec3(d.x * c - d.z * s, d.y, d.x * s + d.z * c);
        float u = atan(rotD.z, rotD.x) * INV_TWO_PI + 0.5;
        float v = asin(clamp(rotD.y, -1.0, 1.0)) * INV_PI + 0.5;
        // sRGB to linear approximation for punchy HDR highlights
        vec3 col = texture2D(uEnvMap, vec2(u, v)).rgb;
        return pow(max(col, vec3(0.0)), vec3(2.15)) * 1.45;
      }

      // Simulates crisp 8-fold internal pavilion facet plane bounce inside the cut gem
      vec3 internalFacetBounce(vec3 rayDir, vec3 localPos, float foldOffset) {
        vec3 p = normalize(rayDir + localPos * 0.55);
        float ang = atan(p.z, p.x) + foldOffset;
        // Quantize to 8 crisp pavilion facet sectors (yields authentic diamond arrows & scintillation!)
        float sector = floor((ang + PI) / (PI * 0.25)) * (PI * 0.25) - PI + PI * 0.125;
        vec3 pavNormal = normalize(vec3(cos(sector) * 0.78, -0.62, sin(sector) * 0.78));
        return reflect(rayDir, pavNormal);
      }

      void main() {
        // Compute mathematically flat geometric face normal per triangle using screen-space derivatives
        // so every single facet stays razor-sharp even under InstancedMesh transforms
        vec3 dpdx = dFdx(vWorldPos);
        vec3 dpdy = dFdy(vWorldPos);
        vec3 flatN = normalize(cross(dpdx, dpdy));
        vec3 N = length(flatN) > 0.001 ? flatN : normalize(vWorldNormal);
        vec3 V = normalize(cameraPosition - vWorldPos);
        if (dot(N, V) < 0.0) N = -N;

        float NdotV = clamp(dot(N, V), 0.0, 1.0);

        // 1. High-IOR Fresnel (Moissanite IOR ~2.65 -> F0 = ((2.65-1)/(2.65+1))^2 = 0.204)
        float F0 = 0.205;
        float fresnel = F0 + (1.0 - F0) * pow(1.0 - NdotV, 4.2);

        // 2. Crisp Surface Mirror Reflection (white studio softbox highlights & dark arrow contrast)
        vec3 R = reflect(-V, N);
        vec3 surfaceRefl = sampleEnv(R);

        // 3. Multi-Bounce Internal Total Internal Reflection + Chromatic Spectral Dispersion (R, G, B)
        // Moissanite has 2.36x the dispersion of diamond (0.104)
        float disp = 0.028 * uDispersion;
        vec3 refrR = refract(-V, N, 1.0 / (2.65 - disp * 2.2));
        vec3 refrG = refract(-V, N, 1.0 / 2.65);
        vec3 refrB = refract(-V, N, 1.0 / (2.65 + disp * 2.6));

        // First internal bounce off lower pavilion facets (uses finer angular+radial stepping so the flat table displays crisp Hearts & Arrows wedges!)
        vec3 b1R = internalFacetBounce(refrR, vLocalPos * 1.35, 0.0);
        vec3 b1G = internalFacetBounce(refrG, vLocalPos * 1.35, 0.0);
        vec3 b1B = internalFacetBounce(refrB, vLocalPos * 1.35, 0.0);

        // Second internal bounce across opposite pavilion wall (creates deep crystalline sparkle!)
        vec3 b2R = internalFacetBounce(b1R, -vLocalPos * 1.15, 0.3927);
        vec3 b2G = internalFacetBounce(b1G, -vLocalPos * 1.15, 0.3927);
        vec3 b2B = internalFacetBounce(b1B, -vLocalPos * 1.15, 0.3927);

        // Sample high-contrast studio light tent separately per RGB wavelength for genuine spectral fire!
        vec3 env1 = vec3(
          sampleEnv(b1R).r,
          sampleEnv(b1G).g,
          sampleEnv(b1B).b
        );
        vec3 env2 = vec3(
          sampleEnv(b2R).r,
          sampleEnv(b2G).g,
          sampleEnv(b2B).b
        );

        // Authentic Hearts & Arrows radial facet scintillation inside the crown table
        float rad = length(vLocalPos.xz);
        float ang8 = atan(vLocalPos.z, vLocalPos.x);
        float arrowPattern = abs(sin(ang8 * 4.0 + rad * 4.5));
        float tableMask = smoothstep(0.75, 0.96, abs(vLocalNormal.y));
        float arrowContrast = mix(1.0, mix(0.68, 1.24, smoothstep(0.22, 0.78, arrowPattern)), tableMask);

        // Combine primary internal return + deep secondary sparkle
        vec3 internalLight = (env1 * 0.72 + env2 * 0.70) * arrowContrast;

        // Emphasize spectral rainbow fire on tilted crown/star/bezel facets
        float tiltFactor = smoothstep(0.12, 0.85, 1.0 - abs(vLocalNormal.y));
        float lum = dot(internalLight, vec3(0.299, 0.587, 0.114));
        vec3 spectralFire = (internalLight - vec3(lum)) * (1.45 + 2.0 * tiltFactor * uDispersion);
        internalLight = max(vec3(0.0), vec3(lum) + spectralFire * uFireTint);

        // 4. Physically-inspired Beer-Lambert internal absorption + subtle setting-metal reflection kiss in lower pavilion
        float opticalDepth = mix(0.55, 1.45, 1.0 - NdotV * 0.45);
        vec3 absorption = pow(clamp(uBodyTint, vec3(0.05), vec3(1.0)), vec3(opticalDepth * 1.65));
        float lowerPavilionMask = smoothstep(0.05, -0.45, vLocalPos.y);
        vec3 settingKiss = mix(vec3(1.0), mix(vec3(1.0), uMetalReflectionTint, 0.22), lowerPavilionMask);
        vec3 refractedColor = internalLight * absorption * settingKiss * uBrilliance;

        // 5. Crisp Pinpoint Studio Jeweler Spotlight Glints (surface + internal scintillation)
        vec3 L1 = normalize(vec3(0.45, 0.82, 0.55));
        vec3 L2 = normalize(vec3(-0.62, 0.58, 0.52));
        vec3 L3 = normalize(vec3(0.15, -0.35, 0.92));
        vec3 H1 = normalize(L1 + V);
        vec3 H2 = normalize(L2 + V);
        vec3 H3 = normalize(L3 + V);

        float spec1 = pow(max(dot(N, H1), 0.0), 220.0) * 2.8;
        float spec2 = pow(max(dot(N, H2), 0.0), 160.0) * 1.8;
        float spec3 = pow(max(dot(N, H3), 0.0), 130.0) * 1.0;

        // Subtle crisp facet-edge rim glint so neighboring facets separate cleanly
        float edgeSheen = pow(1.0 - NdotV, 3.0) * 0.28;

        // Final Energy-Conserving Composition:
        // Crisp dark-and-light surface reflections layered over brilliant refractive fire
        vec3 finalColor = mix(refractedColor, surfaceRefl * 1.38, fresnel);
        finalColor += vec3(spec1 + spec2 + spec3) * mix(vec3(1.0), uFireTint, 0.22);
        finalColor += surfaceRefl * edgeSheen * 0.58;

        // ACES-like gentle shoulder roll-off so brightest diamond flashes gleam pure white without harsh clipping
        finalColor = (finalColor * (2.51 * finalColor + 0.03)) / (finalColor * (2.43 * finalColor + 0.59) + 0.14);
        finalColor = pow(clamp(finalColor, 0.0, 1.0), vec3(1.0 / 2.2));

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    side: THREE.FrontSide,
    toneMapped: false,
  });
}

/**
 * Generates a photorealistic contact shadow disc infused with delicate warm-gold
 * and subtle prismatic diamond light caustics for white studio floor grounding.
 */
export function createPrismaticCausticShadowTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const cx = size * 0.5;
    const cy = size * 0.5;

    // 1. Soft studio contact shadow penumbra
    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, size * 0.48);
    grad.addColorStop(0.0, 'rgba(22, 17, 12, 0.34)');
    grad.addColorStop(0.28, 'rgba(22, 17, 12, 0.18)');
    grad.addColorStop(0.60, 'rgba(22, 17, 12, 0.05)');
    grad.addColorStop(1.0, 'rgba(22, 17, 12, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // 2. Delicate radial diamond light caustic rays (subtle golden-champagne + cool prism sparkles)
    ctx.save();
    ctx.translate(cx, cy);
    for (let i = 0; i < 18; i++) {
      const ang = (i / 18) * Math.PI * 2 + 0.18;
      const dist = 36 + (i % 3) * 28;
      const rx = Math.cos(ang) * dist;
      const ry = Math.sin(ang) * dist;
      const rayW = 10 + (i % 4) * 5;
      const hue = i % 3 === 0 ? 'rgba(255, 224, 152, 0.32)' : i % 3 === 1 ? 'rgba(220, 240, 255, 0.28)' : 'rgba(255, 215, 232, 0.22)';

      const g = ctx.createRadialGradient(rx, ry, 0, rx, ry, rayW);
      g.addColorStop(0, hue);
      g.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(rx, ry, rayW, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
