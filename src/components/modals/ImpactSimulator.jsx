import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { calculateImpact, formatCurrency } from '../../utils/impactCalculator';
import { CHART_COLORS } from '../../constants';

const ImpactSimulator = ({ isOpen, onClose, darkMode, currentPrincipal = 0, onProceed }) => {
  const [amount, setAmount] = useState(10000);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleProceed = () => {
    setShowSuccess(true);
    if (onProceed) {
      onProceed(amount);
    }
    // Auto close after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 3000);
  };

  const impact = useMemo(() => calculateImpact(amount), [amount]);

  const projectionChartData = impact.projections.map(p => ({
    year: `Year ${p.year}`,
    beneficiaries: p.totalBeneficiaries,
    yield: p.totalYield
  }));

  const presetAmounts = [5000, 10000, 25000, 50000, 100000];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${darkMode ? 'bg-stone-800' : 'bg-white'}`}>
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 border-b backdrop-blur-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                📈 Impact Simulator
              </h2>
              <p className="text-emerald-100 text-sm mt-1">See how your investment creates perpetual impact</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>
              Investment Amount
            </label>
            <div className="flex gap-3 items-center">
              <span className={`text-2xl ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className={`flex-1 text-3xl font-light p-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  darkMode
                    ? 'bg-stone-700 border-stone-600 text-stone-100'
                    : 'bg-stone-50 border-stone-200 text-stone-800'
                }`}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              />
            </div>

            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {presetAmounts.map(preset => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    amount === preset
                      ? 'bg-emerald-600 text-white'
                      : darkMode
                        ? 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {formatCurrency(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className={`grid md:grid-cols-3 gap-4 p-6 rounded-2xl ${darkMode ? 'bg-stone-700' : 'bg-gradient-to-br from-emerald-50 to-amber-50'}`}>
            <div className="text-center">
              <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>Annual Net Yield</p>
              <p className="text-3xl font-bold text-emerald-600" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {formatCurrency(impact.netYield)}
              </p>
              <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>@ {impact.yieldRate}% yield</p>
            </div>
            <div className="text-center">
              <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>Children Educated</p>
              <p className="text-3xl font-bold text-amber-600" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {impact.childrenEducated}
              </p>
              <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>per year, perpetually</p>
            </div>
            <div className="text-center">
              <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>Livelihood Packages</p>
              <p className="text-3xl font-bold text-purple-600" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {impact.livelihoodPackages}
              </p>
              <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>per year, perpetually</p>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-stone-700/50' : 'bg-stone-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={darkMode ? 'text-stone-300' : 'text-stone-600'}>Gross Yield ({impact.yieldRate}%)</span>
              <span className={`font-semibold ${darkMode ? 'text-stone-100' : 'text-stone-800'}`}>{formatCurrency(impact.grossYield)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className={darkMode ? 'text-stone-300' : 'text-stone-600'}>Overhead ({impact.overheadPercent}%)</span>
              <span className="font-semibold text-red-500">- {formatCurrency(impact.overhead)}</span>
            </div>
            <div className="h-px bg-stone-300 my-2" />
            <div className="flex items-center justify-between">
              <span className={`font-medium ${darkMode ? 'text-stone-100' : 'text-stone-800'}`}>Net to Impact ({impact.netToImpactRate}%)</span>
              <span className="font-bold text-emerald-600 text-lg">{formatCurrency(impact.netYield)}</span>
            </div>
          </div>

          {/* Projection Chart */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-stone-100' : 'text-stone-800'}`}>
              10-Year Perpetual Impact
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={projectionChartData}>
                <XAxis dataKey="year" stroke={darkMode ? '#a8a29e' : '#78716c'} />
                <YAxis yAxisId="left" stroke={darkMode ? '#a8a29e' : '#78716c'} />
                <YAxis yAxisId="right" orientation="right" stroke={darkMode ? '#a8a29e' : '#78716c'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#292524' : '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="beneficiaries" name="Total Beneficiaries" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="yield" name="Total Yield ($)" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sadaqah Jariyah Quote */}
          <div className={`p-6 rounded-2xl text-center ${darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
            <p className={`text-lg italic ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              "When a person dies, their deeds end except for three: continuous charity (sadaqah jariyah), beneficial knowledge, or a righteous child who prays for them."
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>— Sahih Muslim</p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-center animate-pulse">
              <p className="text-2xl mb-2">✅ Alhamdulillah!</p>
              <p className="text-lg">Your investment request of {formatCurrency(amount)} has been submitted.</p>
              <p className="text-sm mt-2 opacity-80">Our team will contact you within 24 hours to complete the process.</p>
            </div>
          )}

          {/* CTA */}
          {!showSuccess && (
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className={`flex-1 py-4 rounded-xl font-medium transition-colors ${
                  darkMode
                    ? 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Close
              </button>
              <button
                onClick={handleProceed}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:scale-[1.02]"
              >
                Proceed with {formatCurrency(amount)} 🌱
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImpactSimulator;
