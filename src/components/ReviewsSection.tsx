import React, { useState } from 'react';
import { Star, CheckCircle2, Heart, Plus, Camera, MapPin, X } from 'lucide-react';
import { CLIENT_REVIEWS } from '../data/jewelryData';
import { ClientReview } from '../types/jewelry';

interface ReviewsSectionProps {
  themeMode?: 'light' | 'dark';
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  themeMode = 'light',
}) => {
  const isLight = themeMode === 'light';
  const [reviews, setReviews] = useState<ClientReview[]>(CLIENT_REVIEWS);
  const [filterSource, setFilterSource] = useState<'all' | 'etsy' | 'bespoke'>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [form, setForm] = useState({
    author: '',
    location: '',
    productPurchased: '',
    rating: 5,
    comment: '',
    proposalStory: '',
  });

  const filtered = reviews.filter((r) => {
    if (filterSource === 'etsy') return r.verifiedSource === 'Etsy Verified Buyer';
    if (filterSource === 'bespoke') return r.verifiedSource === 'Bespoke Atelier Client';
    return true;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author || !form.comment) return;

    const newRev: ClientReview = {
      id: `rev-${Date.now()}`,
      author: form.author,
      location: form.location || 'Global Client',
      verifiedSource: 'Bespoke Atelier Client',
      date: 'Just Now',
      rating: form.rating,
      productPurchased: form.productPurchased || 'Bespoke Solitaire Ring',
      comment: form.comment,
      ringSpecs: 'Verified Custom Commission · D-Color VVS1 Moissanite',
      proposalStorySnippet: form.proposalStory,
    };

    setReviews([newRev, ...reviews]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setForm({
        author: '',
        location: '',
        productPurchased: '',
        rating: 5,
        comment: '',
        proposalStory: '',
      });
    }, 2000);
  };

  return (
    <section id="reviews-love-stories" className={`py-20 border-t transition-colors duration-300 ${
      isLight ? 'bg-white border-stone-200 text-[#1f1a16]' : 'bg-[#151210] border-stone-800 text-[#f2efe9]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header with Etsy Social Proof */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-2 ${
              isLight ? 'text-[#1f1a16] font-bold' : 'text-amber-400'
            }`}>
              <span>✦ GLOBAL CLIENT VOICES ✦</span>
              <span aria-hidden="true" className={isLight ? 'text-[#8a8174]' : 'text-stone-600'}>·</span>
              <span className="font-bold">179 Five-Star Reviews</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-editorial font-bold tracking-tight uppercase ${
              isLight ? 'text-[#1f1a16]' : 'text-white'
            }`}>
              Voices of One Soul — 406+ Global Love Stories
            </h2>
            <p className={`mt-3 text-xs sm:text-sm max-w-2xl leading-relaxed ${
              isLight ? 'text-[#5c5448]' : 'text-stone-400'
            }`}>
              Every ring from our Mumbai atelier becomes part of a personal heritage. Verified reviews, proposal milestones, and client photos from couples across New York, London, Sydney, Mumbai, Paris, and worldwide.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <a
              href="https://www.etsy.com/in-en/shop/OneSoulJewels"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-5 py-2.5 border text-xs font-medium uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white border-stone-200 text-[#1f1a16] hover:border-[#1f1a16]'
                  : 'bg-stone-900 border-stone-700 text-stone-200 hover:border-amber-400 hover:text-white'
              }`}
            >
              Verify on Etsy
            </a>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                isLight
                  ? 'bg-[#1f1a16] text-white hover:bg-black'
                  : 'bg-white text-stone-950 hover:bg-stone-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Your Love Story</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 text-xs ${
          isLight ? 'border-stone-200' : 'border-stone-800'
        }`}>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className={isLight ? 'text-stone-500' : 'text-stone-400'}>Filter Stories:</span>
            <button
              onClick={() => setFilterSource('all')}
              className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                filterSource === 'all'
                  ? isLight ? 'bg-stone-950 text-white font-bold' : 'bg-stone-100 text-stone-950 font-bold'
                  : isLight ? 'text-stone-600 hover:text-stone-950' : 'text-stone-400 hover:text-white'
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setFilterSource('etsy')}
              className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                filterSource === 'etsy'
                  ? isLight ? 'bg-stone-950 text-white font-bold' : 'bg-stone-100 text-stone-950 font-bold'
                  : isLight ? 'text-stone-600 hover:text-stone-950' : 'text-stone-400 hover:text-white'
              }`}
            >
              Etsy Verified
            </button>
            <button
              onClick={() => setFilterSource('bespoke')}
              className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                filterSource === 'bespoke'
                  ? isLight ? 'bg-stone-950 text-white font-bold' : 'bg-stone-100 text-stone-950 font-bold'
                  : isLight ? 'text-stone-600 hover:text-stone-950' : 'text-stone-400 hover:text-white'
              }`}
            >
              Atelier Commissions
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 font-mono">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            ))}
            <span className={`font-bold ml-1 text-xs ${isLight ? 'text-stone-950' : 'text-white'}`}>
              5.0 / 5.0 Average
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className={`overflow-hidden flex flex-col justify-between border transition-all shadow-md group ${
                isLight
                  ? 'bg-white border-stone-200/90 text-stone-900 hover:border-stone-400 hover:shadow-lg'
                  : 'bg-stone-900/70 border-stone-800 text-stone-100 hover:border-stone-700'
              }`}
            >
              {/* Client Photo Banner */}
              {rev.photoUrl && (
                <div className="relative aspect-16/9 overflow-hidden bg-stone-100">
                  <img
                    src={rev.photoUrl}
                    alt={`${rev.author}'s ${rev.productPurchased}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[10px] font-mono">
                    <span className="truncate">{rev.productPurchased}</span>
                    <span className="flex items-center gap-1 bg-emerald-600/90 px-1.5 py-0.5 rounded-xs">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                      <span>Verified</span>
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Rating & Source */}
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <span className={`text-[10px] font-mono ${
                      isLight ? 'text-stone-500' : 'text-stone-400'
                    }`}>
                      {rev.verifiedSource}
                    </span>
                  </div>

                  {/* Comment */}
                  <blockquote className={`text-xs leading-relaxed italic ${
                    isLight ? 'text-stone-700' : 'text-stone-300'
                  }`}>
                    "{rev.comment}"
                  </blockquote>

                  {/* Proposal snippet if available */}
                  {rev.proposalStorySnippet && (
                    <div className={`text-[11px] flex items-start gap-1.5 ${
                      isLight ? 'text-stone-600' : 'text-stone-400'
                    }`}>
                      <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span className="italic">{rev.proposalStorySnippet}</span>
                    </div>
                  )}
                </div>

                {/* Author & Location Footer */}
                <div className={`pt-3 mt-2 border-t flex items-center justify-between text-xs ${
                  isLight ? 'border-stone-200' : 'border-stone-800'
                }`}>
                  <div>
                    <div className={`font-bold font-sans ${isLight ? 'text-stone-950' : 'text-white'}`}>{rev.author}</div>
                    <div className={`text-[11px] flex items-center gap-1 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{rev.location}</span>
                    </div>
                  </div>
                  <div className={`text-[10px] font-mono ${isLight ? 'text-stone-500' : 'text-stone-500'}`}>{rev.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Review Modal */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div 
              className="relative w-full max-w-lg bg-stone-900 border border-stone-800 text-stone-100 shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="submit-review-title"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <h3 id="submit-review-title" className="text-base font-semibold tracking-wide uppercase text-white">
                  Share Your One Soul Experience
                </h3>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-white cursor-pointer"
                  aria-label="Close review modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-editorial font-bold text-white">Review Published!</h4>
                  <p className="text-xs text-stone-300">
                    Thank you for sharing your love story with the One Soul global collector community.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 pt-4 text-xs">
                  <div>
                    <label className="block font-medium text-stone-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      placeholder="e.g. Maya & Daniel"
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-stone-300 mb-1">Location / City</label>
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="e.g. San Francisco, USA"
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-300 mb-1">Rating</label>
                      <select
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                      >
                        <option value={5}>5 Stars (Flawless)</option>
                        <option value={4}>4 Stars</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-300 mb-1">Jewelry Piece Purchased</label>
                    <input
                      type="text"
                      value={form.productPurchased}
                      onChange={(e) => setForm({ ...form, productPurchased: e.target.value })}
                      placeholder="e.g. 2.50ct Royal Oval Solitaire Ring"
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-300 mb-1">Your Review & Craftsmanship Thoughts *</label>
                    <textarea
                      rows={3}
                      required
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      placeholder="Share your experience regarding stone brilliance, fire, packaging, and the live gold rate transparency..."
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-300 mb-1">Proposal Moment / Love Story Note (Optional)</label>
                    <input
                      type="text"
                      value={form.proposalStory}
                      onChange={(e) => setForm({ ...form, proposalStory: e.target.value })}
                      placeholder="e.g. Proposed under the stars at Big Sur..."
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <div className="p-3 bg-stone-950 border border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Client photos can also be transmitted directly via WhatsApp for atelier curation.</span>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="px-4 py-2 text-stone-400 hover:text-white uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-400 text-stone-950 font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer shadow-md"
                    >
                      Publish Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
