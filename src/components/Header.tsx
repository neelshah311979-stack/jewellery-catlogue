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
        ? 'bg-[#ded7ca]/95 backdrop-blur-md border-b border-[#cfc8bc] text-[#1f1a16] shadow-xs'
        : 'bg-[#151210]/95 backdrop-blur-md border-b border-stone-800 text-[#f2efe9]'
    }`}>
      {/* 4.1 Top Utility Header */}
      <div className={`border-b px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 text-xs transition-colors ${
        isLight
          ? 'bg-[#ebe5d9] border-[#d8d1c3] text-[#423c34]'
          : 'bg-[#181512] border-stone-800/80 text-stone-300'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Live Gold Rate Tracker Pill - opens full day-by-day tracker modal */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenGoldRateModal}
              className={`flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs transition-colors cursor-pointer whitespace-nowrap px-3 py-1 border rounded-full shadow-xs ${
                isLight
                  ? 'bg-[#faf8f4] text-[#1f1a16] hover:text-black border-[#cfc8bc] hover:border-[#1f1a16]'
                  : 'bg-stone-950 text-stone-200 hover:text-white border-stone-800 hover:border-amber-400/60'
              }`}
              title="Click to see day-by-day gold rate increases/decreases and trend chart"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 inline-block animate-pulse" />
              <span className={`font-semibold hidden sm:inline ${isLight ? 'text-[#61584c]' : 'text-stone-300'}`}>Live Gold Rate (18K):</span>
              <span className={`font-semibold sm:hidden ${isLight ? 'text-[#61584c]' : 'text-stone-300'}`}>18K:</span>
              <span className={`font-bold ${isLight ? 'text-[#1f1a16]' : 'text-amber-300'}`}>₹{live18kGoldRateInr.toLocaleString('en-IN')}/g</span>
              <span className={`hidden md:inline ${isLight ? 'text-[#7d7467]' : 'text-stone-400'}`}>(${usdPerGram}/g)</span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold hidden xs:inline">▲ +₹30</span>
              {isPriceLocked && (
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                  isLight ? 'bg-[#e2dcd0] text-[#1f1a16] border-[#cfc8bc]' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>48h Locked</span>
              )}
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700 ml-0.5 shrink-0" />
            </button>
          </div>

          {/* Right Utility: Theme Switcher, Budget Picker, Currency, Wishlist, Inquiry Bag */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* React Bits SquishSwitch Theme Toggle */}
            {onToggleThemeMode && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full transition-colors ${
                  isLight
                    ? 'border-[#cfc8bc] bg-[#faf8f4] text-[#1f1a16]'
                    : 'border-stone-800 bg-stone-950/90 text-stone-200'
                }`}
              >
                <Sun className={`w-3.5 h-3.5 ${isLight ? 'text-[#b3844d]' : 'text-stone-500'}`} />
                <SquishSwitch
                  checked={!isLight}
                  onChange={(isDark) => {
                    if ((isDark && isLight) || (!isDark && !isLight)) {
                      onToggleThemeMode();
                    }
                  }}
                  ariaLabel="Toggle luxury theme between Cashmere Greige and Midnight Noir"
                  width={46}
                  height={22}
                  radius={11}
                  speed={58}
                  stretch={36}
                  hoverScale={1.05}
                  colorDuration={280}
                  trackColor="#ded7ca"
                  trackOnColor="#1f1a16"
                  thumbColor="#1f1a16"
                  thumbOnColor="#c59d5f"
                />
                <Moon className={`w-3.5 h-3.5 ${!isLight ? 'text-amber-400' : 'text-stone-400'}`} />
                <span className={`text-[11px] font-medium tracking-wide hidden lg:inline ml-0.5 ${
                  isLight ? 'text-[#1f1a16]' : 'text-stone-300'
                }`}>
                  {isLight ? 'Cashmere' : 'Noir'}
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
              isLight ? 'border-[#cfc8bc] bg-[#faf8f4]' : 'border-stone-700 bg-stone-950'
            }`}>
              <button
                onClick={() => onToggleCurrency('INR')}
                className={`px-2 py-0.5 text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                  currency === 'INR'
                    ? (isLight ? 'bg-[#1f1a16] text-white font-bold' : 'bg-amber-400 text-stone-950 font-bold')
                    : (isLight ? 'text-[#61584c] hover:text-[#1f1a16]' : 'text-stone-400 hover:text-stone-200')
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => onToggleCurrency('USD')}
                className={`px-2 py-0.5 text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                  currency === 'USD'
                    ? (isLight ? 'bg-[#1f1a16] text-white font-bold' : 'bg-amber-400 text-stone-950 font-bold')
                    : (isLight ? 'text-[#61584c] hover:text-[#1f1a16]' : 'text-stone-400 hover:text-stone-200')
                }`}
              >
                $ USD
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
              className={`flex items-center gap-1 text-[11px] cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                isLight ? 'text-[#61584c] hover:text-[#1f1a16]' : 'text-stone-300 hover:text-white'
              }`}
              title="View Wishlisted Pieces"
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
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
                isLight
                  ? 'bg-[#1f1a16] text-white hover:bg-black'
                  : 'bg-white text-stone-950 hover:bg-stone-200'
              }`}
              title="View Atelier Inquiry Bag"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">Bag</span>
              <span>({inquiryCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
            }}
            className={`text-lg sm:text-xl font-editorial font-bold tracking-widest whitespace-nowrap shrink-0 transition-colors flex items-center gap-2 ${
              isLight ? 'text-[#1f1a16] hover:text-black' : 'text-white hover:text-amber-400'
            }`}
          >
            <span className="text-sm">✦</span>
            <span>ONE SOUL JEWELLERY</span>
            <span className="text-sm">✦</span>
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className={`hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-medium ${
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
              Engagement Rings
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
              Two-Stone Rings
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
              Line Bracelets
            </button>
            <a
              href="#gemological-mastery"
              className={`transition-colors whitespace-nowrap shrink-0 ${
                isLight ? 'hover:text-stone-950 text-stone-600' : 'hover:text-white text-stone-400'
              }`}
            >
              Gemological Standard
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
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCadModal}
              className={`px-5 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 uppercase tracking-wider cursor-pointer shadow-sm ${
                isLight
                  ? 'bg-[#1f1a16] text-white hover:bg-black'
                  : 'bg-white text-stone-950 hover:bg-stone-200'
              }`}
            >
              Request Custom CAD ➔
            </button>
          </div>
        </div>

        {/* Secondary Category Horizontal Scroll on mobile/tablet */}
        <div className={`lg:hidden flex items-center gap-4 overflow-x-auto pt-3 border-t text-xs whitespace-nowrap pb-1 ${
          isLight ? 'border-stone-200' : 'border-stone-800'
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
