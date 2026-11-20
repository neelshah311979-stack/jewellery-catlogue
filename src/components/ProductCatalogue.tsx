import React, { useState } from 'react';
import { Search, Heart, Sparkles, Filter, Info, ShieldCheck, ArrowRight, Camera, Hand, Layers } from 'lucide-react';
import { JewelryItem, CategoryKey, Currency } from '../types/jewelry';
import { calculateItemPrice, formatCurrency, matchesBudget } from '../utils/pricing';
import { buildWhatsAppUrl } from '../utils/contact';
import { StoneCutVisualizer } from './StoneCutVisualizer';

interface ProductCatalogueProps {
  items: JewelryItem[];
  activeCategory: CategoryKey;
  onSelectCategory: (cat: CategoryKey) => void;
  currency: Currency;
  live18kGoldRateInr: number;
  activeBudget: string;
  onResetBudget: () => void;
  onOpenBudgetModal: () => void;
  onSelectItem: (item: JewelryItem) => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onOpenCadModal: () => void;
  themeMode?: 'light' | 'dark';
}

export const ProductCatalogue: React.FC<ProductCatalogueProps> = ({
  items,
  activeCategory,
  onSelectCategory,
  currency,
  live18kGoldRateInr,
  activeBudget,
  onResetBudget,
  onOpenBudgetModal,
  onSelectItem,
  wishlistIds,
  onToggleWishlist,
  onOpenCadModal,
  themeMode = 'light',
}) => {
  const isLight = themeMode === 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [cardViewModes, setCardViewModes] = useState<Record<string, 'photo' | 'onHand' | 'cut'>>({});

  const categories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: 'All Creations' },
    { key: 'solitaires', label: 'Solitaires' },
    { key: 'engagement-rings', label: 'Engagement Rings' },
    { key: 'toi-et-moi-vintage', label: 'Two-Stone & Vintage' },
    { key: 'fine-bracelets', label: 'Line & Fine Bracelets' },
    { key: 'pendants-necklaces', label: 'Pendants & Necklaces' },
    { key: 'earrings', label: 'Earrings & Studs' },
  ];

  // Filtering by category, budget tier, and search query
  const filteredItems = items.filter((item) => {
    // Category match
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }

    // Calculate base price for budget check
    const basePrice = calculateItemPrice({
      baseGoldWeightGrams: item.baseGoldWeightGrams,
      goldPurity: item.defaultMetal,
      live18kGoldRateInr,
      stoneCostInr: item.baseStoneCostInr,
      makingChargeInr: item.fixedMakingChargeInr,
    }).totalPriceInr;

    if (!matchesBudget(basePrice, activeBudget)) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchShape = item.stoneDetails.shape.toLowerCase().includes(q);
      const matchMetal = item.defaultMetal.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      return matchTitle || matchShape || matchMetal || matchDesc;
    }

    return true;
  });

  return (
    <section id="catalogue" className={`py-16 border-b transition-colors duration-300 relative overflow-hidden ${
      isLight ? 'bg-white border-stone-200 text-[#1f1a16]' : 'bg-[#151210] border-stone-800 text-[#f2efe9]'
    }`}>
      {/* Subtle watermark title behind section header */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.035] overflow-hidden whitespace-nowrap">
        <span className="text-[120px] sm:text-[180px] font-editorial font-bold uppercase tracking-widest">
          Creations
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Section Heading & Category Tabs */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 ${
          isLight ? 'border-stone-200' : 'border-stone-800'
        }`}>
          <div>
            <div className={`text-xs font-mono uppercase tracking-widest mb-1.5 ${
              isLight ? 'text-[#1f1a16] font-bold' : 'text-amber-400'
            }`}>
              ✦ CURATED ATELIER ARCHIVE ✦
            </div>
            <h2 className={`text-3xl sm:text-4xl font-editorial font-bold tracking-tight uppercase ${
              isLight ? 'text-[#1f1a16]' : 'text-white'
            }`}>
              Our Most Loved Creations
            </h2>
            <p className={`text-xs mt-1.5 max-w-lg ${
              isLight ? 'text-stone-600' : 'text-stone-400'
            }`}>
              Explore our celebrated bridal solitaires, rings, and fine line jewelry. Every creation features authentic 18K solid gold, certified VVS1 Moissanite, and direct formula pricing.
            </p>
          </div>

          {/* Search & Budget Filter Action */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="relative flex-1 min-w-0 sm:flex-initial">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cuts, carats, styles..."
                className={`pl-9 pr-3 py-2 text-xs border rounded-full focus:outline-hidden w-full sm:w-60 transition-colors ${
                  isLight
                    ? 'border-stone-200 bg-white text-[#1f1a16] placeholder:text-stone-400 focus:border-[#1f1a16]'
                    : 'border-stone-800 bg-stone-900/90 text-stone-100 placeholder:text-stone-500 focus:border-amber-400'
                }`}
              />
              <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${
                isLight ? 'text-stone-400' : 'text-stone-400'
              }`} />
            </div>

            <button
              onClick={onOpenBudgetModal}
              className={`px-3.5 sm:px-4 py-2 text-xs border rounded-full transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-xs ${
                activeBudget !== 'all'
                  ? isLight
                    ? 'border-[#1f1a16] bg-[#1f1a16] text-white font-bold'
                    : 'border-amber-400 bg-amber-400 text-stone-950 font-bold'
                  : isLight
                    ? 'border-stone-200 hover:border-[#1f1a16] text-[#1f1a16] bg-white'
                    : 'border-stone-700 hover:border-stone-500 text-stone-200 bg-stone-900'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{activeBudget === 'all' ? 'Budget Filter' : 'Budget Active'}</span>
            </button>
          </div>
        </div>

        {/* Category Segmented Nav */}
        <div className={`flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b text-xs ${
          isLight ? 'border-stone-200' : 'border-stone-800'
        }`}>
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => onSelectCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? isLight
                        ? 'bg-[#1f1a16] text-white font-bold shadow-xs'
                        : 'bg-stone-100 text-stone-950 font-bold'
                      : isLight
                        ? 'text-stone-600 hover:text-[#1f1a16] hover:bg-stone-100'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Active Budget Pill with Reset */}
          {activeBudget !== 'all' && (
            <div className={`flex items-center gap-2 text-xs shrink-0 ${
              isLight ? 'text-[#61584c]' : 'text-stone-400'
            }`}>
              <span className={`font-medium ${isLight ? 'text-[#1f1a16]' : 'text-amber-300'}`}>Filtered by budget</span>
              <button
                onClick={onResetBudget}
                className={`underline text-[11px] cursor-pointer ${
                  isLight ? 'text-[#1f1a16] hover:text-black' : 'text-stone-400 hover:text-white'
                }`}
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Product Grid (3-column desktop per Section 2.A of retail design) */}
        {filteredItems.length === 0 ? (
          <div className={`text-center py-20 border border-dashed p-8 space-y-3 ${
            isLight
              ? 'border-stone-300 bg-white'
              : 'border-stone-800 bg-stone-900/30'
          }`}>
            <div className={`text-sm ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
              No jewellery items matched your active filters.
            </div>
            <div className={`text-xs ${isLight ? 'text-stone-500' : 'text-stone-500'}`}>
              Try resetting your search query or selecting a different budget tier.
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  onResetBudget();
                  onSelectCategory('all');
                }}
                className={`px-4 py-2 font-semibold text-xs uppercase tracking-wider cursor-pointer ${
                  isLight
                    ? 'bg-stone-950 text-white hover:bg-stone-850'
                    : 'bg-stone-100 text-stone-950 hover:bg-stone-200'
                }`}
              >
                Reset All Filters
              </button>
              <button
                onClick={onOpenCadModal}
                className={`px-4 py-2 border text-xs uppercase tracking-wider cursor-pointer ${
                  isLight
                    ? 'border-stone-300 text-stone-800 hover:border-stone-950'
                    : 'border-stone-700 text-stone-200 hover:border-amber-400'
                }`}
              >
                Commission Bespoke Design
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const pricing = calculateItemPrice({
                baseGoldWeightGrams: item.baseGoldWeightGrams,
                goldPurity: item.defaultMetal,
                live18kGoldRateInr,
                stoneCostInr: item.baseStoneCostInr,
                makingChargeInr: item.fixedMakingChargeInr,
              });

              const isWishlisted = wishlistIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`group transition-all duration-300 flex flex-col justify-between border rounded-2xl overflow-hidden shadow-xs hover:shadow-md ${
                    isLight
                      ? 'bg-white border-stone-200 hover:border-[#1f1a16]'
                      : 'bg-[#181512] border-stone-800 hover:border-stone-600 shadow-lg'
                  }`}
                >
                  {/* Visual Top Container with Real Photography & View Switcher */}
                  <div className="relative">
                    {/* Visual Frame */}
                    <div
                      onClick={() => onSelectItem(item)}
                      className="cursor-pointer overflow-hidden relative aspect-4/3 bg-stone-50"
                    >
                      {(!cardViewModes[item.id] || cardViewModes[item.id] === 'photo') && item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : cardViewModes[item.id] === 'onHand' && item.onHandImageUrl ? (
                        <img
                          src={item.onHandImageUrl}
                          alt={`${item.title} on hand`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <StoneCutVisualizer
                          cutType={item.visualTag}
                          caratText={`${item.baseCaratWeight} CT`}
                          metalTone={item.defaultTone}
                          enableLoupe={false}
                          className="w-full h-full transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      )}
                    </div>

                    {/* View Switcher Pills (Photo / On-Hand / 3D Cut) */}
                    <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 bg-[#1f1a16]/80 backdrop-blur-xs p-0.5 rounded-full border border-white/20 text-[10px] text-white">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCardViewModes((prev) => ({ ...prev, [item.id]: 'photo' }));
                        }}
                        className={`px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer ${
                          (!cardViewModes[item.id] || cardViewModes[item.id] === 'photo')
                            ? 'bg-white text-stone-950 font-bold'
                            : 'hover:text-white/80'
                        }`}
                        title="Studio Photo"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Photo</span>
                      </button>

                      {item.onHandImageUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardViewModes((prev) => ({ ...prev, [item.id]: 'onHand' }));
                          }}
                          className={`px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer ${
                            cardViewModes[item.id] === 'onHand'
                              ? 'bg-white text-stone-950 font-bold'
                              : 'hover:text-white/80'
                          }`}
                          title="On Hand View"
                        >
                          <Hand className="w-3 h-3" />
                          <span>On Hand</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCardViewModes((prev) => ({ ...prev, [item.id]: 'cut' }));
                        }}
                        className={`px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer ${
                          cardViewModes[item.id] === 'cut'
                            ? 'bg-white text-stone-950 font-bold'
                            : 'hover:text-white/80'
                        }`}
                        title="3D Facet Geometry"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>3D Cut</span>
                      </button>
                    </div>

                    {/* Wishlist Heart */}
                    <button
                      onClick={() => onToggleWishlist(item.id)}
                      className={`absolute top-3 right-3 p-1.5 rounded-full border shadow-xs transition-colors cursor-pointer z-10 ${
                        isLight
                          ? 'bg-white/95 hover:bg-white text-stone-600 hover:text-rose-600 border-stone-200'
                          : 'bg-stone-950/80 hover:bg-stone-900 text-stone-400 hover:text-rose-500 border-stone-800'
                      }`}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Optional Badge */}
                    {item.badge && (
                      <div className={`absolute top-3 left-3 text-[10px] tracking-wider uppercase px-2.5 py-0.5 font-bold rounded-full z-10 ${
                        isLight
                          ? 'bg-[#1f1a16] text-white shadow-xs'
                          : 'bg-amber-400 text-stone-950'
                      }`}>
                        {item.badge}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Unboxed metadata */}
                      <div className={`flex items-center gap-2 text-[11px] font-mono ${
                        isLight ? 'text-[#61584c]' : 'text-stone-400'
                      }`}>
                        <span className={isLight ? 'text-[#423c34]' : 'text-stone-300'}>
                          {item.stoneDetails.shape}
                        </span>
                        <span aria-hidden="true" className={isLight ? 'text-[#b8b0a2]' : 'text-stone-600'}>·</span>
                        <span className={`font-semibold ${isLight ? 'text-[#1f1a16]' : 'text-amber-300'}`}>
                          {item.defaultMetal}
                        </span>
                        <span aria-hidden="true" className={isLight ? 'text-[#b8b0a2]' : 'text-stone-600'}>·</span>
                        <span className={isLight ? 'text-[#61584c]' : 'text-stone-400'}>
                          {item.baseGoldWeightGrams}g Solid Gold
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <h3
                        onClick={() => onSelectItem(item)}
                        className={`text-lg font-editorial font-bold mt-1.5 cursor-pointer uppercase tracking-tight transition-colors ${
                          isLight
                            ? 'text-[#1f1a16] group-hover:text-black'
                            : 'text-white group-hover:text-amber-300'
                        }`}
                      >
                        {item.title}
                      </h3>

                      <p className={`text-xs mt-1 line-clamp-2 ${
                        isLight ? 'text-[#61584c]' : 'text-stone-400'
                      }`}>
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Transparent Price Card & Formula Preview */}
                    <div className={`p-3 border rounded-xl space-y-1.5 ${
                      isLight
                        ? 'bg-stone-50 border-stone-200'
                        : 'bg-[#221c18] border-stone-800'
                    }`}>
                      <div className="flex items-baseline justify-between">
                        <span className={`text-[11px] uppercase tracking-wider ${
                          isLight ? 'text-stone-500 font-medium' : 'text-stone-400'
                        }`}>
                          Atelier Price
                        </span>
                        <span className={`font-mono font-bold text-base tabular-nums ${
                          isLight ? 'text-[#1f1a16]' : 'text-amber-300'
                        }`}>
                          {formatCurrency(pricing.totalPriceInr, currency)}
                        </span>
                      </div>

                      <div className={`text-[10px] font-mono flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 border-t pt-1 ${
                        isLight
                          ? 'text-stone-600 border-stone-200'
                          : 'text-stone-400 border-stone-800'
                      }`}>
                        <span>Gold: {formatCurrency(pricing.goldComponentInr, currency)}</span>
                        <span>Stone: {formatCurrency(pricing.stoneComponentInr, currency)}</span>
                        <span>Making: {formatCurrency(pricing.makingChargeInr, currency)}</span>
                      </div>
                    </div>

                    {/* CTA Actions */}
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => onSelectItem(item)}
                        className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                          isLight
                            ? 'bg-[#1f1a16] text-white hover:bg-black'
                            : 'bg-white text-stone-950 hover:bg-stone-200'
                        }`}
                      >
                        <span>Anatomy & Specs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={buildWhatsAppUrl(`Hello One Soul Jewellery, inquiring about ${item.title}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`py-2.5 px-4 border text-xs font-medium rounded-full transition-colors cursor-pointer ${
                          isLight
                            ? 'border-stone-200 hover:border-[#1f1a16] text-[#1f1a16] bg-white hover:bg-stone-50'
                            : 'border-stone-700 hover:border-amber-400 text-stone-200 hover:text-white bg-stone-900'
                        }`}
                        title="Quick WhatsApp Inquiry"
                      >
                        Inquire
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
