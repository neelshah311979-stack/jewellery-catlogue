import React, { useState } from 'react';
import { Sparkles, ZoomIn, ArrowUpRight, X } from 'lucide-react';
import { ATELIER_MEDIA } from '../data/atelierMedia';

interface LookbookItem {
  id: string;
  title: string;
  category: 'bridal' | 'lifestyle' | 'craft' | 'bracelets';
  categoryLabel: string;
  imageUrl: string;
  caption: string;
  catalogTargetId?: string;
  focalClass?: string;
}

const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'lb-1',
    title: 'The Royal Oval in Golden Sunlight',
    category: 'lifestyle',
    categoryLabel: 'On-Hand Lifestyle',
    imageUrl: ATELIER_MEDIA.solitaireOnHand,
    caption: 'Natural sun refraction on 18K solid yellow gold band with 2.50 CT D-VVS1 oval.',
    catalogTargetId: 'os-ring-01',
  },
  {
    id: 'lb-2',
    title: 'Emerald Cut Solitaire on Velvet',
    category: 'bridal',
    categoryLabel: 'Bridal Solitaire',
    imageUrl: ATELIER_MEDIA.emeraldSolitaireVelvet,
    caption: '3.00 CT step-cut mirror facets set in minimalist 4-claw platinum mount.',
    catalogTargetId: 'os-ring-02',
    focalClass: 'object-[50%_72%]',
  },
  {
    id: 'lb-3',
    title: 'Precision Diamond Line Bracelet Drape',
    category: 'bracelets',
    categoryLabel: 'Eternity & Line',
    imageUrl: ATELIER_MEDIA.tennisLineBracelet,
    caption: 'Articulated 18K yellow gold links with seamless fluid wrist drape.',
    catalogTargetId: 'os-brc-01',
  },
  {
    id: 'lb-4',
    title: 'Mumbai Atelier Hand-Forging Bench',
    category: 'craft',
    categoryLabel: 'Atelier Craft',
    imageUrl: ATELIER_MEDIA.mumbaiAtelierBench,
    caption: 'Master goldsmith hand-setting micro-pavé shoulder diamonds with 10x binocular scope.',
  },
  {
    id: 'lb-5',
    title: 'Two-Stone Bypass Bridal Harmony',
    category: 'bridal',
    categoryLabel: 'Bridal Solitaire',
    imageUrl: ATELIER_MEDIA.twoStoneBypass,
    caption: 'Pear and Emerald cuts meeting in an asymmetrical yellow gold band.',
    catalogTargetId: 'os-ring-03',
  },
  {
    id: 'lb-6',
    title: 'Royal Solitaire Studio Macro',
    category: 'bridal',
    categoryLabel: 'Bridal Solitaire',
    imageUrl: ATELIER_MEDIA.ovalSolitaireStudio,
    caption: 'Hearts & Arrows facet symmetry displaying vibrant prismatic caustics on marble.',
    catalogTargetId: 'os-ring-01',
  },
];

interface AtelierLookbookProps {
  themeMode?: 'light' | 'dark';
  onSelectItemById?: (id: string) => void;
}

export const AtelierLookbook: React.FC<AtelierLookbookProps> = ({
  themeMode = 'light',
  onSelectItemById,
}) => {
  const isLight = themeMode === 'light';
  const [filter, setFilter] = useState<'all' | 'bridal' | 'lifestyle' | 'bracelets' | 'craft'>('all');
  const [zoomedImage, setZoomedImage] = useState<LookbookItem | null>(null);

  const filteredItems = filter === 'all'
    ? LOOKBOOK_ITEMS
    : LOOKBOOK_ITEMS.filter((item) => item.category === filter);

  return (
    <section className={`py-20 border-t transition-colors duration-300 ${
      isLight ? 'bg-white border-stone-200' : 'bg-[#151210] border-stone-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header with image-first focus */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className={`text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-1.5 ${
              isLight ? 'text-[#1f1a16] font-bold' : 'text-amber-400'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>✦ EDITORIAL LOOKBOOK · VISUAL JOURNAL ✦</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-editorial font-bold tracking-tight uppercase ${
              isLight ? 'text-[#1f1a16]' : 'text-white'
            }`}>
              The One Soul Visual Journal
            </h2>
            <p className={`mt-2 text-xs sm:text-sm ${
              isLight ? 'text-[#5c5448]' : 'text-stone-400'
            }`}>
              Captured in real sunlight, on human hands, and inside our Mumbai workshop. Pure optical fire without filters.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'bridal', label: 'Bridal Rings' },
              { id: 'lifestyle', label: 'On-Hand' },
              { id: 'bracelets', label: 'Line Jewelry' },
              { id: 'craft', label: 'Atelier Bench' },
            ].map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as typeof filter)}
                  className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap border ${
                    active
                      ? isLight
                        ? 'bg-[#1f1a16] text-white border-[#1f1a16] font-bold shadow-xs'
                        : 'bg-white text-stone-950 border-white font-bold shadow-xs'
                      : isLight
                        ? 'bg-white text-stone-600 border-stone-200 hover:text-[#1f1a16] hover:bg-stone-50'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white hover:border-stone-700'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden border rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
              }`}
              onClick={() => setZoomedImage(item)}
            >
              {/* Aspect 4/5 photo container */}
              <div className="aspect-4/5 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className={`w-full h-full object-cover ${item.focalClass ?? 'object-center'} group-hover:scale-105 transition-transform duration-700`}
                />
                
                {/* Floating Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-black/60 text-white backdrop-blur-md rounded-xs">
                    {item.categoryLabel}
                  </span>
                </div>

                {/* Hover / mobile bottom overlay with quick actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5 text-white">
                  <h3 className="font-editorial text-base sm:text-lg font-bold leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-200 mt-1 line-clamp-2">
                    {item.caption}
                  </p>

                  <div className="flex items-center gap-2 mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-white/20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedImage(item);
                      }}
                      className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-amber-300 hover:text-white cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Full View</span>
                    </button>

                    {item.catalogTargetId && onSelectItemById && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItemById(item.catalogTargetId!);
                        }}
                        className="ml-auto flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider bg-white/20 hover:bg-white text-white hover:text-stone-950 px-2.5 py-1 transition-colors cursor-pointer"
                      >
                        <span>View Piece</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-8 animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[94dvh] flex flex-col bg-stone-950 text-white border border-stone-800 overflow-hidden shadow-2xl rounded-xl sm:rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-stone-800 bg-stone-900/80 gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                  {zoomedImage.categoryLabel}
                </span>
                <h3 className="text-sm sm:text-lg font-editorial font-bold truncate">
                  {zoomedImage.title}
                </h3>
              </div>
              <button
                onClick={() => setZoomedImage(null)}
                className="p-1.5 text-stone-300 hover:text-white transition-colors cursor-pointer shrink-0 rounded-full bg-stone-800/80"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo */}
            <div className="flex-1 min-h-0 overflow-auto flex items-center justify-center bg-black/50 p-2 sm:p-4">
              <img
                src={zoomedImage.imageUrl}
                alt={zoomedImage.title}
                className="max-h-[58dvh] sm:max-h-[68vh] w-auto object-contain mx-auto shadow-2xl"
              />
            </div>

            {/* Caption & Action */}
            <div className="p-4 bg-stone-900/90 border-t border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <p className="text-stone-300">
                {zoomedImage.caption}
              </p>
              {zoomedImage.catalogTargetId && onSelectItemById && (
                <button
                  onClick={() => {
                    const id = zoomedImage.catalogTargetId!;
                    setZoomedImage(null);
                    onSelectItemById(id);
                  }}
                  className="shrink-0 px-4 py-2 bg-amber-400 text-stone-950 font-bold uppercase tracking-wider text-xs hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore In Catalogue</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
