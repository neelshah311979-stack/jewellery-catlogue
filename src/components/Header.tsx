import React, { useState } from 'react';
import { Heart, ShoppingBag, Video, Sparkles, TrendingUp, ChevronDown, Check, Sun, Moon } from 'lucide-react';
import SquishSwitch from './SquishSwitch';
import { Currency, CategoryKey } from '../types/jewelry';

interface HeaderProps {
  currency: Currency;
  onToggleCurrency: (c: Currency) => void;
  live18kGoldRateInr: number;
  onUpdateGoldRate: (rate: number) => void;
  activeCategory: CategoryKey;
  onSelectCategory: (cat: CategoryKey) => void;
  inquiryCount: number;
  onOpenInquiryDrawer: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenVideoModal: () => void;
  onOpenCadModal: () => void;
  onOpenBudgetModal: () => void;
  onOpenGoldRateModal: () => void;
  isPriceLocked: boolean;
  themeMode?: 'light' | 'dark';
  onToggleThemeMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onToggleCurrency,
  live18kGoldRateInr,
  onUpdateGoldRate,
  activeCategory,
  onSelectCategory,
  inquiryCount,
  onOpenInquiryDrawer,
  wishlistCount,
  onOpenWishlist,
  onOpenVideoModal,
  onOpenCadModal,
  onOpenBudgetModal,
  onOpenGoldRateModal,
  isPriceLocked,
  themeMode = 'light',
  onToggleThemeMode,
}) => {
  const usdPerGram = Math.round(live18kGoldRateInr / 84.5);
  const isLight = themeMode === 'light';

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 ${
      isLight
        ? 'bg-white/95 backdrop-blur-md border-b border-stone-200 text-[#1f1a16] shadow-xs'
        : 'bg-[#151210]/95 backdrop-blur-md border-b border-stone-800 text-[#f2efe9]'
    }`}>
      {/* 4.1 Top Utility Header */}
      <div className={`border-b px-2.5 sm:px-6 lg:px-8 py-1.5 sm:py-2 text-xs transition-colors ${
        isLight
          ? 'bg-white border-stone-200 text-stone-700'
          : 'bg-[#181512] border-stone-800/80 text-stone-300'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-1.5 sm:gap-4 min-w-0">
          
          {/* Live Gold Rate Tracker Pill - opens full day-by-day tracker modal */}
          <div className="flex items-center gap-1 min-w-0">
            <button
              onClick={onOpenGoldRateModal}
              className={`flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs transition-colors cursor-pointer whitespace-nowrap px-2 sm:px-3 py-1 border rounded-full shadow-xs ${
                isLight
                  ? 'bg-stone-50 text-[#1f1a16] hover:text-black border-stone-200 hover:border-[#1f1a16]'
                  : 'bg-stone-950 text-stone-200 hover:text-white border-stone-800 hover:border-amber-400/60'
              }`}
              title="Click to see day-by-day gold rate increases/decreases and trend chart"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-600 shrink-0 inline-block animate-pulse" />
              <span className={`font-semibold hidden sm:inline ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>Live Gold Rate (18K):</span>
              <span className={`font-semibold sm:hidden ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>18K:</span>
              <span className={`font-bold ${isLight ? 'text-[#1f1a16]' : 'text-amber-300'}`}>₹{live18kGoldRateInr.toLocaleString('en-IN')}/g</span>
              <span className={`hidden md:inline ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>(${usdPerGram}/g)</span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold hidden md:inline">▲ +₹30</span>
              {isPriceLocked && (
                <span className={`ml-0.5 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                  isLight ? 'bg-stone-100 text-[#1f1a16] border-stone-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>48h</span>
              )}
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700 ml-0.5 shrink-0" />
            </button>
          </div>

          {/* Right Utility: Theme Switcher, Budget Picker, Currency, Wishlist, Inquiry Bag */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            {/* React Bits SquishSwitch Theme Toggle */}
            {onToggleThemeMode && (
              <div
                className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 border rounded-full transition-colors ${
                  isLight
                    ? 'border-stone-200 bg-stone-50 text-[#1f1a16]'
                    : 'border-stone-800 bg-stone-950/90 text-stone-200'
                }`}
              >
                <Sun className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isLight ? 'text-[#b3844d]' : 'text-stone-500'}`} />
                <SquishSwitch
                  checked={!isLight}
                  onChange={(isDark) => {
                    if ((isDark && isLight) || (!isDark && !isLight)) {
                      onToggleThemeMode();
                    }
                  }}
                  ariaLabel="Toggle luxury theme between Pure White and Midnight Noir"
                  width={40}
                  height={20}
                  radius={10}
                  speed={58}
                  stretch={36}
                  hoverScale={1.05}
                  colorDuration={280}
                  trackColor="#e5e5e4"
                  trackOnColor="#1f1a16"
                  thumbColor="#1f1a16"
                  thumbOnColor="#c59d5f"
                />
                <Moon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${!isLight ? 'text-amber-400' : 'text-stone-400'}`} />
                <span className={`text-[11px] font-medium tracking-wide hidden lg:inline ml-0.5 ${
                  isLight ? 'text-[#1f1a16]' : 'text-stone-300'
                }`}>
                  {isLight ? 'White' : 'Noir'}
                </span>
              </div>
            )}

            {/* Best Picks for Budget Button */}
            <button
              onClick={onOpenBudgetModal}
              className={`text-[11px] sm:text-xs font-medium hidden sm:flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors ${
                isLight ? 'text-stone-700 hover:text-stone-950' : 'text-stone-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Budget Picks</span>
            </button>

            {/* Currency Switcher */}
            <div className={`flex items-center border rounded-full overflow-hidden shrink-0 ${
              isLight ? 'border-stone-200 bg-stone-50' : 'border-stone-700 bg-stone-950'
            }`}>
              <button
                onClick={() => onToggleCurrency('INR')}
                className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                  currency === 'INR'
                    ? (isLight ? 'bg-[#1f1a16] text-white font-bold' : 'bg-amber-400 text-stone-950 font-bold')
                    : (isLight ? 'text-stone-600 hover:text-[#1f1a16]' : 'text-stone-400 hover:text-stone-200')
                }`}
              >
                ₹<span className="hidden sm:inline"> INR</span>
              </button>
              <button
                onClick={() => onToggleCurrency('USD')}
                className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                  currency === 'USD'
                    ? (isLight ? 'bg-[#1f1a16] text-white font-bold' : 'bg-amber-400 text-stone-950 font-bold')
                    : (isLight ? 'text-stone-600 hover:text-[#1f1a16]' : 'text-stone-400 hover:text-stone-200')
                }`}
              >
                $<span className="hidden sm:inline"> USD</span>
              </button>
            </div>

            {/* Video Call Quick Link */}
            <button
              onClick={onOpenVideoModal}
              className={`hidden md:flex items-center gap-1 text-[11px] font-medium cursor-pointer whitespace-nowrap transition-colors ${
                isLight ? 'text-[#61584c] hover:text-[#1f1a16]' : 'text-stone-300 hover:text-white'
              }`}
              title="Book 1-on-1 HD Video Consultation"
            >
              <Video className="w-3.5 h-3.5 text-[#b3844d]" />
              <span>Video Call</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className={`flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] cursor-pointer whitespace-nowrap shrink-0 transition-colors px-1 ${
                isLight ? 'text-[#61584c] hover:text-[#1f1a16]' : 'text-stone-300 hover:text-white'
              }`}
              title="View Wishlisted Pieces"
              aria-label={`Wishlist (${wishlistCount})`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className={`font-bold ${isLight ? 'text-[#1f1a16]' : 'text-amber-400'}`}>({wishlistCount})</span>
              )}
            </button>

            {/* Inquiry Bag */}
            <button
              onClick={onOpenInquiryDrawer}
              className={`flex items-center gap-1 px-2.5 sm:px-4 py-1 sm:py-1.5 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
                isLight
                  ? 'bg-[#1f1a16] text-white hover:bg-black'
                  : 'bg-white text-stone-950 hover:bg-stone-200'
              }`}
              title="View Atelier Inquiry Bag"
              aria-label={`Bag (${inquiryCount})`}
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Bag</span>
              <span>({inquiryCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones separated cleanly on mobile & desktop */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 xl:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 xl:gap-5 min-w-0">
          
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
            }}
            className={`text-sm sm:text-base xl:text-lg font-editorial font-bold tracking-wider xl:tracking-widest min-w-0 truncate lg:shrink-0 transition-colors flex items-center gap-1 sm:gap-1.5 ${
              isLight ? 'text-[#1f1a16] hover:text-black' : 'text-white hover:text-amber-400'
            }`}
          >
            <span className="text-xs sm:text-sm shrink-0">✦</span>
            <span className="truncate">ONE SOUL JEWELLERY</span>
            <span className="text-xs sm:text-sm shrink-0">✦</span>
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className={`hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10px] xl:text-[11px] uppercase tracking-wide font-medium min-w-0 ${
            isLight ? 'text-stone-600' : 'text-stone-400'
          }`}>
            <button
              onClick={() => onSelectCategory('all')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isLight ? 'hover:text-stone-950' : 'hover:text-white'
              } ${
                activeCategory === 'all'
                  ? isLight ? 'text-amber-700 font-bold border-b-2 border-amber-700 pb-0.5' : 'text-amber-400 font-bold border-b border-amber-400 pb-0.5'
                  : ''
              }`}
            >
              All Pieces
            </button>
            <a
              href="#3d-experience"
              className={`font-bold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                isLight ? 'text-amber-700 hover:text-amber-800' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <span>3D Atelier</span>
            </a>
            <button
              onClick={() => onSelectCategory('solitaires')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isLight ? 'hover:text-stone-950' : 'hover:text-white'
              } ${
                activeCategory === 'solitaires'
                  ? isLight ? 'text-amber-700 font-bold border-b-2 border-amber-700 pb-0.5' : 'text-amber-400 font-bold border-b border-amber-400 pb-0.5'
                  : ''
              }`}
            >
              Solitaires
            </button>
            <button
              onClick={() => onSelectCategory('engagement-rings')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isLight ? 'hover:text-stone-950' : 'hover:text-white'
              } ${
                activeCategory === 'engagement-rings'
                  ? isLight ? 'text-amber-700 font-bold border-b-2 border-amber-700 pb-0.5' : 'text-amber-400 font-bold border-b border-amber-400 pb-0.5'
                  : ''
              }`}
            >
              Engagement
            </button>
            <button
              onClick={() => onSelectCategory('toi-et-moi-vintage')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isLight ? 'hover:text-stone-950' : 'hover:text-white'
              } ${
                activeCategory === 'toi-et-moi-vintage'
                  ? isLight ? 'text-amber-700 font-bold border-b-2 border-amber-700 pb-0.5' : 'text-amber-400 font-bold border-b border-amber-400 pb-0.5'
                  : ''
              }`}
            >
              Two-Stone
            </button>
            <button
              onClick={() => onSelectCategory('fine-bracelets')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isLight ? 'hover:text-stone-950' : 'hover:text-white'
              } ${
                activeCategory === 'fine-bracelets'
                  ? isLight ? 'text-amber-700 font-bold border-b-2 border-amber-700 pb-0.5' : 'text-amber-400 font-bold border-b border-amber-400 pb-0.5'
                  : ''
              }`}
            >
              Bracelets
            </button>
            <a
              href="#gemological-mastery"
              className={`transition-colors whitespace-nowrap shrink-0 ${
                isLight ? 'hover:text-stone-950 text-stone-600' : 'hover:text-white text-stone-400'
              }`}
            >
              Gemology
            </a>
            <a
              href="#reviews-love-stories"
              className={`transition-colors whitespace-nowrap shrink-0 ${
                isLight ? 'hover:text-stone-950 text-stone-600' : 'hover:text-white text-stone-400'
              }`}
            >
              Love Stories
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCadModal}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 uppercase tracking-wider cursor-pointer shadow-sm ${
                isLight
                  ? 'bg-[#1f1a16] text-white hover:bg-black'
                  : 'bg-white text-stone-950 hover:bg-stone-200'
              }`}
            >
              <span className="xl:hidden">Custom CAD ➔</span>
              <span className="hidden xl:inline">Request Custom CAD ➔</span>
            </button>
          </div>
        </div>

        {/* Secondary Category Horizontal Scroll on mobile/tablet */}
        <div className={`lg:hidden flex items-center gap-3.5 w-full max-w-full min-w-0 overflow-x-auto pt-2.5 mt-2 border-t text-xs whitespace-nowrap pb-1 ${
          isLight ? 'border-stone-300/70' : 'border-stone-800'
        }`}>
          <button
            onClick={() => onSelectCategory('all')}
            className={`py-1 cursor-pointer ${
              activeCategory === 'all'
                ? isLight ? 'font-bold text-amber-700 border-b-2 border-amber-700' : 'font-bold text-amber-400 border-b border-amber-400'
                : isLight ? 'text-stone-600' : 'text-stone-400'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onSelectCategory('solitaires')}
            className={`py-1 cursor-pointer ${
              activeCategory === 'solitaires'
                ? isLight ? 'font-bold text-amber-700 border-b-2 border-amber-700' : 'font-bold text-amber-400 border-b border-amber-400'
                : isLight ? 'text-stone-600' : 'text-stone-400'
            }`}
          >
            Solitaires
          </button>
          <button
            onClick={() => onSelectCategory('engagement-rings')}
            className={`py-1 cursor-pointer ${
              activeCategory === 'engagement-rings'
                ? isLight ? 'font-bold text-amber-700 border-b-2 border-amber-700' : 'font-bold text-amber-400 border-b border-amber-400'
                : isLight ? 'text-stone-600' : 'text-stone-400'
            }`}
          >
            Engagement
          </button>
          <button
            onClick={() => onSelectCategory('toi-et-moi-vintage')}
            className={`py-1 cursor-pointer ${
              activeCategory === 'toi-et-moi-vintage'
                ? isLight ? 'font-bold text-amber-700 border-b-2 border-amber-700' : 'font-bold text-amber-400 border-b border-amber-400'
                : isLight ? 'text-stone-600' : 'text-stone-400'
            }`}
          >
            Two-Stone
          </button>
          <button
            onClick={() => onSelectCategory('fine-bracelets')}
            className={`py-1 cursor-pointer ${
              activeCategory === 'fine-bracelets'
                ? isLight ? 'font-bold text-amber-700 border-b-2 border-amber-700' : 'font-bold text-amber-400 border-b border-amber-400'
                : isLight ? 'text-stone-600' : 'text-stone-400'
            }`}
          >
            Line Bracelets
          </button>
          <button
            onClick={() => onSelectCategory('pendants-necklaces')}
            className={`py-1 cursor-pointer ${
              activeCategory === 'pendants-necklaces'
                ? isLight ? 'font-bold text-amber-700 border-b-2 border-amber-700' : 'font-bold text-amber-400 border-b border-amber-400'
                : isLight ? 'text-stone-600' : 'text-stone-400'
            }`}
          >
            Pendants
          </button>
          <button
            onClick={() => onSelectCategory('earrings')}
            className={`py-1 cursor-pointer ${
              activeCategory === 'earrings'
                ? isLight ? 'font-bold text-amber-700 border-b-2 border-amber-700' : 'font-bold text-amber-400 border-b border-amber-400'
                : isLight ? 'text-stone-600' : 'text-stone-400'
            }`}
          >
            Earrings
          </button>
          <a
            href="#gemological-mastery"
            className={`py-1 ${isLight ? 'text-stone-600' : 'text-stone-400'}`}
          >
            Gemological Standard
          </a>
        </div>
      </div>
    </header>
  );
};
