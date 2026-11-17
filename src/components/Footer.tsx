import React from 'react';
import { Video, ShieldCheck, Star, Sparkles, Ruler, Compass, MessageCircle, Phone, Mail, MapPin, Sun, Moon } from 'lucide-react';
import SquishSwitch from './SquishSwitch';

interface FooterProps {
  onOpenVideoModal: () => void;
  onOpenCadModal: () => void;
  onOpenGraModal: () => void;
  onSelectCategory: (category: any) => void;
  themeMode?: 'light' | 'dark';
  onToggleThemeMode?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenVideoModal,
  onOpenCadModal,
  onOpenGraModal,
  onSelectCategory,
  themeMode = 'light',
  onToggleThemeMode,
}) => {
  const isLight = themeMode === 'light';

  return (
    <footer className={`border-t transition-colors duration-300 ${
      isLight ? 'bg-white border-stone-200 text-stone-700' : 'bg-stone-950 border-stone-800 text-stone-300'
    }`}>
      {/* 7.3 "The OneSoul Experience" 3x2 Grid */}
      <div className={`border-b ${isLight ? 'border-[#ded7ca] bg-[#e8e2d4]' : 'border-stone-800 bg-stone-900/60'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className={`text-xs font-mono uppercase tracking-widest mb-1.5 ${
              isLight ? 'text-[#1f1a16] font-bold' : 'text-amber-400'
            }`}>
              ✦ ATELIER CONCIERGE STANDARDS ✦
            </div>
            <h3 className={`text-2xl sm:text-3xl font-editorial font-bold uppercase tracking-tight ${isLight ? 'text-[#1f1a16]' : 'text-white'}`}>
              The One Soul Experience
            </h3>
            <p className={`text-xs mt-1.5 ${isLight ? 'text-[#5c5448]' : 'text-stone-400'}`}>
              Six foundational commitments upholding our global reputation from Mumbai to the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tile 1: Mumbai Atelier */}
            <div className={`p-6 border rounded-2xl space-y-2 shadow-xs ${
              isLight ? 'bg-[#faf8f4] border-[#ded7ca]' : 'bg-stone-950/80 border-stone-800 shadow-lg'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isLight ? 'bg-[#f2eee7] border border-[#ded7ca] text-[#1f1a16]' : 'bg-stone-900 border border-stone-800 text-amber-400'
              }`}>
                <Compass className="w-4 h-4" />
              </div>
              <h4 className={`text-sm font-semibold font-sans ${isLight ? 'text-[#1f1a16]' : 'text-white'}`}>
                01. Mumbai Heritage Atelier
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-[#5c5448]' : 'text-stone-400'}`}>
                Handcrafted directly in our dedicated jewelry studio in Mumbai, Maharashtra. No overseas middlemen or retail distributor markups.
              </p>
            </div>

            {/* Tile 2: Video Consultations */}
            <div className={`p-6 border rounded-2xl space-y-2 shadow-xs ${
              isLight ? 'bg-[#faf8f4] border-[#ded7ca]' : 'bg-stone-950/80 border-stone-800 shadow-lg'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isLight ? 'bg-[#f2eee7] border border-[#ded7ca] text-[#1f1a16]' : 'bg-stone-900 border border-stone-800 text-amber-400'
              }`}>
                <Video className="w-4 h-4" />
              </div>
              <h4 className={`text-sm font-semibold font-sans ${isLight ? 'text-[#1f1a16]' : 'text-white'}`}>
                02. 1-on-1 Virtual Video Calls
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-[#5c5448]' : 'text-stone-400'}`}>
                Inspect loose D-Color VVS1 Moissanite gems live in high definition under daylight and jeweler spotlights prior to mounting.
              </p>
              <button
                onClick={onOpenVideoModal}
                className={`text-[11px] font-semibold pt-1 block cursor-pointer hover:underline ${
                  isLight ? 'text-[#1f1a16] hover:text-black' : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                Schedule Virtual Viewing →
              </button>
            </div>

            {/* Tile 3: CAD Experts */}
            <div className={`p-6 border rounded-2xl space-y-2 shadow-xs ${
              isLight ? 'bg-[#faf8f4] border-[#ded7ca]' : 'bg-stone-950/80 border-stone-800 shadow-lg'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isLight ? 'bg-[#f2eee7] border border-[#ded7ca] text-[#1f1a16]' : 'bg-stone-900 border border-stone-800 text-amber-400'
              }`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className={`text-sm font-semibold font-sans ${isLight ? 'text-[#1f1a16]' : 'text-white'}`}>
                03. Custom CAD 3D Experts
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-[#5c5448]' : 'text-stone-400'}`}>
                Receive photorealistic 3D orthographic renders within 48 hours for bespoke engagement rings, Two-Stone pairings, and heirlooms.
              </p>
              <button
                onClick={onOpenCadModal}
                className={`text-[11px] font-semibold pt-1 block cursor-pointer hover:underline ${
                  isLight ? 'text-[#1f1a16] hover:text-black' : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                Request Custom CAD →
              </button>
            </div>

            {/* Tile 4: GRA Authenticity */}
            <div className={`p-6 border rounded-2xl space-y-2 shadow-xs ${
              isLight ? 'bg-[#faf8f4] border-[#ded7ca]' : 'bg-stone-950/80 border-stone-800 shadow-lg'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isLight ? 'bg-[#f2eee7] border border-[#ded7ca] text-[#1f1a16]' : 'bg-stone-900 border border-stone-800 text-amber-400'
              }`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className={`text-sm font-semibold font-sans ${isLight ? 'text-[#1f1a16]' : 'text-white'}`}>
                04. GRA Authenticity & Inscription
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-[#5c5448]' : 'text-stone-400'}`}>
                Independent physical certificate and verifiable digital record for every center stone ≥ 1.0ct, paired with a laser-inscribed girdle serial.
              </p>
              <button
                onClick={onOpenGraModal}
                className={`text-[11px] font-semibold pt-1 block cursor-pointer hover:underline ${
                  isLight ? 'text-[#1f1a16] hover:text-black' : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                Lookup Certificate →
              </button>
            </div>

            {/* Tile 5: Verified Social Proof */}
            <div className={`p-6 border rounded-2xl space-y-2 shadow-xs ${
              isLight ? 'bg-[#faf8f4] border-[#ded7ca]' : 'bg-stone-950/80 border-stone-800 shadow-lg'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isLight ? 'bg-[#f2eee7] border border-[#ded7ca] text-[#1f1a16]' : 'bg-stone-900 border border-stone-800 text-amber-400'
              }`}>
                <Star className="w-4 h-4" />
              </div>
              <h4 className={`text-sm font-semibold font-sans ${isLight ? 'text-[#1f1a16]' : 'text-white'}`}>
                05. 406+ Global Sales & 179 Reviews
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-[#5c5448]' : 'text-stone-400'}`}>
                Carried over from our established Etsy storefront (<span className="font-mono font-bold">onesouljewels</span>) with verified 5.0-star client love stories across 28 countries.
              </p>
            </div>

            {/* Tile 6: Sizing & Resizing */}
            <div className={`p-6 border rounded-2xl space-y-2 shadow-xs ${
              isLight ? 'bg-[#faf8f4] border-[#ded7ca]' : 'bg-stone-950/80 border-stone-800 shadow-lg'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isLight ? 'bg-[#f2eee7] border border-[#ded7ca] text-[#1f1a16]' : 'bg-stone-900 border border-stone-800 text-amber-400'
              }`}>
                <Ruler className="w-4 h-4" />
              </div>
              <h4 className={`text-sm font-semibold font-sans ${isLight ? 'text-[#1f1a16]' : 'text-white'}`}>
                06. Global Sizing & Resizing Guide
              </h4>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-[#5c5448]' : 'text-stone-400'}`}>
                US, UK, European, and Indian ring size calibrations. One complimentary atelier ring resize included with every custom bridal commission.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Information Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="font-editorial text-2xl font-bold tracking-tight text-white">
              ONE SOUL JEWELLERY
            </div>
            <p className="text-stone-400 leading-relaxed">
              Fine Luxury Moissanite & Custom Bridal Jewelry handcrafted in Mumbai, India. Built upon radical price transparency and gemological excellence.
            </p>
            <div className="pt-2 text-[11px] font-mono text-amber-400">
              <div>EST. MUMBAI, MAHARASHTRA</div>
              <div>Etsy Store: onesouljewels</div>
            </div>
          </div>

          {/* Quick Catalogue Links */}
          <div className="space-y-3">
            <div className="font-semibold uppercase tracking-wider text-white">
              Atelier Catalogue
            </div>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onSelectCategory('solitaires')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Oval & Round Solitaires
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('engagement-rings')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Emerald & Step-Cut Rings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('toi-et-moi-vintage')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Two-Stone & Vintage Rings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('fine-bracelets')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Sovereign Line Bracelets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('pendants-necklaces')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Solitaire Pendants & Studs
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Delight & Support (9 AM - 10 PM daily per Section 7.3) */}
          <div className="space-y-3">
            <div className="font-semibold uppercase tracking-wider text-white">
              Customer Delight & Concierge
            </div>
            <div className="text-stone-400 space-y-2 leading-relaxed">
              <div className="font-medium text-stone-200">
                Operating Hours: 9:00 AM – 10:00 PM IST (Daily)
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/919820012345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-stone-200 font-mono hover:text-white"
                >
                  +91 98200 12345 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="mailto:concierge@onesouljewels.com" className="hover:underline text-stone-200 hover:text-white">
                  concierge@onesouljewels.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Atelier Studio: Zaveri Bazaar & Bandra West, Mumbai, Maharashtra 400050, India</span>
              </div>
            </div>
          </div>

          {/* Ethical & Price Transparency */}
          <div className="space-y-3">
            <div className="font-semibold uppercase tracking-wider text-white">
              Radical Transparency
            </div>
            <p className="text-stone-400 leading-relaxed">
              Every ring displays exact gold weight in grams, live 18K/14K metal rates, and verified stone costs. We eliminate retail markups to bring you ethical heirloom luxury.
            </p>
            <div className="p-3 bg-stone-900 border border-stone-800 text-[11px] text-stone-300">
              <span className="font-semibold text-amber-300">Live Gold Formula:</span>
              <div className="font-mono mt-0.5">Price = (Gold g × Rate) + Stone + Making</div>
            </div>
          </div>
        </div>

        {/* Popular Searches Ticker & Copyright */}
        <div className="mt-12 pt-8 border-t border-stone-800 space-y-4">
          <div className="text-[11px] text-stone-500 flex flex-wrap gap-x-3 gap-y-1 items-center">
            <span className="font-semibold text-stone-400">Popular Atelier Searches:</span>
            <span>VVS1 D-Color Moissanite Rings</span>
            <span aria-hidden="true">·</span>
            <span>Two-Stone Engagement Ring Mumbai</span>
            <span aria-hidden="true">·</span>
            <span>Emerald Cut Moissanite Solitaire</span>
            <span aria-hidden="true">·</span>
            <span>18K Solid Gold Custom CAD Rings</span>
            <span aria-hidden="true">·</span>
            <span>GRA Certified Lab Moissanite Lookbook</span>
            <span aria-hidden="true">·</span>
            <span>Ethical Diamond Alternative India</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
            <div>
              © 2026 One Soul Jewellery (`onesouljewels`). All rights reserved. Handcrafted with devotion in Mumbai.
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {onToggleThemeMode && (
                <div className="flex items-center gap-2 pr-2 border-r border-stone-800">
                  <Sun className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-stone-500'}`} />
                  <SquishSwitch
                    checked={!isLight}
                    onChange={(isDark) => {
                      if ((isDark && isLight) || (!isDark && !isLight)) {
                        onToggleThemeMode();
                      }
                    }}
                    ariaLabel="Toggle between Cashmere Greige and Midnight Noir luxury theme"
                    width={48}
                    height={24}
                    radius={12}
                    speed={58}
                    stretch={36}
                    trackColor="#ded7ca"
                    trackOnColor="#1f1a16"
                    thumbColor="#1f1a16"
                    thumbOnColor="#c59d5f"
                    label={
                      <span className={`text-[11px] font-medium ${isLight ? 'text-stone-300' : 'text-stone-300'}`}>
                        {isLight ? 'Cashmere' : 'Noir'}
                      </span>
                    }
                  />
                  <Moon className={`w-3.5 h-3.5 ${!isLight ? 'text-amber-400' : 'text-stone-500'}`} />
                </div>
              )}
              <a
                href="https://www.etsy.com/in-en/shop/OneSoulJewels"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                Verified Etsy Store
              </a>
              <span>·</span>
              <button onClick={onOpenGraModal} className="hover:text-amber-400 transition-colors cursor-pointer">
                GRA Verification Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
