import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Minus, Lock, Check, Info } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Currency } from '../types/jewelry';
import {
  getFilteredGoldHistory,
  getRateForPurity,
  analyzeGoldTrend,
  GoldPurityPill,
} from '../utils/goldRates';
import { formatCurrency } from '../utils/pricing';

interface LiveGoldRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  current18kRateInr: number;
  onLockRate: (isLocked: boolean) => void;
  isPriceLocked: boolean;
}

export const LiveGoldRateModal: React.FC<LiveGoldRateModalProps> = ({
  isOpen,
  onClose,
  currency,
  current18kRateInr,
  onLockRate,
  isPriceLocked,
}) => {
  const [selectedPurity, setSelectedPurity] = useState<GoldPurityPill>('18K');
  const [selectedDays, setSelectedDays] = useState<number>(7);

  if (!isOpen) return null;

  const history = getFilteredGoldHistory(selectedDays);
  const trend = analyzeGoldTrend(history, selectedPurity);

  // Format historical trend data for Recharts (chronological: oldest to today)
  const chartData = [...history].reverse().map((rec) => ({
    date: rec.date,
    displayDate: rec.displayDate,
    rate: getRateForPurity(rec, selectedPurity),
    rate18k: rec.rate18k,
    rate24k: rec.rate24k,
    changeInr: rec.changeInr,
    changePercent: rec.changePercent,
  }));

  const minVal = Math.min(...chartData.map((d) => d.rate)) - 15;
  const maxVal = Math.max(...chartData.map((d) => d.rate)) + 15;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/80 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 text-stone-100 shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gold-rate-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="gold-rate-modal-title" className="text-base font-semibold tracking-wide uppercase text-white font-sans">
                  Live Gold Rate Tracker & Trend
                </h2>
                <span className="px-2 py-0.5 text-[10px] bg-amber-400/10 text-amber-300 border border-amber-500/30 font-mono uppercase">
                  {selectedDays}-Day 18K India Benchmark
                </span>
              </div>
              <div className="text-xs text-stone-400">
                Mumbai Bullion Market (IBJA) Benchmark · Real-time Atelier Pricing Base
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white transition-colors rounded-full hover:bg-stone-800 cursor-pointer"
            aria-label="Close gold rate tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-950 p-4 border border-stone-800 text-xs">
            <div>
              <div className="text-stone-400 uppercase tracking-wider text-[10px]">Today's Rate ({selectedPurity})</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                {formatCurrency(trend.currentRate, currency)}/g
              </div>
              <div className="text-[11px] text-stone-400 font-mono">
                18K: ₹{history[0].rate18k.toLocaleString('en-IN')}/g
              </div>
            </div>

            <div>
              <div className="text-stone-400 uppercase tracking-wider text-[10px]">Today's Movement</div>
              <div className={`text-base font-bold font-mono mt-0.5 flex items-center gap-1 ${
                history[0].changeInr > 0 ? 'text-emerald-400' : history[0].changeInr < 0 ? 'text-rose-400' : 'text-stone-400'
              }`}>
                {history[0].changeInr > 0 ? <TrendingUp className="w-4 h-4" /> : history[0].changeInr < 0 ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                <span>{history[0].changeInr > 0 ? `+₹${history[0].changeInr}` : `₹${history[0].changeInr}`}/g</span>
              </div>
              <div className="text-[11px] text-stone-400 font-mono">
                ({history[0].changePercent > 0 ? `+${history[0].changePercent}%` : `${history[0].changePercent}%`})
              </div>
            </div>

            <div>
              <div className="text-stone-400 uppercase tracking-wider text-[10px]">{selectedDays}-Day Period Range</div>
              <div className="font-mono font-semibold text-stone-300 mt-1">
                High: <span className="text-white font-bold">{formatCurrency(trend.highestRate, currency)}</span>
              </div>
              <div className="font-mono font-semibold text-stone-300">
                Low: <span className="text-white font-bold">{formatCurrency(trend.lowestRate, currency)}</span>
              </div>
            </div>

            <div>
              <div className="text-stone-400 uppercase tracking-wider text-[10px]">{selectedDays}-Day Net Trajectory</div>
              <div className={`text-base font-bold font-mono mt-0.5 flex items-center gap-1 ${
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{trend.isPositive ? `+₹${trend.netChange}` : `₹${trend.netChange}`}/g</span>
              </div>
              <div className="text-[11px] text-stone-400 font-mono">
                ({trend.isPositive ? `+${trend.netChangePercent}%` : `${trend.netChangePercent}%`} net)
              </div>
            </div>
          </div>

          {/* Controls: Purity Tabs & Timeframe Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-stone-800 pb-3">
            {/* Gold Purity Tabs */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-stone-400 mr-1 hidden sm:inline">Purity:</span>
              {(['18K', '22K', '24K', '14K'] as GoldPurityPill[]).map((purity) => (
                <button
                  key={purity}
                  onClick={() => setSelectedPurity(purity)}
                  className={`px-3 py-1 font-medium transition-colors cursor-pointer border ${
                    selectedPurity === purity
                      ? 'border-amber-400 bg-amber-400 text-stone-950 font-bold shadow-xs'
                      : 'border-stone-800 bg-stone-950 text-stone-300 hover:border-stone-600'
                  }`}
                >
                  {purity} {purity === '18K' && '(Atelier Standard)'}
                </button>
              ))}
            </div>

            {/* Timeframe Buttons */}
            <div className="flex items-center gap-1">
              <span className="text-stone-400 mr-1 hidden sm:inline">Timeframe:</span>
              {[7, 15, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => setSelectedDays(days)}
                  className={`px-3 py-1 text-xs font-mono transition-colors cursor-pointer ${
                    selectedDays === days
                      ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {days}D {days === 7 && '(7-Day Trend)'}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Visual Chart */}
          <div className="bg-stone-950 border border-stone-800 p-4">
            <div className="flex items-center justify-between text-xs mb-3">
              <div className="flex items-center gap-2 text-stone-300">
                <span className="font-semibold text-white">Visual Historical Trend ({selectedPurity} Gold · India)</span>
                <span className="text-[11px] text-stone-400 font-mono">
                  (Hover point to inspect date & rate)
                </span>
              </div>
              <div className="text-[11px] font-mono text-amber-400">
                Current 18K: ₹{history[0].rate18k.toLocaleString('en-IN')}/g
              </div>
            </div>

            <div className="w-full h-48 sm:h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldRateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                  <XAxis
                    dataKey="displayDate"
                    stroke="#78716c"
                    tick={{ fill: '#a8a29e', fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: '#44403c' }}
                  />
                  <YAxis
                    domain={[Math.floor(minVal), Math.ceil(maxVal)]}
                    stroke="#78716c"
                    tick={{ fill: '#a8a29e', fontSize: 10, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={{ stroke: '#44403c' }}
                    tickFormatter={(val) => `₹${val}`}
                    width={55}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-stone-900 border border-stone-700 p-2.5 shadow-2xl text-xs space-y-1">
                            <div className="text-stone-400 font-sans text-[11px]">{data.displayDate}</div>
                            <div className="font-mono text-sm font-bold text-amber-400">
                              {formatCurrency(data.rate, currency)}/g
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono">
                              <span className={data.changeInr >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                {data.changeInr >= 0 ? `+₹${data.changeInr}` : `₹${data.changeInr}`} ({data.changePercent}%)
                              </span>
                              <span className="text-stone-500">· 18K: ₹{data.rate18k}/g</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#fbbf24"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#goldRateGradient)"
                    activeDot={{ r: 5, fill: '#fbbf24', stroke: '#0c0a09', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Day-by-Day Historical Log Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-white uppercase tracking-wider">
              <span>Day-by-Day Rate Movement Table</span>
              <span className="text-[11px] text-stone-400 font-normal">Past {selectedDays} Trading Sessions</span>
            </div>

            <div className="border border-stone-800 overflow-x-auto max-h-56 overflow-y-auto bg-stone-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-900 border-b border-stone-800 text-stone-300 font-semibold sticky top-0 z-10 shadow-2xs">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">{selectedPurity} Rate (Per Gram)</th>
                    <th className="py-2.5 px-3">24K Bullion Base</th>
                    <th className="py-2.5 px-3">Daily Change</th>
                    <th className="py-2.5 px-3">Trajectory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-mono">
                  {history.map((rec) => {
                    const rate = getRateForPurity(rec, selectedPurity);
                    const isUp = rec.changeInr > 0;
                    const isDown = rec.changeInr < 0;

                    return (
                      <tr key={rec.date} className="hover:bg-stone-900/60 transition-colors">
                        <td className="py-2.5 px-3 font-sans text-stone-200 font-medium">
                          {rec.displayDate}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-amber-400">
                          {formatCurrency(rate, currency)}
                        </td>
                        <td className="py-2.5 px-3 text-stone-400">
                          ₹{rec.rate24k.toLocaleString('en-IN')}
                        </td>
                        <td className={`py-2.5 px-3 font-bold ${
                          isUp ? 'text-emerald-400' : isDown ? 'text-rose-400' : 'text-stone-400'
                        }`}>
                          {isUp ? `+₹${rec.changeInr}` : `₹${rec.changeInr}`} ({isUp ? `+${rec.changePercent}%` : `${rec.changePercent}%`})
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          {isUp && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>Increasing</span>
                            </span>
                          )}
                          {isDown && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                              <TrendingDown className="w-3.5 h-3.5" />
                              <span>Decreasing</span>
                            </span>
                          )}
                          {!isUp && !isDown && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-stone-400 font-medium">
                              <Minus className="w-3.5 h-3.5" />
                              <span>Steady</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 48-Hour Price Lock Guarantee Banner */}
          <div className="p-4 bg-stone-950 text-white border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>48-Hour Gold Price Protection</span>
              </div>
              <h4 className="text-sm font-bold font-editorial">
                Protect your custom order from daily rate spikes
              </h4>
              <p className="text-[11px] text-stone-300 max-w-md leading-relaxed">
                If gold rates increase over the next 48 hours, your order price remains frozen at today’s ₹6,150/g. If gold rates decrease, we automatically honor the lower price.
              </p>
            </div>

            <button
              onClick={() => onLockRate(!isPriceLocked)}
              className={`px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors shrink-0 cursor-pointer flex items-center justify-center gap-1.5 ${
                isPriceLocked
                  ? 'bg-amber-400 text-stone-950 font-bold hover:bg-amber-300'
                  : 'bg-stone-800 text-stone-200 border border-stone-700 hover:bg-stone-700'
              }`}
            >
              {isPriceLocked ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Rate Locked (₹6,150)</span>
                </>
              ) : (
                <span>Lock Today's Rate (48h)</span>
              )}
            </button>
          </div>

          {/* Atelier Formula Transparency Note */}
          <div className="p-3 bg-stone-950 text-stone-300 text-xs flex items-start gap-2 border border-stone-800">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px]">
              <strong className="text-white">Radical Price Transparency:</strong> Total Price = (Exact Gold Weight in Grams × Live Gold Rate) + Moissanite Stone Cost + Fixed Atelier Making Charge. We never mark up gold rates or hide middleman premiums.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-950 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-stone-800 text-stone-200 text-xs font-medium uppercase tracking-wider hover:bg-stone-700 transition-colors cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
