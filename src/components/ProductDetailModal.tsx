import React, { useState } from 'react';
import { X, ShieldCheck, Heart, MessageCircle, Video, Check, Info } from 'lucide-react';
import { JewelryItem, Currency, GoldPurity, GoldTone } from '../types/jewelry';
import { calculateItemPrice, formatCurrency } from '../utils/pricing';
import { StoneCutVisualizer } from './StoneCutVisualizer';

interface ProductDetailModalProps {
  item: JewelryItem | null;
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  live18kGoldRateInr: number;
  onAddToInquiry: (item: JewelryItem, selectedMetal: GoldPurity, selectedTone: GoldTone, selectedCarat: number, ringSize: string) => void;
  onOpenVideoModal: (itemTitle: string) => void;
  onOpenGraModal: (certNumber: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  currency,
  live18kGoldRateInr,
  onAddToInquiry,
  onOpenVideoModal,
  onOpenGraModal,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!isOpen || !item) return null;

  const [selectedMetal, setSelectedMetal] = useState<GoldPurity>(item.defaultMetal);
  const [selectedTone, setSelectedTone] = useState<GoldTone>(item.defaultTone);
  const [selectedCarat, setSelectedCarat] = useState<number>(item.baseCaratWeight);
  const [selectedRingSize, setSelectedRingSize] = useState<string>('US 6.5 (UK M / India 13)');
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(true);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Carat multiplier for stone price
  const caratRatio = selectedCarat / item.baseCaratWeight;
  const pricing = calculateItemPrice({
    baseGoldWeightGrams: item.baseGoldWeightGrams,
    goldPurity: selectedMetal,
    live18kGoldRateInr,
    stoneCostInr: item.baseStoneCostInr,
    makingChargeInr: item.fixedMakingChargeInr,
    caratMultiplier: caratRatio,
  });

  const handleAddBag = () => {
    onAddToInquiry(item, selectedMetal, selectedTone, selectedCarat, selectedRingSize);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const ringSizes = [
    'US 4.0 (UK H / India 7)',
    'US 5.0 (UK J½ / India 9)',
    'US 6.0 (UK L½ / India 11)',
    'US 6.5 (UK M / India 13)',
    'US 7.0 (UK N½ / India 14)',
    'US 7.5 (UK O½ / India 15)',
    'US 8.0 (UK P½ / India 16)',
    'US 9.0 (UK R½ / India 18)',
    'Custom Size (Specified in Notes)',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 text-stone-100 shadow-2xl max-h-[92vh] flex flex-col md:flex-row overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-white bg-stone-800/90 rounded-full border border-stone-700 transition-colors shadow-xs cursor-pointer"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Visualizer & Macro Loupe */}
        <div className="w-full md:w-1/2 bg-stone-950 flex flex-col border-b md:border-b-0 md:border-r border-stone-800 overflow-y-auto">
          <div className="p-6 flex-1 flex flex-col justify-center items-center">
            <StoneCutVisualizer
              cutType={item.visualTag}
              caratText={`${selectedCarat} Carat`}
              metalTone={selectedTone}
              enableLoupe={true}
              graInscription={item.stoneDetails.graCertificateNumber}
              className="w-full aspect-square max-w-[340px] shadow-sm"
            />
            
            <div className="text-[11px] text-stone-400 text-center mt-3">
              Interactive 3D Prismatic Light Simulator · Move cursor to tilt fire
            </div>

            {/* Quick GRA verification trigger */}
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenGraModal(item.stoneDetails.graCertificateNumber)}
                className="text-xs font-mono text-stone-200 bg-stone-900 px-3 py-1.5 border border-stone-700 hover:border-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Verify Stone: {item.stoneDetails.graCertificateNumber}</span>
              </button>
            </div>
          </div>

          {/* Etsy Social Proof Box */}
          <div className="p-4 bg-stone-900/90 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <div>
              <span className="font-semibold text-white">406+ Global Sales</span> · 179 Five-Star Reviews
            </div>
            <a
              href="https://www.etsy.com/in-en/shop/OneSoulJewels"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-amber-400 hover:text-amber-300"
            >
              Etsy Storefront
            </a>
          </div>
        </div>

        {/* Right Column: Specifications & Pricing Breakdown */}
        <div className="w-full md:w-1/2 flex flex-col overflow-y-auto p-6 space-y-6 bg-stone-900">
          {/* Header & Badges */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-medium">
                SKU: {item.sku}
              </span>
              <button
                onClick={() => onToggleWishlist(item.id)}
                className="text-stone-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
            <h1 id="product-detail-title" className="text-2xl font-editorial font-bold text-white mt-1">
              {item.title}
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              {item.subtitle}
            </p>
          </div>

          {/* Pricing Highlight & Formula Toggle */}
          <div className="p-4 bg-stone-950 border border-stone-800">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-stone-400 uppercase tracking-wider block">Transparent Atelier Price</span>
                <span className="text-2xl font-bold font-sans text-amber-300 tabular-nums">
                  {formatCurrency(pricing.totalPriceInr, currency)}
                </span>
              </div>
              <button
                onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                className="text-xs text-amber-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{showFormulaDetails ? 'Hide Formula' : 'Anatomy of Craft'}</span>
              </button>
            </div>

            {/* Formula Breakdown per Section 6 */}
            {showFormulaDetails && (
              <div className="mt-3 pt-3 border-t border-stone-800 text-xs space-y-2">
                <div className="text-[11px] text-stone-400 font-mono italic">
                  Total = (Gold Weight × Live Rate) + Moissanite Stone Cost + Atelier Making Charge
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-300">
                  <div>
                    Gold Value ({pricing.goldWeightGrams}g {pricing.goldPurity}):
                  </div>
                  <div className="text-right font-mono font-semibold text-white">
                    {formatCurrency(pricing.goldComponentInr, currency)}
                  </div>
                  <div>
                    Moissanite Stone ({selectedCarat}ct D-VVS1):
                  </div>
                  <div className="text-right font-mono font-semibold text-white">
                    {formatCurrency(pricing.stoneComponentInr, currency)}
                  </div>
                  <div>
                    Fixed Atelier Making & Setting:
                  </div>
                  <div className="text-right font-mono font-semibold text-white">
                    {formatCurrency(pricing.makingChargeInr, currency)}
                  </div>
                </div>
                <p className="text-[11px] text-stone-400 italic mt-2 border-t border-stone-800 pt-2 leading-relaxed">
                  "Our direct-to-consumer moissanite pricing cuts out traditional retail middleman markups, giving you elite D-Color VVS1 brilliance at fair atelier value."
                </p>
              </div>
            )}
          </div>

          {/* Configurator Controls */}
          <div className="space-y-4 text-xs">
            {/* Metal Purity */}
            <div>
              <label className="font-semibold text-stone-200 block mb-1.5">
                Metal Purity: <span className="font-normal text-amber-400">{selectedMetal}</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {item.availableMetals.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMetal(m)}
                    className={`py-2 px-1 text-center border text-[11px] font-medium transition-all cursor-pointer ${
                      selectedMetal === m
                        ? 'border-amber-400 bg-amber-400 text-stone-950 font-bold'
                        : 'border-stone-800 hover:border-stone-700 bg-stone-950 text-stone-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Metal Tone */}
            <div>
              <label className="font-semibold text-stone-200 block mb-1.5">
                Gold Tone: <span className="font-normal text-amber-400">{selectedTone}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {item.availableTones.map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setSelectedTone(tone)}
                    className={`py-2 px-2 text-center border text-[11px] font-medium transition-all cursor-pointer ${
                      selectedTone === tone
                        ? 'border-amber-400 bg-amber-400 text-stone-950 font-bold'
                        : 'border-stone-800 hover:border-stone-700 bg-stone-950 text-stone-300'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Center Stone Carat */}
            <div>
              <label className="font-semibold text-stone-200 block mb-1.5">
                Center Stone Carat: <span className="font-normal text-amber-400">{selectedCarat} Carat (D-Color VVS1)</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {item.availableCarats.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCarat(c)}
                    className={`py-1.5 px-3 border text-[11px] font-mono font-medium transition-all cursor-pointer ${
                      selectedCarat === c
                        ? 'border-amber-400 bg-amber-400 text-stone-950 font-bold'
                        : 'border-stone-800 hover:border-stone-700 bg-stone-950 text-stone-300'
                    }`}
                  >
                    {c.toFixed(1)} CT
                  </button>
                ))}
              </div>
            </div>

            {/* Ring Size */}
            {item.category !== 'pendants-necklaces' && item.category !== 'fine-bracelets' && item.category !== 'earrings' && (
              <div>
                <label className="font-semibold text-stone-200 block mb-1.5">
                  Select Ring Size
                </label>
                <select
                  value={selectedRingSize}
                  onChange={(e) => setSelectedRingSize(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-800 focus:border-amber-400 focus:outline-hidden bg-stone-950 text-stone-100"
                >
                  {ringSizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* The One Soul Gemological Standard Section (Section 5) */}
          <div className="border-t border-stone-800 pt-4 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-amber-400">
              The One Soul Gemological Standard
            </h3>
            <div className="grid grid-cols-2 gap-3 text-[11px] bg-stone-950 p-3 border border-stone-800">
              <div>
                <div className="text-stone-400 font-medium">Clarity Grade</div>
                <div className="font-bold text-white">VVS1 (Visually Flawless)</div>
                <div className="text-stone-500 text-[10px]">Zero visible inclusions at 10x</div>
              </div>
              <div>
                <div className="text-stone-400 font-medium">Color Grade</div>
                <div className="font-bold text-white">D-Color (Apex Colorless)</div>
                <div className="text-stone-500 text-[10px]">Crisp icy white radiance</div>
              </div>
              <div>
                <div className="text-stone-400 font-medium">Refractive Index</div>
                <div className="font-mono font-bold text-amber-300">2.65 – 2.69</div>
                <div className="text-stone-500 text-[10px]">Surpasses diamond's 2.42</div>
              </div>
              <div>
                <div className="text-stone-400 font-medium">Mohs Hardness</div>
                <div className="font-mono font-bold text-white">9.25 / 10</div>
                <div className="text-stone-500 text-[10px]">Scratch-proof lifetime wear</div>
              </div>
            </div>
          </div>

          {/* Craftsmanship Notes */}
          <div className="text-xs text-stone-400 leading-relaxed space-y-1">
            <div className="font-semibold text-stone-200">Atelier Notes:</div>
            <p>{item.craftsmanshipNotes}</p>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <button
              onClick={handleAddBag}
              className={`w-full py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-400 text-stone-950 hover:bg-amber-300'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added to Inquiry Bag</span>
                </>
              ) : (
                <span>Add to Inquiry Bag</span>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/919820012345?text=Hello%20One%20Soul%20Jewellery,%20I%20am%20inquiring%20about%20the%20${encodeURIComponent(item.title)}%20(${selectedCarat}ct,%20${selectedMetal})`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 border border-stone-700 hover:border-amber-400 bg-stone-950 text-stone-200 hover:text-white text-center text-xs font-medium tracking-wide flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Atelier</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVideoModal(item.title);
                }}
                className="py-2.5 px-3 border border-stone-700 hover:border-amber-400 bg-stone-950 text-stone-200 hover:text-white text-center text-xs font-medium tracking-wide flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span>Video Consult</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
