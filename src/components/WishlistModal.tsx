import React from 'react';
import { X, Trash2, Heart, ArrowRight } from 'lucide-react';
import { JewelryItem, Currency } from '../types/jewelry';
import { calculateItemPrice, formatCurrency } from '../utils/pricing';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  items: JewelryItem[];
  onRemoveWishlist: (id: string) => void;
  onSelectItem: (item: JewelryItem) => void;
  currency: Currency;
  live18kGoldRateInr: number;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  items,
  onRemoveWishlist,
  onSelectItem,
  currency,
  live18kGoldRateInr,
}) => {
  if (!isOpen) return null;

  const wishlistedItems = items.filter((i) => wishlistIds.includes(i.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-stone-900 border border-stone-800 text-stone-100 shadow-2xl max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wishlist-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 id="wishlist-modal-title" className="text-base font-semibold tracking-wide uppercase text-white font-sans">
              Saved Atelier Pieces ({wishlistedItems.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close saved pieces"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {wishlistedItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Heart className="w-8 h-8 text-stone-600 mx-auto" />
              <h3 className="text-sm font-semibold text-stone-300">No Saved Pieces</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Click the heart icon on any engagement ring, solitaire, or line bracelet in the catalogue to save it to your bespoke wishlist.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-800 space-y-3">
              {wishlistedItems.map((item) => {
                const pricing = calculateItemPrice({
                  baseGoldWeightGrams: item.baseGoldWeightGrams,
                  goldPurity: item.defaultMetal,
                  live18kGoldRateInr,
                  stoneCostInr: item.baseStoneCostInr,
                  makingChargeInr: item.fixedMakingChargeInr,
                });

                return (
                  <div key={item.id} className="pt-3 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white font-sans">{item.title}</h4>
                      <div className="text-[11px] text-stone-400">
                        {item.stoneDetails.shape} · {item.baseCaratWeight}ct D-VVS1 · {item.defaultMetal}
                      </div>
                      <div className="font-mono font-bold text-amber-400 text-xs mt-1">
                        {formatCurrency(pricing.totalPriceInr, currency)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectItem(item);
                        }}
                        className="px-3 py-1.5 bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onRemoveWishlist(item.id)}
                        className="p-1.5 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove from saved pieces"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 text-stone-200 text-xs uppercase tracking-wider hover:bg-stone-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
