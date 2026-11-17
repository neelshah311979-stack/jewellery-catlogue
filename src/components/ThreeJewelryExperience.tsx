import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Eye, Box, Hand, RotateCcw, ChevronRight, ChevronLeft, Check, ShieldCheck, Sun, Moon } from 'lucide-react';
import SquishSwitch from './SquishSwitch';
import { GoldPurity, GoldTone, Currency } from '../types/jewelry';
import { calculateItemPrice, formatCurrency } from '../utils/pricing';

export type SceneMode = 'solitaire' | 'box' | 'split' | 'hand';

export type SkinToneId = 'fair' | 'warm' | 'honey' | 'bronze';

export const skinToneMap: Record<SkinToneId, { name: string; hex: number; bgClass: string }> = {
  fair: { name: 'Fair Ivory', hex: 0xf3cfba, bgClass: 'bg-[#f3cfba]' },
  warm: { name: 'Warm Beige', hex: 0xdca68b, bgClass: 'bg-[#dca68b]' },
  honey: { name: 'Rich Honey', hex: 0x9b5a38, bgClass: 'bg-[#9b5a38]' },
  bronze: { name: 'Deep Bronze', hex: 0x5a2d1d, bgClass: 'bg-[#5a2d1d]' },
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
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState<SceneMode>('solitaire');
  const [selectedMetal, setSelectedMetal] = useState<GoldTone>('Yellow Gold');
  const [selectedPurity, setSelectedPurity] = useState<GoldPurity>('18K');
  const [selectedGemTone, setSelectedGemTone] = useState<'vivid-pink' | 'd-color-icy' | 'champagne'>('vivid-pink');
  const [selectedSkinTone, setSelectedSkinTone] = useState<SkinToneId>('warm');
  const [selectedCarat, setSelectedCarat] = useState<number>(3.0);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [activeSplitTab, setActiveSplitTab] = useState<'shank' | 'eternity'>('shank');

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
    selectedGemTone: 'vivid-pink' as 'vivid-pink' | 'd-color-icy' | 'champagne',
    selectedSkinTone: 'warm' as SkinToneId,
    isRotating: true,
    activeSplitTab: 'shank' as 'shank' | 'eternity',
    isLight: true,
  });

  useEffect(() => {
    stateRef.current = {
      activeScene,
      selectedMetal,
      selectedGemTone,
      selectedSkinTone,
      isRotating,
      activeSplitTab,
      isLight,
    };
  }, [activeScene, selectedMetal, selectedGemTone, selectedSkinTone, isRotating, activeSplitTab, isLight]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isLight ? 0xcfc8bc : 0x151210);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // LUXURY JEWELRY STUDIO ENVIRONMENT MAP
    // Generates a 360° high-fidelity studio reflection map so 18K gold and Moissanite facets reflect gleaming softbox radiance instead of black void
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ctx = envCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#ffffff'); // bright top studio softbox
      grad.addColorStop(0.3, '#fafaf9');
      grad.addColorStop(0.5, '#f5f5f4');
      grad.addColorStop(0.7, '#fffbeb'); // warm gold bounce
      grad.addColorStop(1, '#ffffff');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Studio softbox specular reflection panels
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(40, 20, 100, 120);
      ctx.fillRect(360, 20, 100, 120);
      ctx.fillRect(200, 10, 110, 80);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.4)'; // warm gold tone bounce
      ctx.fillRect(0, 190, 512, 40);
    }
    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    const envRenderTarget = pmremGenerator.fromEquirectangular(envTexture);
    scene.environment = envRenderTarget.texture;

    // ROOT HIERARCHY
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. RING GROUP
    const ringGroup = new THREE.Group();
    rootGroup.add(ringGroup);

    // Materials dictionary
    const metalColors = {
      'Yellow Gold': new THREE.Color(0xf59e0b),
      'White Gold': new THREE.Color(0xf1f5f9),
      'Rose Gold': new THREE.Color(0xfb7185),
    };

    const metalEmissives = {
      'Yellow Gold': new THREE.Color(0x92400e),
      'White Gold': new THREE.Color(0x475569),
      'Rose Gold': new THREE.Color(0x9d174d),
    };

    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: metalColors['Yellow Gold'],
      emissive: metalEmissives['Yellow Gold'],
      emissiveIntensity: 0.28,
      metalness: 0.65,
      roughness: 0.20,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      envMapIntensity: 2.2,
    });

    // Ring Shank (Torus Geometry)
    const shankGeo = new THREE.TorusGeometry(1.6, 0.15, 24, 64);
    const shankMesh = new THREE.Mesh(shankGeo, goldMaterial);
    shankMesh.castShadow = true;
    shankMesh.receiveShadow = true;
    ringGroup.add(shankMesh);

    // Inner Ring Glow Light - radiates warm golden brilliance from inside the band so it never turns black
    const ringInnerLight = new THREE.PointLight(0xfef08a, 2.8, 6);
    ringInnerLight.position.set(0, 0, 0);
    ringGroup.add(ringInnerLight);

    // Prongs (4 delicate claws)
    const prongGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.85, 16);
    const prongs: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const prong = new THREE.Mesh(prongGeo, goldMaterial);
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      prong.position.set(Math.cos(angle) * 0.42, 1.6 + 0.38, Math.sin(angle) * 0.42);
      prong.rotation.z = (Math.cos(angle) * -Math.PI) / 16;
      prong.rotation.x = (Math.sin(angle) * Math.PI) / 16;
      ringGroup.add(prong);
      prongs.push(prong);
    }

    // Pavé Accent Micro Stones along shoulders
    const paveStones: THREE.Mesh[] = [];
    const paveGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const paveMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.1,
    });
    for (let i = -6; i <= 6; i++) {
      if (Math.abs(i) < 2) continue;
      const angle = Math.PI / 2 + (i * 0.09);
      const px = Math.cos(angle) * 1.6;
      const py = Math.sin(angle) * 1.6;
      const stone1 = new THREE.Mesh(paveGeo, paveMat);
      stone1.position.set(px, py, 0.12);
      const stone2 = new THREE.Mesh(paveGeo, paveMat);
      stone2.position.set(px, py, -0.12);
      ringGroup.add(stone1, stone2);
      paveStones.push(stone1, stone2);
    }

    // Center Gemstone
    const gemGeo = new THREE.OctahedronGeometry(0.72, 2);
    // Scale to cushion / brilliant cut proportions
    gemGeo.scale(1.0, 1.25, 0.88);

    const gemMaterials = {
      'vivid-pink': new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xf43f5e),
        emissive: new THREE.Color(0xec4899),
        emissiveIntensity: 0.38,
        roughness: 0.04,
        transmission: 0.92,
        thickness: 1.4,
        ior: 2.65, // Moissanite exact index
        specularIntensity: 1.0,
        specularColor: new THREE.Color(0xffffff),
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
      }),
      'd-color-icy': new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xf8fafc),
        emissive: new THREE.Color(0x38bdf8),
        emissiveIntensity: 0.22,
        roughness: 0.02,
        transmission: 0.96,
        thickness: 1.5,
        ior: 2.68,
        specularIntensity: 1.0,
        specularColor: new THREE.Color(0xffffff),
        clearcoat: 1.0,
      }),
      'champagne': new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xfbbf24),
        emissive: new THREE.Color(0xd97706),
        emissiveIntensity: 0.25,
        roughness: 0.04,
        transmission: 0.90,
        thickness: 1.4,
        ior: 2.65,
        specularIntensity: 1.0,
        clearcoat: 1.0,
      }),
    };

    const gemMesh = new THREE.Mesh(gemGeo, gemMaterials['vivid-pink']);
    gemMesh.position.set(0, 1.6 + 0.45, 0);
    gemMesh.castShadow = true;
    ringGroup.add(gemMesh);

    // Inner Gem Point Light (Gives the signature brilliant fire dispersion)
    const gemLight = new THREE.PointLight(0xff3366, 2.5, 4);
    gemLight.position.set(0, 1.6 + 0.45, 0);
    ringGroup.add(gemLight);

    // 2. VELVET RING BOX GROUP (SCENE 2)
    const boxGroup = new THREE.Group();
    rootGroup.add(boxGroup);
    boxGroup.position.set(1.5, -0.6, 0);
    boxGroup.scale.set(0.001, 0.001, 0.001); // starts hidden

    // Velvet Material
    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0x581c2d, // Deep Burgundy / Crimson
      roughness: 0.92,
      metalness: 0.02,
    });
    const goldRimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.95,
    });
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbf7, // Satin Cream
      roughness: 0.6,
      metalness: 0.05,
    });

    // Box Lower Body
    const lowerBoxGeo = new THREE.CylinderGeometry(1.4, 1.35, 1.2, 32);
    const lowerBoxMesh = new THREE.Mesh(lowerBoxGeo, velvetMat);
    lowerBoxMesh.position.y = -0.6;
    lowerBoxMesh.castShadow = true;
    boxGroup.add(lowerBoxMesh);

    // Lower Gold Lip
    const rimGeo = new THREE.TorusGeometry(1.4, 0.04, 16, 32);
    const rimMesh = new THREE.Mesh(rimGeo, goldRimMat);
    rimMesh.rotation.x = Math.PI / 2;
    boxGroup.add(rimMesh);

    // Inner Cushion Pillow
    const cushionGeo = new THREE.CylinderGeometry(1.3, 1.25, 0.6, 32);
    const cushionMesh = new THREE.Mesh(cushionGeo, cushionMat);
    cushionMesh.position.y = -0.15;
    boxGroup.add(cushionMesh);

    // Upper Box Lid (Hinged at back)
    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, 0, -1.35); // back hinge position
    boxGroup.add(lidPivot);

    const lidMesh = new THREE.Mesh(lowerBoxGeo, velvetMat);
    lidMesh.position.set(0, 0.6, 1.35); // relative to pivot
    lidMesh.rotation.x = Math.PI; // upside down lid
    lidMesh.castShadow = true;
    lidPivot.add(lidMesh);

    // Lid inner satin lining
    const lidLining = new THREE.Mesh(cushionGeo, cushionMat);
    lidLining.position.set(0, 0.1, 1.35);
    lidLining.scale.set(0.95, 0.3, 0.95);
    lidPivot.add(lidLining);

    // 3. ANATOMICALLY REALISTIC HUMAN HAND TRY-ON GROUP (SCENE 4)
    const handGroup = new THREE.Group();
    rootGroup.add(handGroup);
    handGroup.position.set(0, -6, 0); // starts lowered down
    handGroup.scale.set(0.001, 0.001, 0.001);

    const handGeometries: THREE.BufferGeometry[] = [];
    const registerHandGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
      handGeometries.push(geo);
      return geo;
    };

    const skinMaterial = new THREE.MeshStandardMaterial({
      color: skinToneMap[stateRef.current.selectedSkinTone].hex,
      roughness: 0.58,
      metalness: 0.02,
    });
    const nailMaterial = new THREE.MeshStandardMaterial({
      color: 0xf6dbd8, // soft French manicured almond shine
      roughness: 0.12,
      metalness: 0.04,
    });


    // --- FOREARM & WRIST ---
    // Lower forearm cylinder with natural human cross-section tapering towards wrist
    const wristGeo = registerHandGeo(new THREE.CylinderGeometry(0.55, 0.64, 1.8, 32));
    const wristMesh = new THREE.Mesh(wristGeo, skinMaterial);
    wristMesh.position.set(0.01, -2.0, -0.05);
    wristMesh.scale.set(1.15, 1.0, 0.55);
    wristMesh.castShadow = true;
    wristMesh.receiveShadow = true;
    handGroup.add(wristMesh);

    // Carpal transition into wrist base
    const carpalGeo = registerHandGeo(new THREE.CylinderGeometry(0.60, 0.55, 0.45, 32));
    const carpalMesh = new THREE.Mesh(carpalGeo, skinMaterial);
    carpalMesh.position.set(0.01, -1.30, -0.04);
    carpalMesh.scale.set(1.16, 1.0, 0.54);
    carpalMesh.castShadow = true;
    carpalMesh.receiveShadow = true;
    handGroup.add(carpalMesh);

    // Ulnar styloid process (bony wrist bump on pinky edge)
    const ulnarGeo = registerHandGeo(new THREE.SphereGeometry(0.12, 16, 16));
    const ulnarMesh = new THREE.Mesh(ulnarGeo, skinMaterial);
    ulnarMesh.position.set(0.68, -1.35, 0.02);
    ulnarMesh.scale.set(0.8, 1.2, 0.9);
    handGroup.add(ulnarMesh);

    // Radial styloid prominence (thumb side wrist ridge)
    const radialGeo = registerHandGeo(new THREE.SphereGeometry(0.11, 16, 16));
    const radialMesh = new THREE.Mesh(radialGeo, skinMaterial);
    radialMesh.position.set(-0.66, -1.38, 0.0);
    radialMesh.scale.set(0.8, 1.2, 0.85);
    handGroup.add(radialMesh);

    // --- PALM & DORSAL CONTOURS ---
    // Smooth anatomical palm body tapering from knuckles down to carpus
    const palmGeo = registerHandGeo(new THREE.CylinderGeometry(0.76, 0.56, 1.45, 32));
    const palmMesh = new THREE.Mesh(palmGeo, skinMaterial);
    palmMesh.position.set(0.01, -0.78, -0.04);
    palmMesh.scale.set(1.15, 1.0, 0.52);
    palmMesh.castShadow = true;
    palmMesh.receiveShadow = true;
    handGroup.add(palmMesh);

    // Dorsal anatomical arch (smooth rounded blend)
    const dorsalGeo = registerHandGeo(new THREE.CylinderGeometry(0.72, 0.52, 1.35, 32));
    const dorsalMesh = new THREE.Mesh(dorsalGeo, skinMaterial);
    dorsalMesh.position.set(0.01, -0.74, -0.06);
    dorsalMesh.scale.set(1.05, 1.0, 0.48);
    handGroup.add(dorsalMesh);

    // Thenar Eminence (fleshy muscular ball at thumb base)
    const thenarGeo = registerHandGeo(new THREE.SphereGeometry(0.36, 24, 24));
    const thenarMesh = new THREE.Mesh(thenarGeo, skinMaterial);
    thenarMesh.position.set(-0.52, -0.78, 0.10);
    thenarMesh.scale.set(0.88, 1.25, 0.65);
    thenarMesh.rotation.set(0.15, 0.2, 0.38);
    thenarMesh.castShadow = true;
    handGroup.add(thenarMesh);

    // Hypothenar Eminence (muscular cushion on pinky side of palm)
    const hypothenarGeo = registerHandGeo(new THREE.SphereGeometry(0.28, 20, 20));
    const hypothenarMesh = new THREE.Mesh(hypothenarGeo, skinMaterial);
    hypothenarMesh.position.set(0.52, -0.88, 0.06);
    hypothenarMesh.scale.set(0.70, 1.25, 0.55);
    hypothenarMesh.rotation.set(0.1, -0.15, -0.20);
    hypothenarMesh.castShadow = true;
    handGroup.add(hypothenarMesh);

    // MCP Knuckle Mounds across the palm arch
    const createKnuckleMound = (x: number, y: number, z: number, radius: number) => {
      const kGeo = registerHandGeo(new THREE.SphereGeometry(radius, 16, 16));
      const kMesh = new THREE.Mesh(kGeo, skinMaterial);
      kMesh.position.set(x, y, z);
      kMesh.scale.set(1.05, 0.9, 1.05);
      kMesh.castShadow = true;
      handGroup.add(kMesh);
    };

    createKnuckleMound(-0.52, -0.06, 0.03, 0.17); // Index MCP
    createKnuckleMound(-0.17, 0.04, 0.04, 0.185); // Middle MCP (apex)
    createKnuckleMound(0.18, 0.01, 0.035, 0.17);  // Ring MCP
    createKnuckleMound(0.51, -0.15, -0.01, 0.14); // Pinky MCP

    // --- DIGIT 1: ARTICULATED THUMB ---
    const createThumb = () => {
      const thumb = new THREE.Group();
      thumb.position.set(-0.58, -0.62, 0.06);
      thumb.rotation.set(0.18, 0.16, 0.44); // Relaxed natural abduction

      // Metacarpal shaft
      const mcGeo = registerHandGeo(new THREE.CylinderGeometry(0.19, 0.22, 0.55, 20));
      const mcMesh = new THREE.Mesh(mcGeo, skinMaterial);
      mcMesh.position.set(0, 0.28, 0);
      mcMesh.castShadow = true;
      thumb.add(mcMesh);

      // Thumb MCP Joint
      const mcpGeo = registerHandGeo(new THREE.SphereGeometry(0.20, 16, 16));
      const mcpMesh = new THREE.Mesh(mcpGeo, skinMaterial);
      mcpMesh.position.set(0, 0.56, 0);
      mcpMesh.scale.set(1.05, 0.95, 1.0);
      thumb.add(mcpMesh);

      // Proximal Phalanx
      const p1Geo = registerHandGeo(new THREE.CylinderGeometry(0.18, 0.20, 0.60, 20));
      const p1Mesh = new THREE.Mesh(p1Geo, skinMaterial);
      p1Mesh.position.set(0, 0.56 + 0.30, 0);
      p1Mesh.castShadow = true;
      thumb.add(p1Mesh);

      // Interphalangeal (IP) Joint
      const ipGeo = registerHandGeo(new THREE.SphereGeometry(0.19, 16, 16));
      const ipMesh = new THREE.Mesh(ipGeo, skinMaterial);
      ipMesh.position.set(0, 0.56 + 0.60, 0);
      thumb.add(ipMesh);

      // Distal Phalanx with gentle natural flex
      const p2Group = new THREE.Group();
      p2Group.position.set(0, 0.56 + 0.60, 0);
      p2Group.rotation.x = -0.10;
      thumb.add(p2Group);

      const p2Geo = registerHandGeo(new THREE.CylinderGeometry(0.15, 0.18, 0.50, 20));
      const p2Mesh = new THREE.Mesh(p2Geo, skinMaterial);
      p2Mesh.position.set(0, 0.25, 0);
      p2Mesh.castShadow = true;
      p2Group.add(p2Mesh);

      // Fleshy thumb tip pad
      const padGeo = registerHandGeo(new THREE.SphereGeometry(0.18, 16, 16));
      const padMesh = new THREE.Mesh(padGeo, skinMaterial);
      padMesh.position.set(0, 0.48, -0.01);
      padMesh.scale.set(1.08, 1.25, 0.9);
      p2Group.add(padMesh);

      // Manicured almond nail
      const nailGeo = registerHandGeo(new THREE.CylinderGeometry(0.10, 0.12, 0.22, 16, 1, false, 0, Math.PI));
      const nailMesh = new THREE.Mesh(nailGeo, nailMaterial);
      nailMesh.rotation.y = -Math.PI / 2;
      nailMesh.position.set(0, 0.48, 0.11);
      nailMesh.scale.set(0.85, 0.9, 0.36);
      p2Group.add(nailMesh);

      return thumb;
    };
    handGroup.add(createThumb());

    // --- DIGITS 2-5: ARTICULATED FINGERS (WITH KNUCKLE CAPSULES & ALMOND NAILS) ---
    const createArticulatedFinger = (
      length: number,
      thickness: number,
      xOffset: number,
      yOffset: number,
      splayAngle: number = 0,
      naturalCurl: number = -0.06
    ) => {
      const finger = new THREE.Group();
      finger.position.set(xOffset, yOffset, 0.02);
      finger.rotation.z = splayAngle;

      // Realistic anatomical phalangeal proportions
      const p1Len = length * 0.44;
      const p2Len = length * 0.33;
      const p3Len = length * 0.23;

      // 1. PROXIMAL PHALANX
      const p1Geo = registerHandGeo(new THREE.CylinderGeometry(thickness * 0.92, thickness, p1Len, 20));
      const p1Mesh = new THREE.Mesh(p1Geo, skinMaterial);
      p1Mesh.position.y = p1Len / 2;
      p1Mesh.scale.set(1.06, 1.0, 0.88);
      p1Mesh.castShadow = true;
      finger.add(p1Mesh);

      // PIP Knuckle Joint (Proximal Interphalangeal)
      const pipJoint = new THREE.Group();
      pipJoint.position.set(0, p1Len, 0);
      pipJoint.rotation.x = naturalCurl * 0.6;
      finger.add(pipJoint);

      const pipKnuckleGeo = registerHandGeo(new THREE.SphereGeometry(thickness * 0.94, 16, 16));
      const pipKnuckleMesh = new THREE.Mesh(pipKnuckleGeo, skinMaterial);
      pipKnuckleMesh.scale.set(1.12, 0.85, 0.92);
      pipKnuckleMesh.castShadow = true;
      pipJoint.add(pipKnuckleMesh);

      // 2. MIDDLE PHALANX
      const p2Geo = registerHandGeo(new THREE.CylinderGeometry(thickness * 0.82, thickness * 0.9, p2Len, 20));
      const p2Mesh = new THREE.Mesh(p2Geo, skinMaterial);
      p2Mesh.position.y = p2Len / 2;
      p2Mesh.scale.set(1.04, 1.0, 0.86);
      p2Mesh.castShadow = true;
      pipJoint.add(p2Mesh);

      // DIP Knuckle Joint (Distal Interphalangeal)
      const dipJoint = new THREE.Group();
      dipJoint.position.set(0, p2Len, 0);
      dipJoint.rotation.x = naturalCurl * 0.8;
      pipJoint.add(dipJoint);

      const dipKnuckleGeo = registerHandGeo(new THREE.SphereGeometry(thickness * 0.84, 16, 16));
      const dipKnuckleMesh = new THREE.Mesh(dipKnuckleGeo, skinMaterial);
      dipKnuckleMesh.scale.set(1.08, 0.85, 0.9);
      dipKnuckleMesh.castShadow = true;
      dipJoint.add(dipKnuckleMesh);

      // 3. DISTAL PHALANX & FINGERTIP PAD
      const p3Geo = registerHandGeo(new THREE.CylinderGeometry(thickness * 0.65, thickness * 0.8, p3Len, 20));
      const p3Mesh = new THREE.Mesh(p3Geo, skinMaterial);
      p3Mesh.position.y = p3Len / 2;
      p3Mesh.scale.set(1.02, 1.0, 0.82);
      p3Mesh.castShadow = true;
      dipJoint.add(p3Mesh);

      // Fleshy fingertip pad (palmar fullness)
      const tipPadGeo = registerHandGeo(new THREE.SphereGeometry(thickness * 0.74, 16, 16));
      const tipPadMesh = new THREE.Mesh(tipPadGeo, skinMaterial);
      tipPadMesh.position.set(0, p3Len + 0.04, -0.02);
      tipPadMesh.scale.set(1.02, 1.25, 0.92);
      tipPadMesh.castShadow = true;
      dipJoint.add(tipPadMesh);

      // Manicured Almond Nail (curved dorsal shell, lustrous French/nude sheen)
      const nailGeo = registerHandGeo(new THREE.CylinderGeometry(thickness * 0.52, thickness * 0.58, p3Len * 0.50, 16, 1, false, 0, Math.PI));
      const nailMesh = new THREE.Mesh(nailGeo, nailMaterial);
      nailMesh.rotation.y = -Math.PI / 2;
      nailMesh.position.set(0, p3Len * 0.74, thickness * 0.44);
      nailMesh.scale.set(0.9, 1.05, 0.35);
      dipJoint.add(nailMesh);

      return finger;
    };

    // Index, Middle, Ring (Ring Finger receives the Solitaire Ring!), Pinky
    const indexFinger = createArticulatedFinger(2.15, 0.22, -0.52, -0.06, -0.04, -0.06);
    const middleFinger = createArticulatedFinger(2.40, 0.23, -0.17, 0.04, -0.01, -0.05);
    const ringFinger = createArticulatedFinger(2.22, 0.215, 0.18, 0.01, 0.02, -0.05);
    const pinkyFinger = createArticulatedFinger(1.72, 0.19, 0.51, -0.15, 0.07, -0.08);

    handGroup.add(indexFinger, middleFinger, ringFinger, pinkyFinger);

    // 4. ENVIRONMENT & LIGHTING RIG
    // High-lumen luxury jewelry studio lighting: provides uniform warm gold illumination with zero black blind spots
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    // Main Overhead Jewelry Spotlight
    const mainSpot = new THREE.SpotLight(0xfffbeb, 4.2);
    mainSpot.position.set(3, 9, 7);
    mainSpot.angle = Math.PI / 3;
    mainSpot.penumbra = 0.8;
    scene.add(mainSpot);

    // Front warm fill light (illuminates front faces of shank & prongs directly)
    const frontFill = new THREE.DirectionalLight(0xffedd5, 2.2);
    frontFill.position.set(0, 2, 7);
    scene.add(frontFill);

    // Lower upward gold bounce light (illuminates underbelly so the ring shank shines bright gold underneath)
    const bottomBounce = new THREE.DirectionalLight(0xfef08a, 2.0);
    bottomBounce.position.set(0, -5, 4);
    scene.add(bottomBounce);

    // Left Warm Fill Light (Gold radiance)
    const warmFill = new THREE.PointLight(0xfef08a, 2.6, 15);
    warmFill.position.set(-6, 2, 4);
    scene.add(warmFill);

    // Right Cool Prismatic Rim Light (Moissanite fire dispersion)
    const coolRim = new THREE.PointLight(0xa5f3fc, 2.5, 15);
    coolRim.position.set(5, -2, -4);
    scene.add(coolRim);

    // Soft feathered radial contact shadow disc (eliminates all hard horizon edges and black dividing borders)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.22)');
      grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.12)');
      grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.03)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)'); // fully transparent at edges
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(4.2, 4.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: isLight ? 0.35 : 0.65,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -2.15, 0);
    scene.add(shadowMesh);

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

    // ANIMATION & SCENE LERP ENGINE
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const { activeScene: currScene, selectedMetal: currMetal, selectedGemTone: currGem, selectedSkinTone: currSkinTone, isRotating: rotate, activeSplitTab: currSplit, isLight: currentIsLight } = stateRef.current;

      // Update Metal Color & Emissive Radiance
      goldMaterial.color.lerp(metalColors[currMetal], 0.1);
      goldMaterial.emissive.lerp(metalEmissives[currMetal], 0.1);
      prongs.forEach((p) => {
        const mat = p.material as THREE.MeshPhysicalMaterial;
        mat.color.lerp(metalColors[currMetal], 0.1);
        if (mat.emissive) mat.emissive.lerp(metalEmissives[currMetal], 0.1);
      });

      // Update Ring Inner Glow color based on metal tone
      if (currMetal === 'Yellow Gold') {
        ringInnerLight.color.setHex(0xfef08a);
      } else if (currMetal === 'White Gold') {
        ringInnerLight.color.setHex(0xe2e8f0);
      } else {
        ringInnerLight.color.setHex(0xfda4af);
      }

      // Update Skin Tone Color
      if (skinToneMap[currSkinTone]) {
        skinMaterial.color.lerp(new THREE.Color(skinToneMap[currSkinTone].hex), 0.1);
      }

      // Update Gem Material & Point Light Tint
      if (gemMesh.material !== gemMaterials[currGem]) {
        gemMesh.material = gemMaterials[currGem];
        if (currGem === 'vivid-pink') {
          gemLight.color.setHex(0xff2266);
          gemLight.intensity = 2.8;
        } else if (currGem === 'd-color-icy') {
          gemLight.color.setHex(0x38bdf8);
          gemLight.intensity = 2.2;
        } else {
          gemLight.color.setHex(0xf59e0b);
          gemLight.intensity = 2.0;
        }
      }

      // Background color & studio lighting transition for Cashmere Greige vs Midnight Noir
      const targetBg = currentIsLight ? new THREE.Color(0xcfc8bc) : new THREE.Color(0x151210);
      scene.background = (scene.background as THREE.Color).lerp(targetBg, 0.08);

      shadowMat.opacity = THREE.MathUtils.lerp(shadowMat.opacity, currentIsLight ? 0.35 : 0.65, 0.08);
      const isHand = currScene === 'hand';
      ambientLight.intensity = THREE.MathUtils.lerp(ambientLight.intensity, isHand ? (currentIsLight ? 1.05 : 0.75) : (currentIsLight ? 1.80 : 1.10), 0.08);
      mainSpot.intensity = THREE.MathUtils.lerp(mainSpot.intensity, isHand ? (currentIsLight ? 2.8 : 2.2) : (currentIsLight ? 4.2 : 3.8), 0.08);
      frontFill.intensity = THREE.MathUtils.lerp(frontFill.intensity, isHand ? (currentIsLight ? 1.2 : 0.9) : (currentIsLight ? 2.2 : 1.6), 0.08);
      bottomBounce.intensity = THREE.MathUtils.lerp(bottomBounce.intensity, isHand ? 0.6 : (currentIsLight ? 2.0 : 1.4), 0.08);

      // SCENE TARGETS: Fully calibrated framing so the ring is 100% visible and never clipped or occluded
      if (currScene === 'solitaire') {
        // SCENE 1: Rotating centerpiece - elevated and scaled with generous margin
        const autoRot = rotate && !isDragging ? elapsed * 0.45 : 0;
        ringGroup.position.lerp(new THREE.Vector3(0, 0.10, 0), 0.08);
        ringGroup.rotation.y = THREE.MathUtils.lerp(ringGroup.rotation.y, autoRot + userRotY, 0.1);
        ringGroup.rotation.x = THREE.MathUtils.lerp(ringGroup.rotation.x, userRotX, 0.1);
        ringGroup.scale.lerp(new THREE.Vector3(0.76, 0.76, 0.76), 0.08);

        // Hide Box & Hand
        boxGroup.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.1);
        boxGroup.position.lerp(new THREE.Vector3(1, -8, 0), 0.1);
        handGroup.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.1);
        handGroup.position.lerp(new THREE.Vector3(0, -8, 0), 0.1);

        shadowMesh.position.set(0, -1.90, 0);
        camera.position.lerp(new THREE.Vector3(0, 0, 9.8), 0.08);
      } else if (currScene === 'box') {
        // SCENE 2: The Velvet Ring Box - perfectly centered box & elevated ring
        boxGroup.scale.lerp(new THREE.Vector3(0.80, 0.80, 0.80), 0.08);
        boxGroup.position.lerp(new THREE.Vector3(0, -0.75, 0), 0.08);
        boxGroup.rotation.y = THREE.MathUtils.lerp(boxGroup.rotation.y, -0.22 + (userRotY * 0.3), 0.08);

        // Lid opens up backwards
        lidPivot.rotation.x = THREE.MathUtils.lerp(lidPivot.rotation.x, -2.05, 0.08);

        // Ring standing proudly elevated so the full circle, prongs, and stone are completely visible
        ringGroup.scale.lerp(new THREE.Vector3(0.55, 0.55, 0.55), 0.08);
        ringGroup.position.lerp(new THREE.Vector3(0, -0.10, 0.08), 0.08);
        ringGroup.rotation.set(0.12, -0.22 + (userRotY * 0.3), 0.05);

        handGroup.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.1);
        handGroup.position.lerp(new THREE.Vector3(0, -8, 0), 0.1);
        shadowMesh.position.set(0, -1.85, 0);
        camera.position.lerp(new THREE.Vector3(0, 0.05, 9.6), 0.08);
      } else if (currScene === 'split') {
        // SCENE 3: Anatomy Inspection - calibrated scale so full profile fits effortlessly
        boxGroup.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.1);
        boxGroup.position.lerp(new THREE.Vector3(1, -8, 0), 0.1);
        handGroup.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.1);
        handGroup.position.lerp(new THREE.Vector3(0, -8, 0), 0.1);

        ringGroup.scale.lerp(new THREE.Vector3(0.76, 0.76, 0.76), 0.08);
        ringGroup.position.lerp(new THREE.Vector3(0, 0.10, 0), 0.08);

        if (currSplit === 'shank') {
          ringGroup.rotation.y = THREE.MathUtils.lerp(ringGroup.rotation.y, Math.PI / 3.2 + userRotY, 0.1);
          ringGroup.rotation.x = THREE.MathUtils.lerp(ringGroup.rotation.x, 0.25 + userRotX, 0.1);
        } else {
          ringGroup.rotation.y = THREE.MathUtils.lerp(ringGroup.rotation.y, userRotY, 0.1);
          ringGroup.rotation.x = THREE.MathUtils.lerp(ringGroup.rotation.x, Math.PI / 2.15 + userRotX, 0.1);
        }

        shadowMesh.position.set(0, -1.90, 0);
        camera.position.lerp(new THREE.Vector3(0, 0, 9.6), 0.08);
      } else if (currScene === 'hand') {
        // SCENE 4: Virtual Hand Try-On - hand centered, ring clearly visible on ring finger
        boxGroup.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.15);
        boxGroup.position.lerp(new THREE.Vector3(0, -12, 0), 0.15);

        handGroup.scale.lerp(new THREE.Vector3(0.85, 0.85, 0.85), 0.14);
        handGroup.position.lerp(new THREE.Vector3(0, 0.05, 0), 0.14);
        handGroup.rotation.y = THREE.MathUtils.lerp(handGroup.rotation.y, userRotY * 0.35, 0.12);
        handGroup.rotation.x = THREE.MathUtils.lerp(handGroup.rotation.x, -0.06 + userRotX * 0.35, 0.12);

        const handScale = handGroup.scale.x;
        const targetRingPos = new THREE.Vector3(
          handGroup.position.x + 0.18 * handScale,
          handGroup.position.y + 0.35 * handScale,
          handGroup.position.z + 0.12
        );
        ringGroup.scale.lerp(new THREE.Vector3(0.28, 0.28, 0.28), 0.16);
        ringGroup.position.lerp(targetRingPos, 0.20);
        ringGroup.rotation.set(0.18, handGroup.rotation.y, 0);

        shadowMesh.position.set(0, -2.15, 0);
        camera.position.lerp(new THREE.Vector3(0, 0.15, 8.8), 0.12);
      }

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      renderer.dispose();
      shankGeo.dispose();
      prongGeo.dispose();
      gemGeo.dispose();
      paveGeo.dispose();
      lowerBoxGeo.dispose();
      rimGeo.dispose();
      cushionGeo.dispose();
      handGeometries.forEach((g) => g.dispose());
      shadowGeo.dispose();

      goldMaterial.dispose();
      velvetMat.dispose();
      cushionMat.dispose();
      goldRimMat.dispose();
      skinMaterial.dispose();
      nailMaterial.dispose();
      paveMat.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();

      Object.values(gemMaterials).forEach((m) => m.dispose());

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section id="3d-experience" className={`relative w-full overflow-hidden border-b transition-colors duration-500 ${
      isLight ? 'bg-[#cfc8bc] text-[#1f1a16] border-[#c0b8ab]' : 'bg-[#151210] text-[#f2efe9] border-stone-800'
    }`}>
      
      {/* Giant Stage Watermark Numeral Inspired by Celestique */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className={`text-[190px] sm:text-[320px] lg:text-[440px] font-editorial font-bold tracking-tighter transition-all duration-700 select-none ${
          isLight ? 'text-white/20' : 'text-white/[0.04]'
        }`}>
          {activeScene === 'solitaire' ? '01' : activeScene === 'box' ? '02' : activeScene === 'split' ? '03' : '04'}
        </span>
      </div>

      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[620px] sm:h-[720px] lg:h-[780px] cursor-grab active:cursor-grabbing relative select-none z-10"
      />

      {/* OVERLAY: Dynamic Scene Text & Typography */}
      
      {/* Top Floating Stage Controls & Minimal Badges: Kept outside center ring bounding box so the ring is 100% visible */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 z-20 pointer-events-none flex items-start justify-between">
        
        {/* Left Minimal Badge per Stage */}
        <div className="pointer-events-auto max-w-xs sm:max-w-sm space-y-1">
          {activeScene === 'solitaire' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-[#1f1a16] animate-pulse" />
                <span className={isLight ? 'text-[#1f1a16] font-bold' : 'text-amber-400 font-bold'}>✦ 01 · Celestial Atelier</span>
              </div>
              <h2 className={`text-lg sm:text-xl font-editorial font-bold ${isLight ? 'text-[#1f1a16]' : 'text-white'}`}>
                Royal Crown Cushion
              </h2>
              <p className={`text-[11px] ${isLight ? 'text-[#5b544b]' : 'text-stone-400'}`}>
                Hand-forged 18K solid gold · 4-claw compass setting · VVS1 D-Color.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={() => onAddToInquiry(selectedPurity, selectedMetal, selectedCarat)}
                  className={`px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-sm ${
                    isLight ? 'bg-[#1f1a16] text-white hover:bg-black' : 'bg-white text-stone-950 hover:bg-stone-200'
                  }`}
                >
                  Inquire ➔
                </button>
                <button
                  onClick={onRequestCad}
                  className={`px-3.5 py-1.5 border text-[11px] uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
                    isLight ? 'border-[#1f1a16]/35 text-[#1f1a16] hover:bg-[#1f1a16] hover:text-white bg-white/40 backdrop-blur-xs' : 'border-stone-700 text-stone-300 hover:border-white'
                  }`}
                >
                  Custom CAD
                </button>
              </div>
            </div>
          )}

          {activeScene === 'box' && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono tracking-widest uppercase text-amber-700 font-bold">
                02 · Atelier Vault
              </div>
              <h2 className={`text-lg sm:text-xl font-editorial font-bold ${isLight ? 'text-stone-950' : 'text-white'}`}>
                Heirloom Velvet Box
              </h2>
              <p className={`text-[11px] ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
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
                  className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    activeSplitTab === 'shank' ? (isLight ? 'bg-stone-950 text-white font-bold' : 'bg-white text-stone-950 font-bold') : 'text-stone-600'
                  }`}
                >
                  Shank Profile
                </button>
                <button
                  onClick={() => setActiveSplitTab('eternity')}
                  className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
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
                04 · Virtual Hand Trial
              </div>
              <h3 className={`text-lg sm:text-xl font-editorial font-bold ${isLight ? 'text-stone-950' : 'text-white'}`}>
                Worn on Ring Finger
              </h3>
              <div className="flex items-center gap-1.5">
                {(Object.keys(skinToneMap) as SkinToneId[]).map((toneId) => (
                  <button
                    key={toneId}
                    type="button"
                    onClick={() => setSelectedSkinTone(toneId)}
                    className={`flex items-center gap-1 px-2 py-0.5 text-[10px] border transition-all cursor-pointer ${
                      selectedSkinTone === toneId ? (isLight ? 'border-stone-900 bg-stone-900 text-white font-bold' : 'border-white bg-stone-800 text-white') : (isLight ? 'border-stone-200 bg-white/80 text-stone-700' : 'border-stone-800 bg-stone-900 text-stone-400')
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${skinToneMap[toneId].bgClass}`} />
                    <span>{skinToneMap[toneId].name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Minimal 360 Hint */}
        <div className="hidden sm:block text-right font-mono text-[10px] pointer-events-none">
          <span className={`block uppercase tracking-widest ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>360° Light Studio</span>
          <span className={`font-bold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>Interactive Drag</span>
        </div>
      </div>

      {/* BOTTOM CONTROLS & CUSTOMIZER DOCK */}
      <div className={`absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 z-30 flex flex-col md:flex-row items-center justify-between gap-3 p-3 sm:p-4 border rounded-2xl shadow-xl backdrop-blur-md transition-colors ${
        isLight
          ? 'bg-[#faf8f4]/95 border-[#ded7ca] text-[#1f1a16]'
          : 'bg-[#181512]/95 border-[#2c2621] text-[#f2efe9]'
      }`}>
        
        {/* Stepper Navigation: Prev < | Stages 01..04 | Next > */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <button
            onClick={handlePrevScene}
            className={`p-1.5 border rounded-lg transition-colors cursor-pointer mr-1 ${
              isLight
                ? 'border-[#ded7ca] bg-[#f2eee7] text-[#1f1a16] hover:bg-[#e6e0d4]'
                : 'border-stone-800 bg-stone-950 text-stone-400 hover:bg-stone-800 hover:text-white'
            }`}
            title="Previous Stage"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveScene('solitaire')}
            className={`px-2.5 sm:px-3 py-1.5 font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer rounded-lg ${
              activeScene === 'solitaire'
                ? isLight ? 'bg-[#1f1a16] text-white font-bold shadow-xs' : 'bg-white text-stone-950 font-bold'
                : isLight ? 'text-[#61584c] hover:text-[#1f1a16] hover:bg-[#f2eee7]' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>01. Solitaire</span>
          </button>

          <button
            onClick={() => setActiveScene('box')}
            className={`px-2.5 sm:px-3 py-1.5 font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer rounded-lg ${
              activeScene === 'box'
                ? isLight ? 'bg-[#1f1a16] text-white font-bold shadow-xs' : 'bg-white text-stone-950 font-bold'
                : isLight ? 'text-[#61584c] hover:text-[#1f1a16] hover:bg-[#f2eee7]' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>02. Velvet Box</span>
          </button>

          <button
            onClick={() => setActiveScene('split')}
            className={`px-2.5 sm:px-3 py-1.5 font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer rounded-lg ${
              activeScene === 'split'
                ? isLight ? 'bg-[#1f1a16] text-white font-bold shadow-xs' : 'bg-white text-stone-950 font-bold'
                : isLight ? 'text-[#61584c] hover:text-[#1f1a16] hover:bg-[#f2eee7]' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>03. Shank & Halo</span>
          </button>

          <button
            onClick={() => setActiveScene('hand')}
            className={`px-2.5 sm:px-3 py-1.5 font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer rounded-lg ${
              activeScene === 'hand'
                ? isLight ? 'bg-[#1f1a16] text-white font-bold shadow-xs' : 'bg-white text-stone-950 font-bold'
                : isLight ? 'text-[#61584c] hover:text-[#1f1a16] hover:bg-[#f2eee7]' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>04. On Hand</span>
          </button>

          <button
            onClick={handleNextScene}
            className={`p-1.5 border rounded-lg transition-colors cursor-pointer ml-1 ${
              isLight
                ? 'border-[#ded7ca] bg-[#f2eee7] text-[#1f1a16] hover:bg-[#e6e0d4]'
                : 'border-stone-800 bg-stone-950 text-stone-400 hover:bg-stone-800 hover:text-white'
            }`}
            title="Next Stage"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Live 3D Configurator Tools: Metal, Gem, Price */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs">
          {/* Metal Changer */}
          {/* Metal Changer */}
          <div className={`flex items-center gap-1 p-1 border rounded-lg ${
            isLight ? 'bg-[#f2eee7] border-[#ded7ca]' : 'bg-stone-950 border-stone-800'
          }`}>
            {(['Yellow Gold', 'White Gold', 'Rose Gold'] as GoldTone[]).map((metal) => (
              <button
                key={metal}
                onClick={() => setSelectedMetal(metal)}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  selectedMetal === metal
                    ? isLight ? 'bg-[#1f1a16] text-white font-bold shadow-xs' : 'bg-stone-800 text-white'
                    : isLight ? 'text-[#61584c] hover:text-[#1f1a16]' : 'text-stone-500 hover:text-stone-300'
                }`}
                title={metal}
              >
                {metal.replace(' Gold', '')}
              </button>
            ))}
          </div>

          {/* Gem Color Tone */}
          <div className={`flex items-center gap-1 p-1 border rounded-lg ${
            isLight ? 'bg-[#f2eee7] border-[#ded7ca]' : 'bg-stone-950 border-stone-800'
          }`}>
            <button
              onClick={() => setSelectedGemTone('vivid-pink')}
              className={`w-5 h-5 rounded-full bg-rose-500 border transition-all cursor-pointer ${
                selectedGemTone === 'vivid-pink'
                  ? isLight ? 'border-[#1f1a16] scale-110 shadow-xs ring-1 ring-[#1f1a16]' : 'border-white scale-110'
                  : 'border-transparent opacity-60'
              }`}
              title="Vivid Pink Fancy Moissanite"
            />
            <button
              onClick={() => setSelectedGemTone('d-color-icy')}
              className={`w-5 h-5 rounded-full bg-slate-100 border transition-all cursor-pointer ${
                selectedGemTone === 'd-color-icy'
                  ? 'border-sky-500 scale-110 shadow-xs ring-1 ring-sky-400'
                  : 'border-transparent opacity-60'
              }`}
              title="D-Color Icy White Moissanite"
            />
            <button
              onClick={() => setSelectedGemTone('champagne')}
              className={`w-5 h-5 rounded-full bg-amber-400 border transition-all cursor-pointer ${
                selectedGemTone === 'champagne'
                  ? isLight ? 'border-[#1f1a16] scale-110 shadow-xs ring-1 ring-[#1f1a16]' : 'border-white scale-110'
                  : 'border-transparent opacity-60'
              }`}
              title="Champagne Golden Moissanite"
            />
          </div>

          {/* Transparent Live Price Display */}
          <div className={`font-mono text-right pl-2 border-l hidden sm:block ${
            isLight ? 'border-[#ded7ca]' : 'border-stone-800'
          }`}>
            <div className={`text-[10px] uppercase ${isLight ? 'text-[#7d7467]' : 'text-stone-400'}`}>
              Atelier Formula
            </div>
            <div className={`font-bold text-sm ${isLight ? 'text-[#1f1a16]' : 'text-white'}`}>
              {formatCurrency(livePricing.totalPriceInr, currency)}
            </div>
          </div>

          {/* Auto-Rotation Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${
              isRotating
                ? isLight ? 'bg-[#1f1a16] border-[#1f1a16] text-white' : 'bg-stone-800 border-stone-700 text-white'
                : isLight ? 'border-[#ded7ca] bg-[#f2eee7] text-[#61584c]' : 'border-stone-800 text-stone-500'
            }`}
            title="Toggle 360° Auto-Rotation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Studio Ambiance Theme Toggle */}
          {onToggleThemeMode && (
            <div className={`hidden md:flex items-center gap-1 pl-2 border-l ${
              isLight ? 'border-[#ded7ca]' : 'border-stone-800'
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
                trackColor="#ded7ca"
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
