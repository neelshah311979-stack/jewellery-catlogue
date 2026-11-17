import React from 'react';
import { X, Trash2, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { JewelryItem, Currency, GoldPurity, GoldTone } from '../types/jewelry';
import { calculateItemPrice, formatCurrency } from '../utils/pricing';

export interface InquiryBagItem {
  id: string;
  item: JewelryItem;
  metal: GoldPurity;
  tone: GoldTone;
  carat: number;
  ringSize: string;
  addedAt: string;
}

interface InquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: InquiryBagItem[];
  onRemoveItem: (id: string) => void;
  onClearBag: () => void;
  currency: Currency;
  live18kGoldRateInr: number;
}

export const InquiryDrawer: React.FC<InquiryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearBag,
  currency,
  live18kGoldRateInr,
}) => {
  if (!isOpen) return null;

  // Calculate total inquiry value and total gold weight
  let totalInr = 0;
  let totalGoldWeight = 0;

  items.forEach((entry) => {
    const pricing = calculateItemPrice({
      baseGoldWeightGrams: entry.item.baseGoldWeightGrams,
      goldPurity: entry.metal,
      live18kGoldRateInr,
      stoneCostInr: entry.item.baseStoneCostInr,
      makingChargeInr: entry.item.fixedMakingChargeInr,
      caratMultiplier: entry.carat / entry.item.baseCaratWeight,
    });
    totalInr += pricing.totalPriceInr;
    totalGoldWeight += pricing.goldWeightGrams;
  });

  const inquirySummaryText = items.map((i, idx) => 
    `${idx + 1}. ${i.item.title} (${i.carat}ct D-VVS1, ${i.metal} ${i.tone}, Size: ${i.ringSize})`
  ).join('%0A');

  const whatsappUrl = `https://wa.me/919820012345?text=Hello%20One%20Soul%20Jewellery%20Mumbai%20Atelier,%20I%20would%20like%20to%20place%20a%20bespoke%20inquiry%20for%20the%20following%20curated%20pieces:%0A%0A${inquirySummaryText}%0A%0AEstimated%20Total:%20${encodeURIComponent(formatCurrency(totalInr, currency))}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-stone-900 text-stone-100 h-full shadow-2xl flex flex-col border-l border-stone-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-800">
          <div>
            <h2 id="inquiry-drawer-title" className="text-base font-semibold tracking-wide uppercase text-white font-sans">
              Atelier Inquiry Bag
            </h2>
            <div className="text-xs text-stone-400">
              {items.length} {items.length === 1 ? 'Piece' : 'Pieces'} Selected for Custom Crafting
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close inquiry bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full border border-stone-800 flex items-center justify-center mx-auto text-stone-500">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-stone-200">Your Inquiry Bag is Empty</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Explore our digital lookbook and add your preferred solitaire rings, Two-Stone pairings, or continuous line bracelets for a direct atelier quote.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 text-xs font-medium uppercase tracking-wider bg-stone-100 text-stone-950 font-bold hover:bg-white transition-colors cursor-pointer"
              >
                Explore Catalogue
              </button>
            </div>
          ) : (
            <>
              {items.map((entry) => {
                const itemPrice = calculateItemPrice({
                  baseGoldWeightGrams: entry.item.baseGoldWeightGrams,
                  goldPurity: entry.metal,
                  live18kGoldRateInr,
                  stoneCostInr: entry.item.baseStoneCostInr,
                  makingChargeInr: entry.item.fixedMakingChargeInr,
                  caratMultiplier: entry.carat / entry.item.baseCaratWeight,
                });

                return (
                  <div key={entry.id} className="p-4 border border-stone-800 bg-stone-950/80 space-y-2 relative">
                    <button
                      onClick={() => onRemoveItem(entry.id)}
                      className="absolute top-3 right-3 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove item"
                      aria-label={`Remove ${entry.item.title} from inquiry`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="pr-6">
                      <h4 className="text-xs font-bold text-white font-sans">{entry.item.title}</h4>
                      <div className="text-[11px] text-stone-300 mt-0.5">
                        {entry.carat} CT D-Color VVS1 Moissanite
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {entry.metal} · {entry.tone} · Size: {entry.ringSize}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
                      <span className="text-stone-400 text-[10px]">Gold: {itemPrice.goldWeightGrams}g</span>
                      <span className="font-mono font-bold text-amber-400">
                        {formatCurrency(itemPrice.totalPriceInr, currency)}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end">
                <button
                  onClick={onClearBag}
                  className="text-[11px] text-stone-400 hover:text-amber-400 underline cursor-pointer"
                >
                  Clear Bag
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-800 bg-stone-950 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Estimated Gold Metal Weight:</span>
                <span className="font-mono text-stone-200">{totalGoldWeight.toFixed(2)} grams</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Craftsmanship Lead Time:</span>
                <span className="text-stone-200">10–14 Days Handcrafted</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-stone-800">
                <span>Total Estimated Price:</span>
                <span className="font-mono text-amber-400">{formatCurrency(totalInr, currency)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-4 h-4 text-stone-950" />
                <span>Transmit Inquiry to Mumbai Atelier</span>
              </a>
              <div className="text-[10px] text-stone-400 text-center flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero obligation · Real master goldsmith review</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
