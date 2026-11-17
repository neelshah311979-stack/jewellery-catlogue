import React, { useState } from 'react';

interface StoneCutVisualizerProps {
  cutType: 'oval' | 'emerald' | 'toi-et-moi' | 'cushion' | 'pear' | 'riviere' | 'round' | 'pendant' | 'earrings';
  caratText?: string;
  metalTone?: 'Yellow Gold' | 'White Gold' | 'Rose Gold';
  className?: string;
  enableLoupe?: boolean;
  graInscription?: string;
}

export const StoneCutVisualizer: React.FC<StoneCutVisualizerProps> = ({
  cutType,
  caratText = '2.50 CT',
  metalTone = 'Yellow Gold',
  className = '',
  enableLoupe = false,
  graInscription = 'GRA 98241088',
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // -10 to +10 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Metal colors for setting ring/prongs
  const metalColors = {
    'Yellow Gold': { band: '#d97706', highlight: '#fef08a', stroke: '#b45309' },
    'White Gold': { band: '#94a3b8', highlight: '#f8fafc', stroke: '#64748b' },
    'Rose Gold': { band: '#fb7185', highlight: '#ffe4e6', stroke: '#e11d48' },
  }[metalTone];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden select-none bg-radial from-stone-900 via-stone-950 to-stone-950 flex items-center justify-center p-6 border border-stone-800 transition-all duration-300 ${className}`}
      style={{
        perspective: '1000px',
      }}
    >
      {/* Subtle luxury light sweep background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen transition-transform duration-200"
        style={{
          background: `radial-gradient(circle at ${50 + tilt.x * 2}% ${50 - tilt.y * 2}%, rgba(254,240,138,0.2) 0%, rgba(244,63,94,0.1) 40%, transparent 80%)`
        }}
      />

      {/* Main Vector Stone Container with 3D Tilt */}
      <div
        className={`relative flex items-center justify-center transition-transform duration-150 ease-out ${isZoomed ? 'scale-135' : 'scale-100'}`}
        style={{
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        }}
      >
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full max-w-[280px] max-h-[280px] drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Prismatic Rainbow Gradients representing Moissanite 0.104 Dispersion */}
            <linearGradient id="fireRainbow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ecfeff" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#e0e7ff" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#fdf4ff" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#fef3c7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ecfdf5" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="fireRainbow2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#c7d2fe" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#fbcfe8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="stepCutGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.9" />
              <stop offset="20%" stopColor="#e2e8f0" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#e0e7ff" stopOpacity="0.7" />
              <stop offset="80%" stopColor="#f8fafc" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.8" />
            </linearGradient>

            <filter id="diamondShine" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#94a3b8" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Setting Ring Band Arch */}
          {cutType !== 'riviere' && cutType !== 'pendant' && (
            <g id="ring-setting" className="opacity-95">
              <path
                d="M 60 250 C 60 180, 240 180, 240 250"
                stroke={metalColors.band}
                strokeWidth="16"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 62 250 C 62 182, 238 182, 238 250"
                stroke={metalColors.highlight}
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                opacity="0.8"
              />
            </g>
          )}

          {/* OVAL CUT */}
          {cutType === 'oval' && (
            <g id="oval-facets" filter="url(#diamondShine)">
              {/* Outer Contour */}
              <ellipse cx="150" cy="140" rx="68" ry="92" fill="url(#fireRainbow1)" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Table Facet */}
              <ellipse cx="150" cy="140" rx="38" ry="52" fill="url(#fireRainbow2)" stroke="#94a3b8" strokeWidth="1" />
              {/* Kite & Star Facets */}
              <path d="M 150 48 L 175 100 L 150 88 L 125 100 Z" fill="#ffffff" fillOpacity="0.7" stroke="#cbd5e1" strokeWidth="0.8" />
              <path d="M 150 232 L 175 180 L 150 192 L 125 180 Z" fill="#ffffff" fillOpacity="0.7" stroke="#cbd5e1" strokeWidth="0.8" />
              <path d="M 82 140 L 120 160 L 112 140 L 120 120 Z" fill="#f8fafc" fillOpacity="0.75" stroke="#cbd5e1" strokeWidth="0.8" />
              <path d="M 218 140 L 180 160 L 188 140 L 180 120 Z" fill="#f8fafc" fillOpacity="0.75" stroke="#cbd5e1" strokeWidth="0.8" />
              
              {/* Star Ray Crossings */}
              <line x1="150" y1="48" x2="150" y2="88" stroke="#64748b" strokeWidth="0.8" />
              <line x1="150" y1="192" x2="150" y2="232" stroke="#64748b" strokeWidth="0.8" />
              <line x1="82" y1="140" x2="112" y2="140" stroke="#64748b" strokeWidth="0.8" />
              <line x1="188" y1="140" x2="218" y2="140" stroke="#64748b" strokeWidth="0.8" />
              
              {/* Inner Radiant Center */}
              <circle cx="150" cy="140" r="14" fill="#ffffff" fillOpacity="0.85" />
              
              {/* Prongs */}
              <circle cx="95" cy="72" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              <circle cx="205" cy="72" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              <circle cx="95" cy="208" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              <circle cx="205" cy="208" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
            </g>
          )}

          {/* EMERALD STEP CUT */}
          {cutType === 'emerald' && (
            <g id="emerald-facets" filter="url(#diamondShine)">
              {/* Outer Octagon */}
              <polygon
                points="105,65 195,65 225,95 225,185 195,215 105,215 75,185 75,95"
                fill="url(#stepCutGradient)"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              {/* Step 2 */}
              <polygon
                points="112,78 188,78 212,102 212,178 188,202 112,202 88,178 88,102"
                fill="url(#fireRainbow1)"
                stroke="#64748b"
                strokeWidth="1"
              />
              {/* Step 3 (Inner Table) */}
              <polygon
                points="120,95 180,95 195,110 195,170 180,185 120,185 105,170 105,110"
                fill="url(#fireRainbow2)"
                stroke="#475569"
                strokeWidth="1"
              />
              {/* Mirror Corner Radiations */}
              <line x1="105" y1="65" x2="120" y2="95" stroke="#cbd5e1" strokeWidth="1.2" />
              <line x1="195" y1="65" x2="180" y2="95" stroke="#cbd5e1" strokeWidth="1.2" />
              <line x1="225" y1="95" x2="195" y2="110" stroke="#cbd5e1" strokeWidth="1.2" />
              <line x1="225" y1="185" x2="195" y2="170" stroke="#cbd5e1" strokeWidth="1.2" />
              <line x1="195" y1="215" x2="180" y2="185" stroke="#cbd5e1" strokeWidth="1.2" />
              <line x1="105" y1="215" x2="120" y2="185" stroke="#cbd5e1" strokeWidth="1.2" />
              <line x1="75" y1="185" x2="105" y2="170" stroke="#cbd5e1" strokeWidth="1.2" />
              <line x1="75" y1="95" x2="105" y2="110" stroke="#cbd5e1" strokeWidth="1.2" />

              {/* Corner Prongs */}
              <rect x="70" y="60" width="10" height="10" rx="2" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              <rect x="220" y="60" width="10" height="10" rx="2" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              <rect x="70" y="210" width="10" height="10" rx="2" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              <rect x="220" y="210" width="10" height="10" rx="2" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
            </g>
          )}

          {/* TWO-STONE DUO (Pear + Emerald Dual Setting) */}
          {cutType === 'toi-et-moi' && (
            <g id="toi-et-moi-facets" filter="url(#diamondShine)">
              {/* Bypass Band Swirl */}
              <path
                d="M 40 220 Q 90 120, 140 160 T 260 90"
                stroke={metalColors.band}
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 40 220 Q 90 120, 140 160 T 260 90"
                stroke={metalColors.highlight}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Stone 1: Emerald Cut (Left) */}
              <g transform="translate(-10, 0) rotate(-12, 115, 140)">
                <polygon
                  points="90,80 145,80 160,95 160,165 145,180 90,180 75,165 75,95"
                  fill="url(#stepCutGradient)"
                  stroke="#64748b"
                  strokeWidth="1.2"
                />
                <polygon
                  points="98,90 137,90 148,102 148,158 137,170 98,170 87,158 87,102"
                  fill="url(#fireRainbow1)"
                  stroke="#475569"
                  strokeWidth="0.8"
                />
              </g>

              {/* Stone 2: Pear Cut (Right) */}
              <g transform="translate(15, -10) rotate(16, 195, 135)">
                <path
                  d="M 195 50 C 235 110, 245 180, 195 195 C 145 180, 155 110, 195 50 Z"
                  fill="url(#fireRainbow2)"
                  stroke="#64748b"
                  strokeWidth="1.2"
                />
                <ellipse cx="195" cy="140" rx="20" ry="26" fill="#ffffff" fillOpacity="0.85" stroke="#94a3b8" strokeWidth="0.8" />
              </g>
            </g>
          )}

          {/* CUSHION CUT */}
          {cutType === 'cushion' && (
            <g id="cushion-facets" filter="url(#diamondShine)">
              {/* Soft pillow square */}
              <rect x="75" y="70" width="150" height="150" rx="36" fill="url(#fireRainbow1)" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="105" y="100" width="90" height="90" rx="20" fill="url(#fireRainbow2)" stroke="#64748b" strokeWidth="1" />
              {/* Vintage Floral Facets */}
              <path d="M 150 70 L 150 100 M 150 190 L 150 220 M 75 145 L 105 145 M 195 145 L 225 145" stroke="#cbd5e1" strokeWidth="1.2" />
              <circle cx="150" cy="145" r="18" fill="#ffffff" fillOpacity="0.8" />
              {/* 4 Vintage Prongs */}
              <circle cx="95" cy="90" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              <circle cx="205" cy="90" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              <circle cx="95" cy="200" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              <circle cx="205" cy="200" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
            </g>
          )}

          {/* PEAR CUT */}
          {cutType === 'pear' && (
            <g id="pear-facets" filter="url(#diamondShine)">
              <path
                d="M 150 50 C 205 115, 215 190, 150 225 C 85 190, 95 115, 150 50 Z"
                fill="url(#fireRainbow1)"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <path
                d="M 150 85 C 185 130, 190 185, 150 205 C 110 185, 115 130, 150 85 Z"
                fill="url(#fireRainbow2)"
                stroke="#64748b"
                strokeWidth="1"
              />
              {/* Tip V-Prong */}
              <path d="M 142 45 L 150 38 L 158 45 Z" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              {/* Base Prongs */}
              <circle cx="108" cy="205" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              <circle cx="192" cy="205" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
            </g>
          )}

          {/* CONTINUOUS LINE BRACELET / FINE BRACELET */}
          {cutType === 'riviere' && (
            <g id="riviere-bracelet-facets">
              {/* Flowing curve line of stones */}
              <path
                d="M 20 80 Q 90 220, 160 140 T 280 200"
                stroke={metalColors.band}
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Sequence of circular 3mm stones along line */}
              {[
                { cx: 35, cy: 95 },
                { cx: 55, cy: 125 },
                { cx: 75, cy: 155 },
                { cx: 98, cy: 175 },
                { cx: 125, cy: 170 },
                { cx: 150, cy: 150 },
                { cx: 175, cy: 140 },
                { cx: 202, cy: 150 },
                { cx: 228, cy: 168 },
                { cx: 254, cy: 188 },
              ].map((pos, idx) => (
                <g key={idx}>
                  <circle cx={pos.cx} cy={pos.cy} r="11" fill="url(#fireRainbow1)" stroke="#cbd5e1" strokeWidth="1" />
                  <circle cx={pos.cx} cy={pos.cy} r="5" fill="#ffffff" fillOpacity="0.9" />
                  <circle cx={pos.cx - 7} cy={pos.cy - 7} r="1.5" fill={metalColors.band} />
                  <circle cx={pos.cx + 7} cy={pos.cy - 7} r="1.5" fill={metalColors.band} />
                  <circle cx={pos.cx - 7} cy={pos.cy + 7} r="1.5" fill={metalColors.band} />
                  <circle cx={pos.cx + 7} cy={pos.cy + 7} r="1.5" fill={metalColors.band} />
                </g>
              ))}
            </g>
          )}

          {/* ROUND BRILLIANT / EARRINGS */}
          {(cutType === 'round' || cutType === 'earrings') && (
            <g id="round-brilliant-facets" filter="url(#diamondShine)">
              <circle cx="150" cy="140" r="75" fill="url(#fireRainbow1)" stroke="#94a3b8" strokeWidth="1.5" />
              {/* 8-fold Hearts & Arrows table */}
              <circle cx="150" cy="140" r="42" fill="url(#fireRainbow2)" stroke="#64748b" strokeWidth="1" />
              {/* Ray Facets */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line
                  key={i}
                  x1={150 + 42 * Math.cos((angle * Math.PI) / 180)}
                  y1={140 + 42 * Math.sin((angle * Math.PI) / 180)}
                  x2={150 + 75 * Math.cos((angle * Math.PI) / 180)}
                  y2={140 + 75 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              ))}
              <circle cx="150" cy="140" r="14" fill="#ffffff" fillOpacity="0.9" />
              {/* 4 Martini Prongs */}
              <circle cx="98" cy="88" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              <circle cx="202" cy="88" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              <circle cx="98" cy="192" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
              <circle cx="202" cy="192" r="5" fill={metalColors.band} stroke={metalColors.highlight} strokeWidth="1" />
            </g>
          )}

          {/* PENDANT */}
          {cutType === 'pendant' && (
            <g id="pendant-facets" filter="url(#diamondShine)">
              {/* Hanging Chain Loop */}
              <path d="M 150 15 L 150 55" stroke={metalColors.band} strokeWidth="4" />
              <circle cx="150" cy="62" r="7" stroke={metalColors.band} strokeWidth="3" fill="none" />
              <path
                d="M 150 75 C 195 125, 205 185, 150 220 C 95 185, 105 125, 150 75 Z"
                fill="url(#fireRainbow1)"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <ellipse cx="150" cy="155" rx="28" ry="36" fill="url(#fireRainbow2)" stroke="#64748b" strokeWidth="1" />
            </g>
          )}
        </svg>

        {/* Micro-Laser Inscription Overlay on Zoom */}
        {isZoomed && (
          <div className="absolute bottom-6 bg-stone-900/90 text-white text-[10px] px-2.5 py-1 tracking-widest font-mono border border-stone-700 shadow-lg">
            <span>GIRDLE INSCRIPTION: </span>
            <span className="text-amber-300 font-bold">{graInscription}</span>
          </div>
        )}
      </div>

      {/* Loupe & Spec Indicator Bar */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] text-stone-400 font-medium">
        <span className="text-stone-300">D-Color</span>
        <span aria-hidden="true" className="text-stone-600">·</span>
        <span className="text-stone-300">VVS1 Clarity</span>
        <span aria-hidden="true" className="text-stone-600">·</span>
        <span className="text-amber-400 font-mono">{caratText}</span>
      </div>

      {enableLoupe && (
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute bottom-3 right-3 text-[11px] font-medium text-stone-200 bg-stone-900/90 hover:bg-stone-800 border border-stone-700 px-2.5 py-1 transition-colors shadow-xs cursor-pointer"
          title="Toggle 10x Gemological Loupe Zoom"
        >
          {isZoomed ? 'Reset Loupe 1x' : 'Loupe 10x Inscription'}
        </button>
      )}
    </div>
  );
};
