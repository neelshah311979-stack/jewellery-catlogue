import React, { useState } from 'react';
import { ArrowDown, ShieldCheck, Star, Sparkles, Video } from 'lucide-react';
import { StoneCutVisualizer } from './StoneCutVisualizer';

interface HeroSectionProps {
  onExploreClick: () => void;
  onRequestCadClick: () => void;
  onOpenVideoClick: () => void;
  onOpenGraClick: () => void;
  live18kGoldRateInr: number;
  themeMode?: 'light' | 'dark';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onRequestCadClick,
  onOpenVideoClick,
  onOpenGraClick,
  live18kGoldRateInr,
  themeMode = 'light',
}) => {
  const isLight = themeMode === 'light';

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const heroPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      title: 'The Royal Oval Solitaire',
      caption: '2.50 CT D-Color VVS1 Moissanite in 18K Yellow Gold',
      tag: 'Editorial Studio',
    },
    {
      url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
      title: 'Worn in Natural Sunlight',
      caption: 'Real client hand-wear with diamond-rivaling fire',
      tag: 'On Hand',
    },
    {
      url: 'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=1200&q=85',
      title: 'Mumbai Atelier Bench',
      caption: 'Master goldsmith hand-forging 4-claw compass prongs',
      tag: 'Craftsmanship',
    },
    {
      url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85',
      title: 'Heirloom Velvet Vault',
      caption: 'Encased with independent GRA certificate & 10x loupe',
      tag: 'Unboxing',
    },
  ];

  return (
    <section className={`relative border-b transition-colors duration-300 overflow-hidden ${
      isLight ? 'bg-[#cfc8bc] border-[#bfb7aa] text-[#1f1a16]' : 'bg-[#151210] border-stone-800 text-[#f2efe9]'
    }`}>
      {/* Background subtle celestial watermark pattern */}
      <div className={`absolute inset-0 [background-size:32px_32px] pointer-events-none ${
        isLight
          ? 'bg-[radial-gradient(#b8b0a2_1px,transparent_1px)] opacity-60'
          : 'bg-[radial-gradient(#292524_1px,transparent_1px)] opacity-40'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Editorial Copy (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Celestial Season Badge */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase">
              <span className="text-[#1f1a16] font-bold">✦ COLLECTION 2025 ✦</span>
              <span aria-hidden="true" className={isLight ? 'text-[#8c8477]' : 'text-stone-600'}>·</span>
              <span className={`font-semibold ${isLight ? 'text-[#423c34]' : 'text-stone-300'}`}>
                MUMBAI ATELIER BENCH
              </span>
              <span aria-hidden="true" className={isLight ? 'text-[#8c8477]' : 'text-stone-600'}>·</span>
              <span className={`flex items-center gap-1 ${isLight ? 'text-[#1f1a16]' : 'text-amber-400'} font-bold`}>
                <Star className="w-3.5 h-3.5 fill-current inline" />
                <span>179 FIVE-STAR REVIEWS</span>
              </span>
            </div>

            {/* Headline matching Celestique reference */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-editorial font-bold tracking-tight leading-[1.06] text-balance ${
              isLight ? 'text-[#1f1a16]' : 'text-white'
            }`}>
              A Celestial Touch For Timeless Moments
            </h1>

            {/* Concise Sub-narrative */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-xl ${
              isLight ? 'text-[#423c34]' : 'text-stone-300'
            }`}>
              Discover exquisite bridal solitaires and fine jewelry crafted to bring enduring grace to your most cherished milestones. Handcrafted in solid 18K gold and certified VVS1 D-Color Moissanite with pure direct atelier pricing.
            </p>

            {/* Primary CTAs: Capsule buttons matching reference */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onExploreClick}
                className={`px-7 py-3.5 font-bold text-xs uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  isLight
                    ? 'bg-[#1f1a16] text-white hover:bg-black'
                    : 'bg-white text-stone-950 hover:bg-stone-200'
                }`}
              >
                <span>Discover Creations</span>
                <span className="text-sm font-bold">➔</span>
              </button>

              <button
                onClick={onRequestCadClick}
                className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs border ${
                  isLight
                    ? 'bg-white/50 border-[#1f1a16]/35 text-[#1f1a16] hover:bg-[#1f1a16] hover:text-white backdrop-blur-xs'
                    : 'bg-stone-900 border-stone-700 text-stone-200 hover:border-amber-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Request Custom CAD Design</span>
              </button>
            </div>

            {/* Quick Category Jump Links with Arrows (Exactly matching Celestique in reference!) */}
            <div className={`pt-4 border-t ${isLight ? 'border-[#b8b0a2]' : 'border-stone-800'}`}>
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#61584c] mb-2">
                Quick Atelier Curations
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold tracking-wider uppercase">
                <button
                  onClick={onExploreClick}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isLight ? 'text-[#1f1a16] hover:text-black underline underline-offset-4 decoration-[#1f1a16]/40' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <span>Solitaires</span>
                  <span>➔</span>
                </button>
                <button
                  onClick={onExploreClick}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isLight ? 'text-[#1f1a16] hover:text-black underline underline-offset-4 decoration-[#1f1a16]/40' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <span>Two-Stone Rings</span>
                  <span>➔</span>
                </button>
                <button
                  onClick={onExploreClick}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isLight ? 'text-[#1f1a16] hover:text-black underline underline-offset-4 decoration-[#1f1a16]/40' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <span>Line Bracelets</span>
                  <span>➔</span>
                </button>
                <button
                  onClick={onOpenGraClick}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isLight ? 'text-[#1f1a16] hover:text-black underline underline-offset-4 decoration-[#1f1a16]/40' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <span>GRA Certified Gems</span>
                  <span>➔</span>
                </button>
              </div>
            </div>

            {/* Concise Metrics Strip */}
            <div className={`pt-4 border-t grid grid-cols-3 gap-3 text-xs ${
              isLight ? 'border-[#b8b0a2]' : 'border-stone-800'
            }`}>
              <div>
                <div className={`text-[10px] uppercase font-mono ${isLight ? 'text-[#61584c]' : 'text-stone-400'}`}>
                  Hardness
                </div>
                <div className={`font-bold font-mono text-sm mt-0.5 ${isLight ? 'text-[#1f1a16]' : 'text-white'}`}>
                  9.25 / 10
                </div>
              </div>
              <div className={`border-l pl-3 ${isLight ? 'border-[#b8b0a2]' : 'border-stone-800'}`}>
                <div className={`text-[10px] uppercase font-mono ${isLight ? 'text-[#61584c]' : 'text-stone-400'}`}>
                  Refractive Fire
                </div>
                <div className={`font-bold font-mono text-sm mt-0.5 ${isLight ? 'text-[#1f1a16]' : 'text-amber-300'}`}>
                  2.65 – 2.69
                </div>
              </div>
              <div className={`border-l pl-3 ${isLight ? 'border-[#b8b0a2]' : 'border-stone-800'}`}>
                <div className={`text-[10px] uppercase font-mono ${isLight ? 'text-[#61584c]' : 'text-stone-400'}`}>
                  18K Purity
                </div>
                <div className={`font-bold font-mono text-xs mt-0.5 ${isLight ? 'text-[#1f1a16]' : 'text-amber-400'}`}>
                  75.0% Solid Gold
                </div>
              </div>
            </div>

          </div>

          {/* Right Luxury Editorial Photoshoot Showcase (5 columns) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className={`w-full border rounded-2xl shadow-xl overflow-hidden group ${
              isLight
                ? 'bg-[#faf8f4] border-[#bfb7aa] text-[#1f1a16]'
                : 'bg-stone-900/80 border-stone-800 text-stone-100'
            }`}>
              
              {/* Header Bar */}
              <div className={`flex items-center justify-between px-4 py-2.5 text-xs border-b ${
                isLight ? 'border-[#ded7ca] bg-[#f2eee7]' : 'border-stone-800 bg-stone-950/80'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1f1a16]" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    Atelier Editorial Gallery
                  </span>
                </div>
                <span className={`font-mono text-[10px] ${
                  isLight ? 'text-[#61584c]' : 'text-stone-400'
                }`}>
                  {heroPhotos[activePhotoIndex].tag}
                </span>
              </div>

              {/* Main Active Editorial Photograph */}
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={heroPhotos[activePhotoIndex].url}
                  alt={heroPhotos[activePhotoIndex].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating caption pill */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#1f1a16]/90 backdrop-blur-md p-3 border border-white/10 text-white rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="font-editorial font-bold text-sm">
                      {heroPhotos[activePhotoIndex].title}
                    </h3>
                    <p className="text-[11px] text-stone-300">
                      {heroPhotos[activePhotoIndex].caption}
                    </p>
                  </div>
                  <button
                    onClick={onOpenVideoClick}
                    className="p-2 border border-white/20 hover:border-white transition-colors cursor-pointer text-amber-300 rounded-lg"
                    title="Book HD Video Viewing"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4 Interactive Thumbnail Selector Tabs */}
              <div className={`grid grid-cols-4 border-t ${
                isLight ? 'border-[#ded7ca] bg-[#faf8f4]' : 'border-stone-800 bg-stone-950'
              }`}>
                {heroPhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`p-2 border-r last:border-r-0 transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      activePhotoIndex === idx
                        ? isLight
                          ? 'bg-[#f2eee7] border-b-2 border-b-[#1f1a16] text-[#1f1a16] font-bold'
                          : 'bg-stone-800 border-b-2 border-b-amber-400 text-white font-bold'
                        : isLight
                          ? 'hover:bg-[#f7f4ee] text-[#7d7467]'
                          : 'hover:bg-stone-900 text-stone-400'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.tag}
                      className="w-10 h-7 object-cover border border-black/10 rounded-xs"
                    />
                    <span className="text-[10px] font-mono whitespace-nowrap">{photo.tag}</span>
                  </button>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
