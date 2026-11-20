import React from 'react';
import { X, Check } from 'lucide-react';
import { Currency } from '../types/jewelry';

interface BudgetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBudget: string;
  onSelectBudget: (tier: string) => void;
  currency: Currency;
}

export const BudgetPickerModal: React.FC<BudgetPickerModalProps> = ({
  isOpen,
  onClose,
  activeBudget,
  onSelectBudget,
  currency,
}) => {
  if (!isOpen) return null;

  const budgetOptions = [
    {
      id: 'all',
      title: 'Complete Catalogue',
      subtitle: 'Browse all atelier pieces across all price tiers',
      inr: 'All Budgets',
      usd: 'All Budgets',
    },
    {
      id: 'under_25k',
      title: 'Solitaire Everyday & Minimalist',
      subtitle: 'Pendants, classic stud earrings & delicate 10K/14K solitaires',
      inr: 'Under ₹25,000',
      usd: 'Under $300',
    },
    {
      id: '25k_to_50k',
      title: 'Classic Bridal & Oval Solitaires',
      subtitle: '1.5ct to 2.5ct D-VVS1 solitaires in solid 18K gold',
      inr: '₹25,000 – ₹50,000',
      usd: '$300 – $600',
    },
    {
      id: '50k_to_100k',
      title: 'Statement Solitaires & Vintage Cuts',
      subtitle: '2.5ct to 3.5ct Emerald, Antique Cushion & Two-Stone pairings',
      inr: '₹50,000 – ₹1,00,000',
      usd: '$600 – $1,200',
    },
    {
      id: 'above_100k',
      title: 'High Atelier & Line Bracelet Masterpieces',
      subtitle: 'Full 55-stone continuous line bracelets, 4ct+ dual stone sets & platinum bespoke',
      inr: '₹1,00,000 & Above',
      usd: '$1,200 & Above',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-md bg-stone-900 border border-stone-800 text-stone-100 shadow-2xl max-h-[92dvh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="budget-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <div>
            <h2 id="budget-modal-title" className="text-base font-semibold tracking-wide uppercase text-white font-sans">
              Best Picks for Your Budget
            </h2>
            <div className="text-xs text-stone-400">Direct-to-Consumer Atelier Value</div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close budget modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {budgetOptions.map((opt) => {
            const isSelected = activeBudget === opt.id;
            const priceLabel = currency === 'INR' ? opt.inr : opt.usd;

            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSelectBudget(opt.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 border transition-all flex items-start justify-between cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-stone-950 shadow-md'
                    : 'border-stone-800 hover:border-stone-700 bg-stone-950/60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${isSelected ? 'text-amber-300' : 'text-stone-200'}`}>
                      {opt.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{opt.subtitle}</div>
                  <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                    {priceLabel}
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-stone-950 border-t border-stone-800 text-center">
          <button
            onClick={onClose}
            className="text-xs font-medium uppercase tracking-wider text-stone-400 hover:text-white cursor-pointer"
          >
            Close & View Catalogue
          </button>
        </div>
      </div>
    </div>
  );
};
