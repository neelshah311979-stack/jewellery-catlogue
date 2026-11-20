import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Award, Search, ArrowRight, Eye, Diamond } from 'lucide-react';
import { GEMOLOGICAL_COMPARISON_TABLE, STONE_CUTS_GUIDE } from '../utils/gemology';
import { StoneCutVisualizer } from './StoneCutVisualizer';
import { ATELIER_MEDIA } from '../data/atelierMedia';

interface GemologicalMasteryProps {
  onOpenGraModal: (certNumber?: string) => void;
  onOpenCadModal: (stoneShape?: string) => void;
  themeMode?: 'light' | 'dark';
}

export const GemologicalMastery: React.FC<GemologicalMasteryProps> = ({
  onOpenGraModal,
  onOpenCadModal,
  themeMode = 'light',
}) => {
  const isLight = themeMode === 'light';
  const [selectedCutId, setSelectedCutId] = useState<string>('classic-oval');
  const activeCut = STONE_CUTS_GUIDE.find((c) => c.id === selectedCutId) || STONE_CUTS_GUIDE[0];

  const cutVisualTagMap: Record<string, 'oval' | 'emerald' | 'cushion' | 'pear' | 'toi-et-moi'> = {
    'classic-oval': 'oval',
    'emerald-step-cut': 'emerald',
    'antique-old-european-cushion': 'cushion',
    'pear-marquise': 'pear',
    'toi-et-moi': 'toi-et-moi',
  };

  return (
    <section id="gemological-mastery" className={`py-20 border-t transition-colors duration-300 ${
      isLight ? 'bg-white border-stone-200 text-[#1f1a16]' : 'bg-[#151210] border-stone-800 text-[#f2efe9]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Title & Philosophy */}
        <div className="max-w-3xl">
          <div className={`text-xs font-mono uppercase tracking-widest mb-2 ${
            isLight ? 'text-[#1f1a16] font-bold' : 'text-amber-400'
          }`}>
            ✦ SECTION 05 · THE GEMOLOGICAL STANDARD ✦
          </div>
          <h2 className={`text-3xl sm:text-4xl font-editorial font-bold tracking-tight ${
            isLight ? 'text-stone-950' : 'text-white'
          }`}>
            Gemological Mastery: The Moissanite Standard
          </h2>
          <p className={`mt-4 text-sm leading-relaxed ${
            isLight ? 'text-stone-600' : 'text-stone-300'
          }`}>
            Eliminating ambiguity through scientific rigor. Discover the physics, optical properties, and grading metrics behind the exact stones hand-set inside our Mumbai atelier. Every center stone is calibrated for pure optical fire and lifetime endurance.
          </p>
        </div>

        {/* 5.1 The 4 Pillars of One Soul Moissanite - Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Clarity VVS1 */}
          <div className={`overflow-hidden border group transition-all hover:shadow-lg ${
            isLight
              ? 'bg-white border-stone-200 text-stone-900'
              : 'bg-stone-900/70 border-stone-800 text-stone-100'
          }`}>
            <div className="h-36 overflow-hidden relative">
              <img
                src={ATELIER_MEDIA.emeraldSolitaireVelvet}
                alt="VVS1 Clarity Loupe"
                className="w-full h-full object-cover object-[50%_72%] group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 text-[10px] font-mono uppercase tracking-wider bg-black/70 text-white px-2 py-0.5">
                10x Loupe Inspection
              </span>
            </div>
            <div className="p-5 space-y-2">
              <div className={`text-xs font-mono font-semibold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                PILLAR 01 · CLARITY
              </div>
              <h3 className={`text-lg font-editorial font-bold ${isLight ? 'text-stone-950' : 'text-white'}`}>
                VVS1 (Visually Flawless)
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                Zero visible inclusions under 10x magnification for pure mirror-like transparency.
              </p>
              <div className={`pt-2 text-[11px] border-t flex items-center gap-1.5 ${
                isLight ? 'border-stone-200 text-stone-600' : 'border-stone-800 text-stone-400'
              }`}>
                <Eye className={`w-3.5 h-3.5 ${isLight ? 'text-stone-700' : 'text-stone-300'}`} />
                <span>100% eye-clean in natural light</span>
              </div>
            </div>
          </div>

          {/* 2. Color D */}
          <div className={`overflow-hidden border group transition-all hover:shadow-lg ${
            isLight
              ? 'bg-white border-stone-200 text-stone-900'
              : 'bg-stone-900/70 border-stone-800 text-stone-100'
          }`}>
            <div className="h-36 overflow-hidden relative">
              <img
                src={ATELIER_MEDIA.ovalSolitaireStudio}
                alt="D-Color Icy White"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 text-[10px] font-mono uppercase tracking-wider bg-black/70 text-white px-2 py-0.5">
                Colorless Ice White
              </span>
            </div>
            <div className="p-5 space-y-2">
              <div className={`text-xs font-mono font-semibold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                PILLAR 02 · COLOR
              </div>
              <h3 className={`text-lg font-editorial font-bold ${isLight ? 'text-stone-950' : 'text-white'}`}>
                D-Color (Pure Colorless)
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                Pinnacle color grading with zero yellow or gray cast, matching top mined diamonds.
              </p>
              <div className={`pt-2 text-[11px] border-t flex items-center gap-1.5 ${
                isLight ? 'border-stone-200 text-stone-600' : 'border-stone-800 text-stone-400'
              }`}>
                <Diamond className={`w-3.5 h-3.5 ${isLight ? 'text-stone-700' : 'text-stone-300'}`} />
                <span>Crisp white in 18K solid gold</span>
              </div>
            </div>
          </div>

          {/* 3. Refractive Index */}
          <div className={`overflow-hidden border group transition-all hover:shadow-lg ${
            isLight
              ? 'bg-white border-stone-200 text-stone-900'
              : 'bg-stone-900/70 border-stone-800 text-stone-100'
          }`}>
            <div className="h-36 overflow-hidden relative">
              <img
                src={ATELIER_MEDIA.twoStoneBypass}
                alt="Spectral Dispersion Fire"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 text-[10px] font-mono uppercase tracking-wider bg-black/70 text-white px-2 py-0.5">
                0.104 Dispersion
              </span>
            </div>
            <div className="p-5 space-y-2">
              <div className={`text-xs font-mono font-semibold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                PILLAR 03 · FIRE & BRILLIANCE
              </div>
              <h3 className={`text-lg font-editorial font-bold ${isLight ? 'text-stone-950' : 'text-white'}`}>
                2.69 Refractive Index
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                Surpassing diamond (2.42) with 2.4x higher spectral dispersion fire.
              </p>
              <div className={`pt-2 text-[11px] border-t flex items-center gap-1.5 ${
                isLight ? 'border-stone-200 text-stone-600' : 'border-stone-800 text-stone-400'
              }`}>
                <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                <span>Rainbow scintillation in sunlight</span>
              </div>
            </div>
          </div>

          {/* 4. Mohs Hardness */}
          <div className={`overflow-hidden border group transition-all hover:shadow-lg ${
            isLight
              ? 'bg-white border-stone-200 text-stone-900'
              : 'bg-stone-900/70 border-stone-800 text-stone-100'
          }`}>
            <div className="h-36 overflow-hidden relative">
              <img
                src={ATELIER_MEDIA.mumbaiAtelierBench}
                alt="Atelier Durability"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 text-[10px] font-mono uppercase tracking-wider bg-black/70 text-white px-2 py-0.5">
                9.25 Mohs Scale
              </span>
            </div>
            <div className="p-5 space-y-2">
              <div className={`text-xs font-mono font-semibold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                PILLAR 04 · DURABILITY
              </div>
              <h3 className={`text-lg font-editorial font-bold ${isLight ? 'text-stone-950' : 'text-white'}`}>
                9.25 Mohs Hardness
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                Second only to diamond, impervious to daily scratches and backed by lifetime guarantee.
              </p>
              <div className={`pt-2 text-[11px] border-t flex items-center gap-1.5 ${
                isLight ? 'border-stone-200 text-stone-600' : 'border-stone-800 text-stone-400'
              }`}>
                <ShieldCheck className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                <span>Passes thermal diamond testers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Scientific Comparison Matrix */}
        <div className={`border shadow-xl ${
          isLight ? 'bg-white border-stone-200' : 'bg-stone-900/60 border-stone-800'
        }`}>
          <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isLight ? 'border-stone-200 bg-stone-50/70' : 'border-stone-800'
          }`}>
            <div>
              <h3 className={`text-lg font-editorial font-bold ${isLight ? 'text-stone-950' : 'text-white'}`}>
                Comparative Optical & Physical Analysis
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                One Soul Moissanite vs. Mined Diamond vs. Cubic Zirconia
              </p>
            </div>
            <div className={`text-xs font-mono ${isLight ? 'text-amber-800 font-semibold' : 'text-amber-400'}`}>
              Lab Calibrated · Mumbai Atelier Benchmark
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b font-semibold ${
                  isLight
                    ? 'bg-stone-100/80 border-stone-200 text-stone-900'
                    : 'bg-stone-950/80 border-stone-800 text-stone-300'
                }`}>
                  <th className="p-4 w-1/4">Metric & Property</th>
                  <th className={`p-4 w-1/4 font-bold border-x ${
                    isLight
                      ? 'bg-amber-100/50 text-amber-950 border-stone-200'
                      : 'bg-stone-800/60 text-amber-300 border-stone-800'
                  }`}>
                    One Soul Moissanite (VVS1 D)
                  </th>
                  <th className="p-4 w-1/4">Mined Natural Diamond</th>
                  <th className="p-4 w-1/4">Cubic Zirconia (CZ)</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-stone-200 text-stone-700' : 'divide-stone-800 text-stone-400'}`}>
                {GEMOLOGICAL_COMPARISON_TABLE.map((row, idx) => (
                  <tr key={idx} className={`transition-colors ${isLight ? 'hover:bg-stone-50' : 'hover:bg-stone-900/40'}`}>
                    <td className={`p-4 font-medium ${isLight ? 'text-stone-950' : 'text-stone-200'}`}>
                      <div>{row.property}</div>
                      <div className={`text-[11px] font-normal mt-0.5 ${isLight ? 'text-stone-500' : 'text-stone-500'}`}>
                        {row.significance}
                      </div>
                    </td>
                    <td className={`p-4 font-bold border-x ${
                      isLight
                        ? 'text-amber-900 bg-amber-50/50 border-stone-200'
                        : 'text-amber-300 bg-stone-800/30 border-stone-800'
                    }`}>
                      {row.oneSoulMoissanite}
                    </td>
                    <td className={`p-4 ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>{row.minedDiamond}</td>
                    <td className={`p-4 ${isLight ? 'text-stone-400' : 'text-stone-500'}`}>{row.cubicZirconia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5.2 Variety of Cuts & Bespoke Stone Shapes */}
        <div className={`border p-6 sm:p-10 space-y-8 shadow-xl ${
          isLight ? 'bg-white border-stone-200' : 'bg-stone-900/60 border-stone-800'
        }`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className={`text-xs font-mono uppercase tracking-widest mb-1 ${
                isLight ? 'text-amber-800 font-semibold' : 'text-amber-400'
              }`}>
                Section 5.2 · Facet Architecture
              </div>
              <h3 className={`text-2xl font-editorial font-bold ${isLight ? 'text-stone-950' : 'text-white'}`}>
                Bespoke Stone Cuts & Heritage Faceting
              </h3>
              <p className={`text-xs max-w-xl mt-1 ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                Select your preferred stone geometry. Our Mumbai master cutters specialize across antique heritage step-cuts, modern elongated brilliant silhouettes, and romantic Two-Stone pairings.
              </p>
            </div>
            
            <button
              onClick={() => onOpenCadModal(activeCut.name)}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start cursor-pointer shadow-md ${
                isLight
                  ? 'bg-stone-950 text-white hover:bg-stone-850'
                  : 'bg-amber-400 text-stone-950 hover:bg-amber-300'
              }`}
            >
              <span>Request CAD in this Cut</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cut Selector Tabs */}
          <div className={`flex gap-2 overflow-x-auto pb-2 border-b ${
            isLight ? 'border-stone-200' : 'border-stone-800'
          }`}>
            {STONE_CUTS_GUIDE.map((cut) => {
              const isSelected = selectedCutId === cut.id;
              return (
                <button
                  key={cut.id}
                  onClick={() => setSelectedCutId(cut.id)}
                  className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? isLight
                        ? 'border-stone-950 bg-stone-950 text-white font-bold shadow-xs'
                        : 'border-amber-400 bg-amber-400 text-stone-950 font-bold shadow-xs'
                      : isLight
                        ? 'border-stone-200 bg-stone-50 text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                        : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-white hover:border-stone-700'
                  }`}
                >
                  {cut.name}
                </button>
              );
            })}
          </div>

          {/* Interactive Active Cut Showcase */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center border p-6 sm:p-8 ${
            isLight
              ? 'bg-stone-50/60 border-stone-200'
              : 'bg-stone-950/70 border-stone-800'
          }`}>
            <div className="flex flex-col items-center justify-center">
              <StoneCutVisualizer
                cutType={cutVisualTagMap[activeCut.id] || 'oval'}
                caratText="3.00 CT"
                metalTone="Yellow Gold"
                enableLoupe={true}
                className="w-full max-w-[320px] aspect-square"
              />
              <span className={`text-[11px] mt-2 ${isLight ? 'text-stone-500' : 'text-stone-500'}`}>
                Move cursor over gem to tilt prismatic facets
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className={`text-[11px] font-mono uppercase tracking-wider ${
                  isLight ? 'text-amber-800 font-semibold' : 'text-amber-400'
                }`}>
                  Cut Profile Specification
                </span>
                <h4 className={`text-xl font-editorial font-bold mt-0.5 ${
                  isLight ? 'text-stone-950' : 'text-white'
                }`}>
                  {activeCut.name}
                </h4>
                <div className={`font-medium mt-0.5 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                  {activeCut.subtitle}
                </div>
              </div>

              <p className={`leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                {activeCut.description}
              </p>

              <div className={`space-y-2 border-t pt-3 ${isLight ? 'border-stone-200' : 'border-stone-800'}`}>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-stone-500' : 'text-stone-500'}>Optical Facet Geometry:</span>
                  <span className={`font-semibold ${isLight ? 'text-stone-950' : 'text-white'}`}>
                    {activeCut.facetsCount} Polished Facets
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-stone-500' : 'text-stone-500'}>Visual Light Signature:</span>
                  <span className={`text-right font-medium max-w-xs ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>
                    {activeCut.opticalSignature}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-stone-500' : 'text-stone-500'}>Best Paired Setting:</span>
                  <span className={`text-right font-medium max-w-xs ${isLight ? 'text-stone-800' : 'text-stone-300'}`}>
                    {activeCut.bestPairedWith}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5.3 GRA Certification & Laser Inscription Card */}
        <div className={`p-8 border grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-xl ${
          isLight
            ? 'bg-stone-900 border-stone-800 text-white'
            : 'bg-stone-900/90 border-stone-800 text-white'
        }`}>
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>Official GRA Certification Guarantee</span>
            </div>
            <h3 className="text-2xl font-editorial font-bold">
              Independent Certification & Micro-Laser Inscription
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Every center stone 1.00 Carat or larger includes an official Global Gemological Research Association (GRA) certificate and a microscopic laser inscription on the girdle. Verifiable with any jeweler’s loupe or our digital serial registry.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => onOpenGraModal('GRA-98241088')}
              className="w-full py-3 px-4 bg-white text-stone-950 text-xs font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>Verify GRA Certificate</span>
            </button>
            <div className="text-[11px] text-stone-400 text-center font-mono">
              Try sample serial: GRA-98241088
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
