import React, { useState } from 'react';
import { X, Video, CheckCircle2, Calendar, Clock, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, ATELIER_WHATSAPP_DISPLAY } from '../utils/contact';

interface VideoConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItemTitle?: string;
}

export const VideoConsultationModal: React.FC<VideoConsultationModalProps> = ({
  isOpen,
  onClose,
  selectedItemTitle = 'General Atelier Collection',
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    preferredDate: '2026-10-25',
    preferredTime: '15:00',
    timeZone: 'EST (New York, UTC-5)',
    notes: `Interested in inspecting: ${selectedItemTitle}`,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-stone-900 border border-stone-800 text-stone-100 shadow-2xl max-h-[92dvh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-amber-400" />
            <h2 id="video-modal-title" className="text-base font-semibold tracking-wide uppercase text-white font-sans">
              Book 1-on-1 HD Video Consultation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close video consultation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-stone-950 text-amber-400 border border-stone-800 mx-auto rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-editorial font-bold text-white">Appointment Confirmed</h3>
            <p className="text-xs text-stone-300 max-w-sm mx-auto leading-relaxed">
              We have scheduled your private HD stone inspection session with a master gemologist at our Mumbai atelier for <strong className="text-amber-300">{formData.preferredDate} at {formData.preferredTime} ({formData.timeZone})</strong>.
            </p>
            <div className="p-3 bg-stone-950 border border-stone-800 text-xs text-stone-300 text-left font-mono space-y-1">
              <div>Consultant: Master Gemologist, Mumbai Atelier</div>
              <div>Platform: Google Meet / WhatsApp HD Video Link</div>
              <div>Calendar invite sent to: {formData.email}</div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <a
                href={buildWhatsAppUrl(`Hello One Soul Jewellery, I booked a Video Consultation for ${formData.preferredDate} at ${formData.preferredTime} (${formData.timeZone}) regarding: ${selectedItemTitle}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 border border-emerald-500/40 bg-emerald-950/50 text-emerald-300 text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-stone-950 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Connect on WhatsApp ({ATELIER_WHATSAPP_DISPLAY})</span>
              </a>
              <button
                onClick={() => { setSubmitted(false); onClose(); }}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-3 border border-stone-800">
              Inspect loose D-Color VVS1 Moissanite gems under daylight and direct spotlight with our Mumbai atelier masters. See stone fire, proportions, and laser girdle inscriptions live before setting.
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jessica Miller"
                  className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jessica@example.com"
                    className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus:border-amber-400 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+1 555 123 4567"
                    className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus:border-amber-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Preferred Date</span>
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 focus:border-amber-400 focus:outline-hidden cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Preferred Time</span>
                  </label>
                  <input
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 focus:border-amber-400 focus:outline-hidden cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Your Time Zone</label>
                <select
                  value={formData.timeZone}
                  onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 focus:border-amber-400 focus:outline-hidden cursor-pointer"
                >
                  <option value="EST (New York, UTC-5)">EST (New York, Toronto)</option>
                  <option value="PST (Los Angeles, UTC-8)">PST (California, Vancouver)</option>
                  <option value="GMT/BST (London, UTC+0/1)">GMT/BST (London, Dublin)</option>
                  <option value="CET (Paris, Berlin, UTC+1)">CET (Paris, Berlin, Rome)</option>
                  <option value="IST (India Standard, UTC+5:30)">IST (India Standard, Mumbai)</option>
                  <option value="AEST (Sydney, Melbourne, UTC+10)">AEST (Sydney, Melbourne)</option>
                  <option value="SGT/GST (Singapore, Dubai)">SGT/GST (Singapore, Dubai)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Stones / Designs to Inspect</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Compare 2.5ct Oval vs 3ct Emerald cut side-by-side in 18k yellow gold"
                  className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus:border-amber-400 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <a
                href={buildWhatsAppUrl(`Hello One Soul Jewellery Mumbai Atelier, I would like an instant WhatsApp HD Video Viewing for: ${selectedItemTitle}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-300 hover:text-white flex items-center justify-center sm:justify-start gap-1.5 underline underline-offset-4"
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span>WhatsApp Video Desk ({ATELIER_WHATSAPP_DISPLAY})</span>
              </a>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
