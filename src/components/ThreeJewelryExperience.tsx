import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { Sparkles, Eye, Box, Hand, RotateCcw, ChevronRight, ChevronLeft, Maximize2, Minimize2, Sun, Moon, MessageCircle } from 'lucide-react';
import SquishSwitch from './SquishSwitch';
import { GoldPurity, GoldTone, Currency } from '../types/jewelry';
import { calculateItemPrice, formatCurrency } from '../utils/pricing';
import { buildWhatsAppUrl } from '../utils/contact';
import {
  createCushionBrilliantGeometry,
  createRoundBrilliantMeleeGeometry,
  createCathedralShankGeometry,
  createEagleClawProngGeometry,
  createCathedralArchGeometry,
  createCushionRailGeometry,
  computeShoulderPaveSpecs,
  computeHiddenHaloSpecs,
} from '../utils/ringGeometry';
import {
  createJewelerStudioEnvTexture,
  createGoldMicroPolishTexture,
  createDiamondOpticalMaterial,
  createPrismaticCausticShadowTexture,
  GEM_OPTICAL_PRESETS,
  GemToneKey,
} from '../utils/studioEnvironment';
import {
  buildSculptedLeftHand,
  createSkinTextures,
  createNaturalNailTexture,
} from '../utils/handGeometry';
import { buildLuxuryVelvetBox } from '../utils/velvetBoxGeometry';

export type SceneMode = 'solitaire' | 'box' | 'split' | 'hand';
export type HandViewMode = 'full' | 'closeup' | 'profile';

export type SkinToneId = 'fair' | 'warm' | 'honey' | 'bronze';

export const skinToneMap: Record<SkinToneId, { name: string; hex: number; nailHex: number; sheenHex: number; bgClass: string }> = {
  fair: { name: 'Fair Ivory', hex: 0xe6b79f, nailHex: 0xfff6f3, sheenHex: 0xffd7c8, bgClass: 'bg-[#efc7b3]' },
  warm: { name: 'Warm Beige', hex: 0xc98a6b, nailHex: 0xf4e1da, sheenHex: 0xeba98c, bgClass: 'bg-[#d8a082]' },
  honey: { name: 'Rich Honey', hex: 0x945638, nailHex: 0xdcbdb2, sheenHex: 0xc77d56, bgClass: 'bg-[#a46543]' },
  bronze: { name: 'Deep Bronze', hex: 0x5c3221, nailHex: 0xc29e92, sheenHex: 0x90543a, bgClass: 'bg-[#653826]' },
};

interface ThreeJewelryExperienceProps {
  onAddToInquiry: (metal: GoldPurity, tone: GoldTone, carat: number) => void;
  onRequestCad: () => void;
  currency: Currency;
  live18kGoldRateInr: number;
  themeMode?: 'light' | 'dark';
  onToggleThemeMode?: () => void;
}

export const ThreeJewelryExperience: React.FC<ThreeJewelryExperienceProps> = ({
  onAddToInquiry,
  onRequestCad,
  currency,
  live18kGoldRateInr,
  themeMode = 'light',
  onToggleThemeMode,
}) => {
  const isLight = themeMode === 'light';
  const sectionRef = useRef<HTMLElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState<SceneMode>('solitaire');
  const [selectedMetal, setSelectedMetal] = useState<GoldTone>('Yellow Gold');
  const [selectedPurity, setSelectedPurity] = useState<GoldPurity>('18K');
  const [selectedGemTone, setSelectedGemTone] = useState<GemToneKey>('d-color-icy');
  const [selectedSkinTone, setSelectedSkinTone] = useState<SkinToneId>('warm');
  const [selectedCarat, setSelectedCarat] = useState<number>(3.0);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [activeSplitTab, setActiveSplitTab] = useState<'shank' | 'eternity'>('shank');
  const [handViewMode, setHandViewMode] = useState<HandViewMode>('full');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isFullscreen]);

  const SCENES: SceneMode[] = ['solitaire', 'box', 'split', 'hand'];
  const currentSceneIndex = SCENES.indexOf(activeScene);
  const handlePrevScene = () => {
    const prevIdx = (currentSceneIndex - 1 + SCENES.length) % SCENES.length;
    setActiveScene(SCENES[prevIdx]);
  };
  const handleNextScene = () => {
    const nextIdx = (currentSceneIndex + 1) % SCENES.length;
    setActiveScene(SCENES[nextIdx]);
  };

  // Pricing calculation
  const livePricing = calculateItemPrice({
    baseGoldWeightGrams: 4.8,
    goldPurity: selectedPurity,
    live18kGoldRateInr,
    stoneCostInr: selectedGemTone === 'vivid-pink' ? 22000 : 19500,
    makingChargeInr: 8500,
    caratMultiplier: selectedCarat / 3.0,
  });

  // State refs to pass into the Three.js render loop without re-triggering useEffect
  const stateRef = useRef({
    activeScene: 'solitaire' as SceneMode,
    selectedMetal: 'Yellow Gold' as GoldTone,
    selectedGemTone: 'd-color-icy' as GemToneKey,
    selectedSkinTone: 'warm' as SkinToneId,
    selectedCarat: 3.0,
    isRotating: true,
    activeSplitTab: 'shank' as 'shank' | 'eternity',
    handViewMode: 'full' as HandViewMode,
    isLight: true,
  });

  useEffect(() => {
    stateRef.current = {
      activeScene,
      selectedMetal,
      selectedGemTone,
      selectedSkinTone,
      selectedCarat,
      isRotating,
      activeSplitTab,
      handViewMode,
      isLight,
    };
  }, [activeScene, selectedMetal, selectedGemTone, selectedSkinTone, selectedCarat, isRotating, activeSplitTab, handViewMode, isLight]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL detection (only affects rendering cost, never scene fidelity)
    const isSoftwareGl = (() => {
      const probe = document.createElement('canvas').getContext('webgl2');
      if (!probe) return true;
      const ext = probe.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
      const gpu = String(probe.getParameter(param));
      probe.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      100
    );
    camera.position.set(0, 0.35, 9.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // HIGH-CONTRAST JEWELER'S LIGHT-TENT ENVIRONMENT MAP
    // Essential negative-fill cards beside crisp overhead/side softboxes make 18K gold
    // gleam like real liquid precious metal and give Moissanite razor-sharp arrow contrast.
    const studioEnv = createJewelerStudioEnvTexture(renderer);
    scene.environment = studioEnv.pmremTexture;

    const goldPolishTex = createGoldMicroPolishTexture();
    goldPolishTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // ROOT HIERARCHY
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. PHOTOREALISTIC MULTI-PART SOLITAIRE RING GROUP
    const ringGroup = new THREE.Group();
    rootGroup.add(ringGroup);

    // Calibrated authentic 18K alloy albedos (zero emissive; metalness = 1.0 for real metallic Fresnel)
    const metalColors: Record<GoldTone, THREE.Color> = {
      'Yellow Gold': new THREE.Color(0xf0c975), // Authentic 750 18K champagne-yellow gold
      'White Gold': new THREE.Color(0xeef1f6),  // Rhodium-plated 18K white gold / platinum
      'Rose Gold': new THREE.Color(0xe8aa94),   // Parisian 18K blush rose gold
    };

    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: metalColors[stateRef.current.selectedMetal].clone(),
      metalness: 1.0,
      roughness: 0.11,
      roughnessMap: goldPolishTex,
      clearcoat: 0.25,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
      envMapIntensity: 1.45,
    });

    // Subtle interior/gallery recessed gold with slightly deeper satin polish for realistic depth
    const galleryGoldMaterial = new THREE.MeshPhysicalMaterial({
      color: metalColors[stateRef.current.selectedMetal].clone(),
      metalness: 1.0,
      roughness: 0.16,
      roughnessMap: goldPolishTex,
      envMapIntensity: 1.35,
    });

    const ringGeometries: THREE.BufferGeometry[] = [];
    const registerRingGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
      ringGeometries.push(geo);
      return geo;
    };

    // 1A. Comfort-Fit Cathedral Solitaire Shank (D-profile court cross-section)
    const shankGeo = registerRingGeo(createCathedralShankGeometry(1.48, 96, 24));
    const shankMesh = new THREE.Mesh(shankGeo, goldMaterial);
    shankMesh.castShadow = true;
    shankMesh.receiveShadow = true;
    ringGroup.add(shankMesh);

    // 1B. Pair of Sculpted Cathedral Shoulder Arches sweeping up to cradle the gallery
    const leftArchGeo = registerRingGeo(createCathedralArchGeometry(-1, 1.48, 1.92, 0.48));
    const rightArchGeo = registerRingGeo(createCathedralArchGeometry(1, 1.48, 1.92, 0.48));
    const leftArchMesh = new THREE.Mesh(leftArchGeo, goldMaterial);
    const rightArchMesh = new THREE.Mesh(rightArchGeo, goldMaterial);
    leftArchMesh.castShadow = true;
    rightArchMesh.castShadow = true;
    ringGroup.add(leftArchMesh, rightArchMesh);

    // 1C-1E. Solitaire Crown Assembly pivoted at gallery base (y = 1.63) for live carat scaling
    const GALLERY_PIVOT_Y = 1.63;
    const crownGroup = new THREE.Group();
    crownGroup.position.set(0, GALLERY_PIVOT_Y, 0);
    ringGroup.add(crownGroup);

    const crownInner = new THREE.Group();
    crownInner.position.set(0, -GALLERY_PIVOT_Y, 0);
    crownGroup.add(crownInner);

    // Lower Bearing Collet Seat & Upper Hidden-Halo Gallery Rail
    const lowerColletGeo = registerRingGeo(createCushionRailGeometry(0.30, 0.042, 1.65, 48));
    const lowerColletMesh = new THREE.Mesh(lowerColletGeo, galleryGoldMaterial);
    const upperGalleryGeo = registerRingGeo(createCushionRailGeometry(0.51, 0.042, 1.94, 64));
    const upperGalleryMesh = new THREE.Mesh(upperGalleryGeo, galleryGoldMaterial);
    crownInner.add(lowerColletMesh, upperGalleryMesh);

    // Four Sculpted Tapered Eagle-Claw Prongs clasping the cushion corners
    const GEM_CENTER_Y = 2.10;
    const GEM_RADIUS = 0.62;
    for (let i = 0; i < 4; i++) {
      const prongGeo = registerRingGeo(createEagleClawProngGeometry(i, GEM_CENTER_Y, GEM_RADIUS, 1.63));
      const prongMesh = new THREE.Mesh(prongGeo, goldMaterial);
      prongMesh.castShadow = true;
      crownInner.add(prongMesh);
    }

    // Physically-Inspired Multi-Bounce Spectral Dispersion Center Gemstone (57+ flat facets)
    const gemGeo = registerRingGeo(createCushionBrilliantGeometry(GEM_RADIUS, 2.75));
    const centerDiamondMat = createDiamondOpticalMaterial(
      studioEnv.rawEnvTexture,
      stateRef.current.selectedGemTone
    );
    const gemMesh = new THREE.Mesh(gemGeo, centerDiamondMat);
    gemMesh.position.set(0, GEM_CENTER_Y, 0);
    gemMesh.castShadow = true;
    crownInner.add(gemMesh);

    // 1F. Faceted Melee Diamonds (D-Color Icy White) split cleanly between shank pavé & crown hidden halo
    const meleeDiamondMat = createDiamondOpticalMaterial(studioEnv.rawEnvTexture, 'd-color-icy');
    const meleeGeo = registerRingGeo(createRoundBrilliantMeleeGeometry(0.056));
    const { stones: paveSpecs, beads: beadSpecs } = computeShoulderPaveSpecs(1.48, 8);
    const hiddenHaloSpecs = computeHiddenHaloSpecs(0.555, 1.94, 16);

    const _dummy = new THREE.Object3D();
    const paveInstanced = new THREE.InstancedMesh(meleeGeo, meleeDiamondMat, paveSpecs.length);
    paveSpecs.forEach((spec, idx) => {
      _dummy.position.copy(spec.position);
      _dummy.quaternion.copy(spec.quaternion);
      _dummy.scale.setScalar(spec.scale);
      _dummy.updateMatrix();
      paveInstanced.setMatrixAt(idx, _dummy.matrix);
    });
    paveInstanced.instanceMatrix.needsUpdate = true;
    paveInstanced.computeBoundingSphere();
    ringGroup.add(paveInstanced);

    const hiddenHaloInstanced = new THREE.InstancedMesh(meleeGeo, meleeDiamondMat, hiddenHaloSpecs.length);
    hiddenHaloSpecs.forEach((spec, idx) => {
      _dummy.position.copy(spec.position);
      _dummy.quaternion.copy(spec.quaternion);
      _dummy.scale.setScalar(spec.scale);
      _dummy.updateMatrix();
      hiddenHaloInstanced.setMatrixAt(idx, _dummy.matrix);
    });
    hiddenHaloInstanced.instanceMatrix.needsUpdate = true;
    hiddenHaloInstanced.computeBoundingSphere();
    crownInner.add(hiddenHaloInstanced);

    // 1G. Shared Micro Gold Bead Prongs cradling every shoulder pavé stone
    const beadGeo = registerRingGeo(new THREE.SphereGeometry(0.022, 10, 10));
    const beadInstanced = new THREE.InstancedMesh(beadGeo, goldMaterial, beadSpecs.length);
    beadSpecs.forEach((spec, idx) => {
      _dummy.position.copy(spec.position);
      _dummy.quaternion.copy(spec.quaternion);
      _dummy.scale.setScalar(spec.scale);
      _dummy.updateMatrix();
      beadInstanced.setMatrixAt(idx, _dummy.matrix);
    });
    beadInstanced.instanceMatrix.needsUpdate = true;
    beadInstanced.computeBoundingSphere();
    ringGroup.add(beadInstanced);

    // 2. HAUTE-JOAILLERIE OCTAGONAL VELVET PRESENTATION BOX (SCENE 2)
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const velvetBoxRig = buildLuxuryVelvetBox(maxAniso);
    const { boxGroup, lidPivot } = velvetBoxRig;
    rootGroup.add(boxGroup);
    boxGroup.position.set(1.5, -0.6, 0);
    boxGroup.scale.set(0.001, 0.001, 0.001);

    // 3. SCULPTED ANATOMICAL LEFT HAND TRY-ON RIG (SCENE 4)
    const skinTex = createSkinTextures();
    skinTex.bumpMap.anisotropy = maxAniso;
    skinTex.roughnessMap.anisotropy = maxAniso;
    const nailAlbedoTex = createNaturalNailTexture();
    nailAlbedoTex.anisotropy = maxAniso;

    const initialTone = skinToneMap[stateRef.current.selectedSkinTone];
    const skinMaterial = new THREE.MeshPhysicalMaterial({
      color: initialTone.hex,
      vertexColors: true,
      roughness: 0.74,
      roughnessMap: skinTex.roughnessMap,
      metalness: 0.0,
      bumpMap: skinTex.bumpMap,
      bumpScale: 0.0085,
      sheen: 0.48,
      sheenRoughness: 0.75,
      sheenColor: new THREE.Color(initialTone.sheenHex),
      envMapIntensity: 0.28,
    });
    const nailMaterial = new THREE.MeshPhysicalMaterial({
      color: initialTone.nailHex,
      map: nailAlbedoTex,
      roughness: 0.21,
      metalness: 0.0,
      clearcoat: 0.76,
      clearcoatRoughness: 0.13,
      envMapIntensity: 0.56,
    });

    const handRig = buildSculptedLeftHand(skinMaterial, nailMaterial);
    const { handGroup, ringAnchor, ringFitScale, geometries: handGeometries } = handRig;
    rootGroup.add(handGroup);
    handGroup.position.set(0, -8, 0);
    handGroup.scale.set(0.001, 0.001, 0.001);
    handGroup.visible = false;

    // 4. BALANCED JEWELRY STUDIO 3-POINT + SOFTBOX LIGHTING RIG
    const hemiLight = new THREE.HemisphereLight(0xf8f9fc, 0x3b332b, 0.88);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.55);
    keyLight.position.set(4.5, 8.5, 6.5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.camera.left = -4;
      keyLight.shadow.camera.right = 4;
      keyLight.shadow.camera.top = 4;
      keyLight.shadow.camera.bottom = -4;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const coolFill = new THREE.DirectionalLight(0xdcebff, 1.15);
    coolFill.position.set(-6.0, 3.0, 4.5);
    scene.add(coolFill);

    const warmRim = new THREE.DirectionalLight(0xffe6ba, 1.45);
    warmRim.position.set(2.5, -3.5, -5.5);
    scene.add(warmRim);

    // Physical overhead & side studio softboxes for liquid specular bands on hardware WebGL
    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const topSoftbox = new THREE.RectAreaLight(0xfffaf2, 3.4, 5.5, 3.2);
      topSoftbox.position.set(0, 6.2, 1.8);
      topSoftbox.lookAt(0, 0, 0);
      scene.add(topSoftbox);

      const leftSoftbox = new THREE.RectAreaLight(0xeef5ff, 2.1, 3.6, 4.8);
      leftSoftbox.position.set(-5.2, 1.6, 3.6);
      leftSoftbox.lookAt(0, 0, 0);
      scene.add(leftSoftbox);
    }

    // Soft feathered studio shadow with subtle golden & prismatic diamond caustics
    const shadowTexture = createPrismaticCausticShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(4.8, 4.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: isLight ? 0.56 : 0.72,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -2.05, 0);
    scene.add(shadowMesh);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // INTERACTIVE POINTER DRAG & ROTATION
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let userRotX = 0;
    let userRotY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      userRotY += deltaX * 0.008;
      userRotX += deltaY * 0.008;
      userRotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, userRotX));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Pre-allocated scratch vectors/quaternions/colors for zero-GC animation loop
    const _targetSkinColor = new THREE.Color();
    const _targetNailColor = new THREE.Color();
    const _targetSheenColor = new THREE.Color();
    const _vPos = new THREE.Vector3();
    const _vScale = new THREE.Vector3();
    const _vCam = new THREE.Vector3();
    const _lookTarget = new THREE.Vector3(0, 0.05, 0);
    const _desiredLook = new THREE.Vector3(0, 0.05, 0);
    const _anchorPos = new THREE.Vector3();
    const _anchorQuat = new THREE.Quaternion();
    const _vHiddenScale = new THREE.Vector3(0.001, 0.001, 0.001);
    const _vHiddenBoxPos = new THREE.Vector3(1, -8, 0);
    const _vHiddenHandPos = new THREE.Vector3(0, -8, 0);

    // Start ring at an editorial 3/4 luxury jewelry angle so facets, prongs & inner gold shine immediately
    ringGroup.rotation.set(0.24, -0.52, -0.06);

    let frameId = 0;
    let isDisposed = false;
    let lastTimeMs = performance.now();
    let elapsedSec = 0;
    let prevScene: SceneMode = stateRef.current.activeScene;
    let prevHandView: HandViewMode = stateRef.current.handViewMode;
    let handSeatBlend = 0;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (isDisposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (isDisposed) return;
      const nowMs = performance.now();
      // Real-time elapsed dt capped at 0.45s so stage/material transitions stay snappy even under 4fps software WebGL
      const dt = Math.min(0.45, Math.max(0.001, (nowMs - lastTimeMs) / 1000));
      lastTimeMs = nowMs;
      elapsedSec += dt;

      const {
        activeScene: currScene,
        selectedMetal: currMetal,
        selectedGemTone: currGem,
        selectedSkinTone: currSkinTone,
        selectedCarat: currCarat,
        isRotating: rotate,
        activeSplitTab: currSplit,
        handViewMode: currHandView,
        isLight: currentIsLight,
      } = stateRef.current;

      // Reset manual drag offsets when changing scenes or hand view presets so prior drags never twist the new view
      if (currScene !== prevScene) {
        userRotX = 0;
        userRotY = 0;
        if (currScene === 'hand') {
          handSeatBlend = 0;
          handGroup.visible = true;
        }
        prevScene = currScene;
      }
      if (currHandView !== prevHandView) {
        userRotX = 0;
        userRotY = 0;
        prevHandView = currHandView;
      }

      const dampFactor = 1 - Math.exp(-8.5 * dt);
      const fastDamp = 1 - Math.exp(-13.5 * dt);

      // Update authentic 18K metal alloy color smoothly (plus warm setting reflection tint inside diamond pavilion)
      const targetMetalCol = metalColors[currMetal];
      goldMaterial.color.lerp(targetMetalCol, dampFactor);
      galleryGoldMaterial.color.lerp(targetMetalCol, dampFactor);
      centerDiamondMat.uniforms.uMetalReflectionTint.value.lerp(targetMetalCol, dampFactor);

      // Update live carat crown proportion smoothly around gallery pivot
      const targetCrownScale = Math.pow(currCarat / 3.0, 0.28);
      crownGroup.scale.lerp(_vScale.setScalar(targetCrownScale), dampFactor);

      // Update center diamond optical absorption & dispersion smoothly
      const targetPreset = GEM_OPTICAL_PRESETS[currGem];
      centerDiamondMat.uniforms.uBodyTint.value.lerp(targetPreset.bodyTint, fastDamp);
      centerDiamondMat.uniforms.uFireTint.value.lerp(targetPreset.fireTint, fastDamp);
      centerDiamondMat.uniforms.uDispersion.value = THREE.MathUtils.lerp(
        centerDiamondMat.uniforms.uDispersion.value,
        targetPreset.dispersionStrength,
        fastDamp
      );
      centerDiamondMat.uniforms.uBrilliance.value = THREE.MathUtils.lerp(
        centerDiamondMat.uniforms.uBrilliance.value,
        targetPreset.brillianceBoost,
        fastDamp
      );

      // Update Skin, Subsurface Sheen & Harmonized Manicure Color
      const toneDef = skinToneMap[currSkinTone];
      if (toneDef) {
        _targetSkinColor.setHex(toneDef.hex);
        _targetNailColor.setHex(toneDef.nailHex);
        _targetSheenColor.setHex(toneDef.sheenHex);
        skinMaterial.color.lerp(_targetSkinColor, dampFactor);
        skinMaterial.sheenColor.lerp(_targetSheenColor, dampFactor);
        nailMaterial.color.lerp(_targetNailColor, dampFactor);
      }

      // Studio lighting transition for Pure White vs Midnight Noir
      shadowMat.opacity = THREE.MathUtils.lerp(
        shadowMat.opacity,
        currScene === 'hand' ? (currentIsLight ? 0.16 : 0.45) : (currentIsLight ? 0.30 : 0.72),
        dampFactor
      );

      const isHand = currScene === 'hand';
      hemiLight.intensity = THREE.MathUtils.lerp(
        hemiLight.intensity,
        isHand ? (currentIsLight ? 0.58 : 0.48) : (currentIsLight ? 0.85 : 0.65),
        dampFactor
      );
      keyLight.intensity = THREE.MathUtils.lerp(
        keyLight.intensity,
        isHand ? (currentIsLight ? 2.35 : 2.05) : (currentIsLight ? 2.7 : 2.4),
        dampFactor
      );
      coolFill.intensity = THREE.MathUtils.lerp(
        coolFill.intensity,
        isHand ? 0.68 : 1.15,
        dampFactor
      );

      // Responsive camera framing for portrait mobile, landscape mobile, and desktop
      const aspect = Math.max(0.45, container.clientWidth / Math.max(1, container.clientHeight));
      const portraitPadding = aspect < 1 ? (1 / Math.max(aspect, 0.58) - 1) * 3.1 : 0;
      const shortLandscapePadding = container.clientHeight < 420 ? 0.45 : 0;
      const extraZ = portraitPadding + shortLandscapePadding;

      if (currScene === 'solitaire') {
        // SCENE 1: Heroic 3/4 rotating solitaire showcasing flat diamond crown + eagle-claw prongs + pavé
        const autoRot = rotate && !isDragging ? elapsedSec * 0.42 : 0;
        const gentleBob = Math.sin(elapsedSec * 1.1) * 0.04;
        ringGroup.position.lerp(_vPos.set(0, -0.32 + gentleBob, 0), dampFactor);
        ringGroup.rotation.y = THREE.MathUtils.lerp(ringGroup.rotation.y, -0.52 + autoRot + userRotY, dampFactor);
        ringGroup.rotation.x = THREE.MathUtils.lerp(ringGroup.rotation.x, 0.24 + userRotX, dampFactor);
        ringGroup.rotation.z = THREE.MathUtils.lerp(ringGroup.rotation.z, -0.06, dampFactor);
        ringGroup.scale.lerp(_vScale.set(0.86, 0.86, 0.86), dampFactor);

        boxGroup.scale.lerp(_vHiddenScale, fastDamp);
        boxGroup.position.lerp(_vHiddenBoxPos, fastDamp);
        handGroup.scale.lerp(_vHiddenScale, fastDamp);
        handGroup.position.lerp(_vHiddenHandPos, fastDamp);
        if (handGroup.scale.x < 0.01) handGroup.visible = false;

        shadowMesh.position.set(0, -1.98, 0);
        camera.position.lerp(_vCam.set(0, 0.25, 8.8 + extraZ), dampFactor);
        _desiredLook.set(0, 0.05, 0);
      } else if (currScene === 'box') {
        // SCENE 2: Haute-Joaillerie Velvet Ring Box Presentation
        boxGroup.scale.lerp(_vScale.set(0.84, 0.84, 0.84), dampFactor);
        boxGroup.position.lerp(_vPos.set(0, -0.96, 0), dampFactor);
        boxGroup.rotation.y = THREE.MathUtils.lerp(boxGroup.rotation.y, -0.22 + userRotY * 0.4, dampFactor);
        boxGroup.rotation.x = THREE.MathUtils.lerp(boxGroup.rotation.x, 0.08 + userRotX * 0.25, dampFactor);
        lidPivot.rotation.x = THREE.MathUtils.lerp(lidPivot.rotation.x, -1.72, dampFactor);

        // Seat ring snugly inside the twin velvet pillow bolster slit
        ringGroup.scale.lerp(_vScale.set(0.58, 0.58, 0.58), dampFactor);
        ringGroup.position.lerp(_vPos.set(0, -0.58, 0.04), dampFactor);
        ringGroup.rotation.set(0.18 + userRotX * 0.25, -0.22 + userRotY * 0.4, 0.03);

        handGroup.scale.lerp(_vHiddenScale, fastDamp);
        handGroup.position.lerp(_vHiddenHandPos, fastDamp);
        if (handGroup.scale.x < 0.01) handGroup.visible = false;
        shadowMesh.position.set(0, -1.94, 0);
        camera.position.lerp(_vCam.set(0, 0.58, 8.8 + extraZ), dampFactor);
        _desiredLook.set(0, -0.05, 0);
      } else if (currScene === 'split') {
        // SCENE 3: Close-up Macro Inspection (Shank Profile vs Crown & Hidden Halo)
        boxGroup.scale.lerp(_vHiddenScale, fastDamp);
        boxGroup.position.lerp(_vHiddenBoxPos, fastDamp);
        handGroup.scale.lerp(_vHiddenScale, fastDamp);
        handGroup.position.lerp(_vHiddenHandPos, fastDamp);
        if (handGroup.scale.x < 0.01) handGroup.visible = false;

        if (currSplit === 'shank') {
          ringGroup.scale.lerp(_vScale.set(0.92, 0.92, 0.92), dampFactor);
          ringGroup.position.lerp(_vPos.set(0, -0.35, 0), dampFactor);
          ringGroup.rotation.y = THREE.MathUtils.lerp(ringGroup.rotation.y, Math.PI / 2.6 + userRotY, dampFactor);
          ringGroup.rotation.x = THREE.MathUtils.lerp(ringGroup.rotation.x, 0.22 + userRotX, dampFactor);
          ringGroup.rotation.z = THREE.MathUtils.lerp(ringGroup.rotation.z, 0, dampFactor);
          camera.position.lerp(_vCam.set(0, 0.15, 7.6 + extraZ), dampFactor);
        } else {
          // Dramatic top-down macro angle showcasing flat octagonal cushion table, eagle-claw tips & shoulder pavé
          ringGroup.scale.lerp(_vScale.set(1.02, 1.02, 1.02), dampFactor);
          ringGroup.position.lerp(_vPos.set(0, -0.82, -0.65), dampFactor);
          ringGroup.rotation.y = THREE.MathUtils.lerp(ringGroup.rotation.y, 0.22 + userRotY, dampFactor);
          ringGroup.rotation.x = THREE.MathUtils.lerp(ringGroup.rotation.x, 1.18 + userRotX, dampFactor);
          ringGroup.rotation.z = THREE.MathUtils.lerp(ringGroup.rotation.z, 0, dampFactor);
          camera.position.lerp(_vCam.set(0, 0.35, 7.0 + extraZ), dampFactor);
        }

        shadowMesh.position.set(0, -2.05, 0);
        _desiredLook.set(0, 0.05, 0);
      } else if (currScene === 'hand') {
        // SCENE 4: Anatomically Seated Left-Hand Virtual Try-On
        boxGroup.scale.lerp(_vHiddenScale, fastDamp);
        boxGroup.position.lerp(_vHiddenBoxPos, fastDamp);

        handGroup.visible = true;

        // Subtle lifelike hand breathing & micro-shimmer when not dragging
        const gentleSwayY = rotate && !isDragging ? Math.sin(elapsedSec * 0.85) * 0.14 : 0;
        const gentleSwayX = rotate && !isDragging ? Math.cos(elapsedSec * 0.65) * 0.045 : 0;
        const clampedDragY = Math.max(-1.45, Math.min(1.45, userRotY));
        const clampedDragX = Math.max(-0.55, Math.min(0.65, userRotX));

        let baseRotX = -0.11;
        let baseRotY = 0.15;
        let baseRotZ = -0.15;
        let targetHandPosY = -0.16;

        if (currHandView === 'closeup') {
          baseRotX = -0.09;
          baseRotY = 0.10;
          baseRotZ = -0.08;
          targetHandPosY = -0.20;
        } else if (currHandView === 'profile') {
          // Rotate ulnar (pinky & ring finger) side forward so the cathedral arch, hidden halo & raised diamond stand in crisp unobstructed profile
          baseRotX = -0.05;
          baseRotY = 0.78;
          baseRotZ = -0.08;
          targetHandPosY = -0.18;
        }

        const handTargetScale = 1.04;
        handGroup.scale.lerp(_vScale.setScalar(handTargetScale), fastDamp);
        handGroup.position.lerp(_vPos.set(0.06, targetHandPosY, 0), fastDamp);
        handGroup.rotation.x = THREE.MathUtils.lerp(handGroup.rotation.x, baseRotX + gentleSwayX + clampedDragX * 0.6, dampFactor);
        handGroup.rotation.y = THREE.MathUtils.lerp(handGroup.rotation.y, baseRotY + gentleSwayY + clampedDragY * 0.85, dampFactor);
        handGroup.rotation.z = THREE.MathUtils.lerp(handGroup.rotation.z, baseRotZ, dampFactor);

        // Compute exact world transform of the coaxial ring seat on the Left Ring Finger
        handGroup.updateMatrixWorld(true);
        ringAnchor.getWorldPosition(_anchorPos);
        ringAnchor.getWorldQuaternion(_anchorQuat);
        const exactRingScale = ringFitScale * handGroup.scale.x;

        // Smoothly glide ring onto finger on stage entry, then lock rigidly so drag rotation has zero slip
        handSeatBlend = Math.min(1, handSeatBlend + dt * 4.5);
        if (handSeatBlend >= 0.96) {
          ringGroup.position.copy(_anchorPos);
          ringGroup.quaternion.copy(_anchorQuat);
          ringGroup.scale.setScalar(exactRingScale);
        } else {
          ringGroup.position.lerp(_anchorPos, fastDamp);
          ringGroup.quaternion.slerp(_anchorQuat, fastDamp);
          ringGroup.scale.lerp(_vScale.setScalar(exactRingScale), fastDamp);
        }

        shadowMesh.position.set(0, -3.35, 0);

        // Camera framing per hand view preset (always keeping the ring finger diamond razor-sharp & centered)
        if (currHandView === 'closeup') {
          camera.position.lerp(
            _vCam.set(_anchorPos.x * 0.55, _anchorPos.y + 0.36, 4.35 + extraZ * 0.65),
            dampFactor
          );
          _desiredLook.set(_anchorPos.x * 0.6, _anchorPos.y + 0.26, _anchorPos.z + 0.10);
        } else if (currHandView === 'profile') {
          camera.position.lerp(
            _vCam.set(_anchorPos.x - 0.08, _anchorPos.y + 0.16, 4.10 + extraZ * 0.68),
            dampFactor
          );
          _desiredLook.set(_anchorPos.x + 0.08, _anchorPos.y + 0.05, _anchorPos.z + 0.10);
        } else {
          camera.position.lerp(
            _vCam.set(0.0, 0.24, 6.75 + extraZ * 0.9),
            dampFactor
          );
          _desiredLook.set(-0.04, 0.22, 0.05);
        }
      }

      _lookTarget.lerp(_desiredLook, dampFactor);
      camera.lookAt(_lookTarget);
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // RESIZE LISTENER & OBSERVER
    const handleResize = () => {
      if (!container || container.clientWidth === 0 || container.clientHeight === 0 || isDisposed) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(handleResize)
      : null;
    resizeObserver?.observe(container);

    // CLEANUP
    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      canvasEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      renderer.dispose();
      studioEnv.dispose();
      goldPolishTex.dispose();
      skinTex.bumpMap.dispose();
      skinTex.roughnessMap.dispose();
      nailAlbedoTex.dispose();

      ringGeometries.forEach((g) => g.dispose());
      velvetBoxRig.geometries.forEach((g) => g.dispose());
      velvetBoxRig.materials.forEach((m) => m.dispose());
      velvetBoxRig.textures.forEach((t) => t.dispose());
      handGeometries.forEach((g) => g.dispose());
      shadowGeo.dispose();

      goldMaterial.dispose();
      galleryGoldMaterial.dispose();
      centerDiamondMat.dispose();
      meleeDiamondMat.dispose();
      skinMaterial.dispose();
      nailMaterial.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="3d-experience"
      className={`${
        isFullscreen
          ? 'fixed inset-0 z-50 h-dvh w-screen overflow-hidden flex flex-col'
          : 'relative w-full h-[580px] sm:h-[680px] lg:h-[780px] overflow-hidden border-b flex flex-col'
      } transition-colors duration-500 ${
        isLight ? 'bg-white text-[#1f1a16] border-stone-200' : 'bg-[#151210] text-[#f2efe9] border-stone-800'
      }`}
    >
      {/* Giant Stage Watermark Numeral Inspired by Celestique */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className={`text-[160px] sm:text-[320px] lg:text-[440px] font-editorial font-bold tracking-tighter transition-all duration-700 select-none ${
          isLight ? 'text-stone-900/[0.045]' : 'text-white/[0.04]'
        }`}>
          {activeScene === 'solitaire' ? '01' : activeScene === 'box' ? '02' : activeScene === 'split' ? '03' : '04'}
        </span>
      </div>

      {/* Top Floating Stage Controls & Fullscreen Button: Flex-row outside center ring safe zone */}
      <div className="relative z-20 px-3 pt-3 sm:px-8 sm:pt-5 pointer-events-none flex items-start justify-between gap-2 shrink-0">
        
        {/* Left Minimal Badge per Stage */}
        <div className="pointer-events-auto min-w-0 max-w-[240px] sm:max-w-sm space-y-1">
          {activeScene === 'solitaire' && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase">
                <span className={isLight ? 'text-[#1f1a16] font-bold truncate' : 'text-amber-400 font-bold truncate'}>✦ 01 · Celestial Atelier</span>
              </div>
              <h2 className={`text-base sm:text-xl font-editorial font-bold leading-tight ${isLight ? 'text-[#1f1a16]' : 'text-white'}`}>
                Royal Crown Cushion
              </h2>
              <p className={`text-[10px] sm:text-[11px] hidden sm:block ${isLight ? 'text-[#5b544b]' : 'text-stone-400'}`}>
                Hand-forged 18K solid gold · 4-claw compass setting · VVS1 D-Color.
              </p>
              <div className="pt-0.5 sm:pt-1 flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => onAddToInquiry(selectedPurity, selectedMetal, selectedCarat)}
                  className={`px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-sm ${
                    isLight ? 'bg-[#1f1a16] text-white hover:bg-black' : 'bg-white text-stone-950 hover:bg-stone-200'
                  }`}
                >
                  Inquire ➔
                </button>
                <button
                  onClick={onRequestCad}
                  className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 border text-[10px] sm:text-[11px] uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
                    isLight ? 'border-stone-300 text-[#1f1a16] hover:bg-[#1f1a16] hover:text-white bg-white' : 'border-stone-700 text-stone-300 hover:border-white bg-stone-900/90'
                  }`}
                >
                  Custom CAD
                </button>
                <a
                  href={buildWhatsAppUrl(`Hello One Soul Jewellery Mumbai Atelier, I am customizing the 3D Royal Crown Cushion (${selectedCarat.toFixed(1)} CT ${selectedPurity} ${selectedMetal}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp (+91 91366 89009)"
                  className={`px-2.5 py-1 sm:py-1.5 border text-[10px] sm:text-[11px] uppercase tracking-wider rounded-full transition-colors inline-flex items-center gap-1 ${
                    isLight ? 'border-emerald-800/30 bg-emerald-950/10 text-emerald-950 hover:bg-emerald-950 hover:text-white' : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-500 hover:text-stone-950'
                  }`}
                  title="Chat on WhatsApp (+91 91366 89009)"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {activeScene === 'box' && (
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-[10px] font-mono tracking-widest uppercase text-amber-700 font-bold">
                02 · Atelier Vault
              </div>
              <h2 className={`text-base sm:text-xl font-editorial font-bold ${isLight ? 'text-stone-950' : 'text-white'}`}>
                Heirloom Velvet Box
              </h2>
              <p className={`text-[10px] sm:text-[11px] hidden sm:block ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                Encased in burgundy velvet with GRA card & 10x jeweler loupe.
              </p>
            </div>
          )}

          {activeScene === 'split' && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono tracking-widest uppercase text-amber-700 font-bold">
                03 · Anatomical Specs
              </div>
              <div className={`inline-flex gap-1 p-0.5 border shadow-xs ${isLight ? 'bg-white/95 border-stone-200' : 'bg-stone-900 border-stone-700'}`}>
                <button
                  onClick={() => setActiveSplitTab('shank')}
                  className={`px-2 sm:px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    activeSplitTab === 'shank' ? (isLight ? 'bg-stone-950 text-white font-bold' : 'bg-white text-stone-950 font-bold') : 'text-stone-600'
                  }`}
                >
                  Shank Profile
                </button>
                <button
                  onClick={() => setActiveSplitTab('eternity')}
                  className={`px-2 sm:px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    activeSplitTab === 'eternity' ? (isLight ? 'bg-stone-950 text-white font-bold' : 'bg-white text-stone-950 font-bold') : 'text-stone-600'
                  }`}
                >
                  Crown & Halo
                </button>
              </div>
            </div>
          )}

          {activeScene === 'hand' && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono tracking-widest uppercase text-amber-700 font-bold">
                04 · Virtual Hand Try-On
              </div>
              <h3 className={`text-base sm:text-xl font-editorial font-bold leading-tight ${isLight ? 'text-stone-950' : 'text-white'}`}>
                Left Ring Finger
              </h3>

              {/* Hand Angle Presets */}
              <div className={`inline-flex gap-0.5 p-0.5 border rounded-lg shadow-xs ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-700'
              }`}>
                {(
                  [
                    { id: 'full', label: 'Full Hand' },
                    { id: 'closeup', label: 'Close-Up' },
                    { id: 'profile', label: 'Side Profile' },
                  ] as { id: HandViewMode; label: string }[]
                ).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setHandViewMode(preset.id)}
                    className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      handViewMode === preset.id
                        ? isLight ? 'bg-[#1f1a16] text-white font-bold' : 'bg-white text-stone-950 font-bold'
                        : isLight ? 'text-stone-600 hover:text-[#1f1a16]' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Skin Tone Swatches */}
              <div className="flex flex-wrap items-center gap-1">
                {(Object.keys(skinToneMap) as SkinToneId[]).map((toneId) => (
                  <button
                    key={toneId}
                    type="button"
                    onClick={() => setSelectedSkinTone(toneId)}
                    className={`flex items-center gap-1 px-2 py-0.5 text-[10px] border rounded-full transition-all cursor-pointer ${
                      selectedSkinTone === toneId
                        ? isLight ? 'border-[#1f1a16] bg-[#1f1a16] text-white font-bold' : 'border-white bg-stone-800 text-white font-bold'
                        : isLight ? 'border-stone-200 bg-white text-stone-700 hover:border-stone-400' : 'border-stone-800 bg-stone-900 text-stone-400'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full border border-black/15 ${skinToneMap[toneId].bgClass}`} />
                    <span>{skinToneMap[toneId].name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Live Carat Finger-Coverage Selector */}
              <div className="flex flex-wrap items-center gap-1">
                {[1.5, 2.5, 3.0, 4.0].map((ct) => (
                  <button
                    key={ct}
                    type="button"
                    onClick={() => setSelectedCarat(ct)}
                    className={`px-1.5 py-0.5 text-[10px] font-mono border rounded-md transition-all cursor-pointer ${
                      selectedCarat === ct
                        ? isLight ? 'border-[#1f1a16] bg-[#1f1a16] text-white font-bold' : 'border-amber-400 bg-amber-400 text-stone-950 font-bold'
                        : isLight ? 'border-stone-200 bg-white text-stone-600 hover:border-stone-400' : 'border-stone-800 bg-stone-900 text-stone-400'
                    }`}
                  >
                    {ct.toFixed(1)} CT
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Controls: 360 Hint + Mobile-safe Fullscreen Toggle */}
        <div className="pointer-events-auto flex items-center gap-2 shrink-0">
          <div className="hidden sm:block text-right font-mono text-[10px] pointer-events-none mr-1">
            <span className={`block uppercase tracking-widest ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>360° Light Studio</span>
            <span className={`font-bold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>Interactive Drag</span>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit Fullscreen Studio' : 'View 3D Studio Fullscreen'}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D View'}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
              isLight
                ? 'bg-white border-stone-300 text-[#1f1a16] hover:bg-[#1f1a16] hover:text-white'
                : 'bg-stone-900/90 border-stone-700 text-stone-100 hover:bg-white hover:text-stone-950'
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3D Canvas Container: flex-1 min-h-0 ensures it fits cleanly between top controls and bottom dock in both normal & mobile fullscreen */}
      <div
        ref={mountRef}
        data-testid="three-canvas-stage"
        className={`flex-1 w-full cursor-grab active:cursor-grabbing relative select-none z-10 ${
          isFullscreen ? 'min-h-0 touch-none' : 'min-h-[180px] touch-pan-y'
        }`}
      />

      {/* BOTTOM CONTROLS & CUSTOMIZER DOCK */}
      <div className={`relative z-30 mx-2.5 mb-2.5 sm:mx-8 sm:mb-5 shrink-0 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-4 border rounded-2xl shadow-lg transition-colors max-w-full ${
        isLight
          ? 'bg-white border-stone-200 text-[#1f1a16]'
          : 'bg-[#181512] border-[#2c2621] text-[#f2efe9]'
      }`}>
        
        {/* Stepper Navigation: Prev < | Stages 01..04 | Next > */}
        <div className="flex items-center gap-1 overflow-x-auto min-w-0 w-full md:w-auto pb-1 md:pb-0 text-[11px] sm:text-xs">
          <button
            onClick={handlePrevScene}
            className={`p-1.5 border rounded-lg transition-colors cursor-pointer shrink-0 ${
              isLight
                ? 'border-stone-200 bg-stone-50 text-[#1f1a16] hover:bg-stone-100'
                : 'border-stone-800 bg-stone-950 text-stone-400 hover:bg-stone-800 hover:text-white'
            }`}
            title="Previous Stage"
            aria-label="Previous Stage"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => setActiveScene('solitaire')}
            className={`px-2 sm:px-3 py-1.5 font-medium whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 cursor-pointer rounded-lg ${
              activeScene === 'solitaire'
                ? isLight ? 'bg-[#1f1a16] text-white font-bold shadow-xs' : 'bg-white text-stone-950 font-bold'
                : isLight ? 'text-stone-600 hover:text-[#1f1a16] hover:bg-stone-100' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>01. Solitaire</span>
          </button>

          <button
            onClick={() => setActiveScene('box')}
            className={`px-2 sm:px-3 py-1.5 font-medium whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 cursor-pointer rounded-lg ${
              activeScene === 'box'
                ? isLight ? 'bg-[#1f1a16] text-white font-bold shadow-xs' : 'bg-white text-stone-950 font-bold'
                : isLight ? 'text-stone-600 hover:text-[#1f1a16] hover:bg-stone-100' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Box className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>02. Velvet Box</span>
          </button>

          <button
            onClick={() => setActiveScene('split')}
            className={`px-2 sm:px-3 py-1.5 font-medium whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 cursor-pointer rounded-lg ${
              activeScene === 'split'
                ? isLight ? 'bg-[#1f1a16] text-white font-bold shadow-xs' : 'bg-white text-stone-950 font-bold'
                : isLight ? 'text-stone-600 hover:text-[#1f1a16] hover:bg-stone-100' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>03. Shank & Halo</span>
          </button>

          <button
            onClick={() => setActiveScene('hand')}
            className={`px-2 sm:px-3 py-1.5 font-medium whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 cursor-pointer rounded-lg ${
              activeScene === 'hand'
                ? isLight ? 'bg-[#1f1a16] text-white font-bold shadow-xs' : 'bg-white text-stone-950 font-bold'
                : isLight ? 'text-stone-600 hover:text-[#1f1a16] hover:bg-stone-100' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Hand className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>04. On Hand</span>
          </button>

          <button
            onClick={handleNextScene}
            className={`p-1.5 border rounded-lg transition-colors cursor-pointer shrink-0 ${
              isLight
                ? 'border-stone-200 bg-stone-50 text-[#1f1a16] hover:bg-stone-100'
                : 'border-stone-800 bg-stone-950 text-stone-400 hover:bg-stone-800 hover:text-white'
            }`}
            title="Next Stage"
            aria-label="Next Stage"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Live 3D Configurator Tools: Metal, Gem, Price */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end text-xs min-w-0">
          {/* Metal Changer */}
          <div className={`flex items-center gap-0.5 sm:gap-1 p-1 border rounded-lg ${
            isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-950 border-stone-800'
          }`}>
            {(['Yellow Gold', 'White Gold', 'Rose Gold'] as GoldTone[]).map((metal) => (
              <button
                key={metal}
                onClick={() => setSelectedMetal(metal)}
                className={`px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  selectedMetal === metal
                    ? isLight ? 'bg-[#1f1a16] text-white font-bold shadow-xs' : 'bg-stone-800 text-white'
                    : isLight ? 'text-stone-600 hover:text-[#1f1a16]' : 'text-stone-500 hover:text-stone-300'
                }`}
                title={metal}
              >
                {metal.replace(' Gold', '')}
              </button>
            ))}
          </div>

          {/* Gem Color Tone */}
          <div className={`flex items-center gap-1 p-1 border rounded-lg ${
            isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-950 border-stone-800'
          }`}>
            <button
              onClick={() => setSelectedGemTone('d-color-icy')}
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-100 border transition-all cursor-pointer ${
                selectedGemTone === 'd-color-icy'
                  ? 'border-sky-500 scale-110 shadow-xs ring-1 ring-sky-400'
                  : 'border-stone-300 opacity-70'
              }`}
              title="D-Color Icy White Moissanite"
              aria-label="D-Color Icy White Moissanite"
            />
            <button
              onClick={() => setSelectedGemTone('vivid-pink')}
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-rose-400 border transition-all cursor-pointer ${
                selectedGemTone === 'vivid-pink'
                  ? isLight ? 'border-[#1f1a16] scale-110 shadow-xs ring-1 ring-[#1f1a16]' : 'border-white scale-110'
                  : 'border-transparent opacity-65'
              }`}
              title="Vivid Pink Fancy Moissanite"
              aria-label="Vivid Pink Fancy Moissanite"
            />
            <button
              onClick={() => setSelectedGemTone('champagne')}
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-300 border transition-all cursor-pointer ${
                selectedGemTone === 'champagne'
                  ? isLight ? 'border-[#1f1a16] scale-110 shadow-xs ring-1 ring-[#1f1a16]' : 'border-white scale-110'
                  : 'border-transparent opacity-65'
              }`}
              title="Champagne Golden Moissanite"
              aria-label="Champagne Golden Moissanite"
            />
          </div>

          {/* Transparent Live Price Display */}
          <div className={`font-mono text-right sm:pl-2 sm:border-l ${
            isLight ? 'border-stone-200' : 'border-stone-800'
          }`}>
            <div className={`text-[9px] sm:text-[10px] uppercase hidden sm:block ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
              Atelier Formula
            </div>
            <div className={`font-bold text-xs sm:text-sm ${isLight ? 'text-[#1f1a16]' : 'text-white'}`}>
              {formatCurrency(livePricing.totalPriceInr, currency)}
            </div>
          </div>

          {/* Auto-Rotation Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${
              isRotating
                ? isLight ? 'bg-[#1f1a16] border-[#1f1a16] text-white' : 'bg-stone-800 border-stone-700 text-white'
                : isLight ? 'border-stone-200 bg-stone-50 text-stone-600' : 'border-stone-800 text-stone-500'
            }`}
            title="Toggle 360° Auto-Rotation"
            aria-label="Toggle 360° Auto-Rotation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Studio Ambiance Theme Toggle */}
          {onToggleThemeMode && (
            <div className={`hidden md:flex items-center gap-1 pl-2 border-l ${
              isLight ? 'border-stone-200' : 'border-stone-800'
            }`} title="Toggle studio lighting ambiance">
              <Sun className={`w-3 h-3 ${isLight ? 'text-[#b3844d]' : 'text-stone-500'}`} />
              <SquishSwitch
                checked={!isLight}
                onChange={(isDark) => {
                  if ((isDark && isLight) || (!isDark && !isLight)) {
                    onToggleThemeMode();
                  }
                }}
                ariaLabel="Toggle studio lighting ambiance"
                width={38}
                height={20}
                radius={10}
                speed={60}
                stretch={36}
                trackColor="#e5e5e4"
                trackOnColor="#1f1a16"
                thumbColor="#1f1a16"
                thumbOnColor="#c59d5f"
              />
              <Moon className={`w-3 h-3 ${!isLight ? 'text-amber-400' : 'text-stone-500'}`} />
            </div>
          )}
        </div>

      </div>

    </section>
  );
};
