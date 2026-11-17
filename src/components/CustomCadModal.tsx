import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Send } from 'lucide-react';

interface CustomCadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStoneShape?: string;
}

export const CustomCadModal: React.FC<CustomCadModalProps> = ({
  isOpen,
  onClose,
  defaultStoneShape = 'Classic Oval',
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'United States',
    stoneShape: defaultStoneShape,
    caratSize: '2.5 Carat',
    metalChoice: '18K Yellow Gold',
    ringSize: 'US 6.5',
    estimatedBudget: '$1,000 – $2,500 (₹85k – ₹2L)',
    designVision: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-xl bg-stone-900 border border-stone-800 text-stone-100 shadow-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cad-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <div>
            <h2 id="cad-modal-title" className="text-base font-semibold tracking-wide uppercase text-white font-sans">
              Request Custom 3D CAD Design
            </h2>
            <div className="text-xs text-stone-400">Mumbai Atelier · Photorealistic 3D Renderings within 48 Hours</div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close CAD request modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-stone-950 text-amber-400 border border-stone-800 mx-auto rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-editorial font-bold text-white">Custom CAD Commission Registered</h3>
            <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-amber-300">{formData.fullName}</strong>. Our senior CAD modeler and master goldsmith will review your specification ({formData.stoneShape}, {formData.caratSize}, {formData.metalChoice}) and message your WhatsApp / Email with initial 3D orthographic views within 48 hours.
            </p>
            <div className="p-4 bg-stone-950 border border-stone-800 text-left text-xs font-mono space-y-1">
              <div>Reference Ticket: <span className="font-bold text-amber-400">CAD-MUM-{Math.floor(100000 + Math.random() * 900000)}</span></div>
              <div className="text-stone-400">Dedicated CAD Specialist: Assigned within 4 hours</div>
              <div className="text-stone-400">Estimated Turnaround: 48h to first 3D render</div>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Back to Atelier Lookbook
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-3 border border-stone-800">
              Have a dream ring concept, vintage heirloom to replicate, or a custom Two-Stone pairing? Share your ideas and our Mumbai master CAD engineers will build your exact piece in 3D.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rachel Adams"
                  className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rachel@example.com"
                  className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">WhatsApp / Phone (with Country Code)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Delivery Destination / Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 focus:border-amber-400 focus:outline-hidden cursor-pointer"
                >
                  <option value="United States">United States (Free Insured Express)</option>
                  <option value="United Kingdom">United Kingdom (Free Insured Express)</option>
                  <option value="India">India (Mumbai / Nationwide Courier)</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="European Union">European Union</option>
                  <option value="Singapore / UAE">Singapore / UAE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Desired Stone Cut</label>
                <select
                  value={formData.stoneShape}
                  onChange={(e) => setFormData({ ...formData, stoneShape: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 focus:border-amber-400 focus:outline-hidden cursor-pointer"
                >
                  <option value="Classic Oval">Classic Oval Brilliant</option>
                  <option value="Emerald Step Cut">Emerald Step Cut (Hall of Mirrors)</option>
                  <option value="Two-Stone Dual Cut">Two-Stone (Pear + Emerald Duo)</option>
                  <option value="Antique Cushion">Antique Cushion Heritage Cut</option>
                  <option value="Pear Brilliant">Pear Brilliant Teardrop</option>
                  <option value="Asscher Cut">Asscher Octagonal Step Cut</option>
                  <option value="Marquise Cut">Marquise Cut</option>
                  <option value="Round Brilliant Hearts & Arrows">Round Brilliant (Hearts & Arrows)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Center Stone Carat</label>
                <select
                  value={formData.caratSize}
                  onChange={(e) => setFormData({ ...formData, caratSize: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 focus:border-amber-400 focus:outline-hidden cursor-pointer"
                >
                  <option value="1.5 Carat">1.5 Carat (VVS1 D-Color)</option>
                  <option value="2.0 Carat">2.0 Carat (VVS1 D-Color)</option>
                  <option value="2.5 Carat">2.5 Carat (VVS1 D-Color)</option>
                  <option value="3.0 Carat">3.0 Carat (VVS1 D-Color)</option>
                  <option value="4.0+ Carat">4.0+ Carat (Custom Order)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Metal Preference</label>
                <select
                  value={formData.metalChoice}
                  onChange={(e) => setFormData({ ...formData, metalChoice: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 focus:border-amber-400 focus:outline-hidden cursor-pointer"
                >
                  <option value="18K Yellow Gold">18K Solid Yellow Gold (Recommended)</option>
                  <option value="18K White Gold">18K Solid White Gold</option>
                  <option value="18K Rose Gold">18K Solid Rose Gold</option>
                  <option value="14K Solid Gold">14K Solid Gold (Budget Conscious)</option>
                  <option value="Platinum 950">Platinum 950 (Hypoallergenic Heavy)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Approximate Ring Size</label>
                <input
                  type="text"
                  value={formData.ringSize}
                  onChange={(e) => setFormData({ ...formData, ringSize: e.target.value })}
                  placeholder="US 6 (or unknown)"
                  className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus:border-amber-400 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Design Vision & Reference Notes</label>
              <textarea
                rows={3}
                value={formData.designVision}
                onChange={(e) => setFormData({ ...formData, designVision: e.target.value })}
                placeholder="Describe prong style (claw/tab), band thickness (e.g. 1.8mm comfort fit), hidden halo desires, or custom engravings..."
                className="w-full px-3 py-2 text-xs border border-stone-800 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
              <span className="text-[11px] text-stone-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Complimentary 3D CAD modeling included</span>
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit CAD Brief</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
