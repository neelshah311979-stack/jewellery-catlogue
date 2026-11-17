import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { verifyGraCertificate, GraCertificateRecord } from '../utils/gemology';

interface GraVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCertNumber?: string;
}

export const GraVerificationModal: React.FC<GraVerificationModalProps> = ({
  isOpen,
  onClose,
  initialCertNumber = 'GRA-98241088',
}) => {
  const [certInput, setCertInput] = useState(initialCertNumber);
  const [activeCert, setActiveCert] = useState<GraCertificateRecord | null>(() => {
    const res = verifyGraCertificate(initialCertNumber);
    return res.certificate;
  });
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (isOpen && initialCertNumber) {
      setCertInput(initialCertNumber);
      const res = verifyGraCertificate(initialCertNumber);
      setActiveCert(res.certificate);
      setFeedback('');
    }
  }, [isOpen, initialCertNumber]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const result = verifyGraCertificate(certInput);
    setActiveCert(result.certificate);
    setFeedback(result.message);
  };

  const loadPreset = (num: string) => {
    setCertInput(num);
    const result = verifyGraCertificate(num);
    setActiveCert(result.certificate);
    setFeedback(result.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 text-stone-100 shadow-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gra-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 id="gra-modal-title" className="text-base font-semibold tracking-wide uppercase text-white font-sans">
              GRA Moissanite Grading Report Verification
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close GRA verification modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Subtitle & Trust Note */}
          <div className="text-sm text-stone-300 leading-relaxed">
            Every center stone 1.00 Carat or larger handcrafted by <strong className="text-amber-300">One Soul Jewellery</strong> is accompanied by an independent grading certificate issued by the Global Gemological Research Association (GRA), with a micro-laser serial inscribed onto the girdle.
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder="Enter GRA Certificate # (e.g. GRA-98241088)"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-800 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus:border-amber-400 focus:outline-hidden font-mono"
              />
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-400 text-stone-950 text-xs font-bold tracking-wider uppercase hover:bg-amber-300 transition-colors shrink-0 cursor-pointer"
            >
              Verify Stone
            </button>
          </form>

          {/* Preset Samples */}
          <div className="flex items-center gap-2 text-xs text-stone-400 flex-wrap">
            <span>Sample Records:</span>
            <button
              type="button"
              onClick={() => loadPreset('GRA-98241088')}
              className="underline text-stone-300 hover:text-amber-400 cursor-pointer"
            >
              GRA-98241088 (Oval 2.50ct)
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => loadPreset('GRA-77419203')}
              className="underline text-stone-300 hover:text-amber-400 cursor-pointer"
            >
              GRA-77419203 (Emerald 3.00ct)
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => loadPreset('GRA-66129845')}
              className="underline text-stone-300 hover:text-amber-400 cursor-pointer"
            >
              GRA-66129845 (Two-Stone Duo 4.00ct)
            </button>
          </div>

          {feedback && (
            <div className="text-xs text-stone-300 bg-stone-950 p-2 border border-stone-800">
              {feedback}
            </div>
          )}

          {/* Digital Certificate Render */}
          {activeCert ? (
            <div className="border border-stone-700 p-6 bg-stone-950/80 relative">
              {/* Seal Stamp */}
              <div className="absolute top-6 right-6 flex flex-col items-center opacity-85 pointer-events-none">
                <div className="w-16 h-16 rounded-full border border-amber-500/60 flex items-center justify-center text-amber-400">
                  <Award className="w-8 h-8" />
                </div>
                <span className="text-[9px] tracking-widest font-mono text-amber-400 mt-1 uppercase font-bold">GRA VERIFIED</span>
              </div>

              <div className="border-b border-stone-800 pb-4 mb-4">
                <div className="text-xs font-mono text-stone-400">GLOBAL GEMOLOGICAL RESEARCH ASSOCIATION</div>
                <h3 className="text-xl font-editorial font-bold text-white">Official Moissanite Report</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>STATUS: AUTHENTIC & ACTIVE IN ATELIER DATABASE</span>
                </div>
              </div>

              {/* Spec Details Table */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
                <div>
                  <div className="text-stone-400 font-medium">Report Number</div>
                  <div className="font-mono font-bold text-amber-400 text-sm">{activeCert.certificateNumber}</div>
                </div>
                <div>
                  <div className="text-stone-400 font-medium">Date of Certification</div>
                  <div className="text-stone-200">{activeCert.issueDate}</div>
                </div>

                <div>
                  <div className="text-stone-400 font-medium">Shape & Cut Style</div>
                  <div className="text-stone-200 font-semibold">{activeCert.shapeAndCut}</div>
                </div>
                <div>
                  <div className="text-stone-400 font-medium">Measurements</div>
                  <div className="font-mono text-stone-200">{activeCert.measurements}</div>
                </div>

                <div>
                  <div className="text-stone-400 font-medium">Carat Weight</div>
                  <div className="text-stone-200 font-bold">{activeCert.caratWeight}</div>
                </div>
                <div>
                  <div className="text-stone-400 font-medium">Color Grade</div>
                  <div className="text-stone-200 font-bold">D (Colorless Apex)</div>
                </div>

                <div>
                  <div className="text-stone-400 font-medium">Clarity Grade</div>
                  <div className="text-stone-200 font-bold">VVS1 (Visually Flawless)</div>
                </div>
                <div>
                  <div className="text-stone-400 font-medium">Cut / Polish / Symmetry</div>
                  <div className="text-stone-200 font-semibold">{activeCert.cutGrade} / {activeCert.polish} / {activeCert.symmetry}</div>
                </div>

                <div className="col-span-2 pt-2 border-t border-stone-800">
                  <div className="text-stone-400 font-medium">Laser Inscription Girdle Code</div>
                  <div className="font-mono text-amber-300 font-bold bg-stone-900 p-2.5 border border-stone-800 flex items-center justify-between">
                    <span>{activeCert.inscription}</span>
                    <span className="text-[10px] text-stone-500">Verifiable under 10x jeweler loupe</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-stone-400 border border-dashed border-stone-800">
              No matching certificate loaded. Please enter a valid GRA certificate number.
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-stone-950 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-stone-800 text-stone-200 text-xs tracking-wider uppercase hover:bg-stone-700 transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
