import React, { useState, useMemo } from 'react';
import { 
  Calculator as CalcIcon, 
  HelpCircle, 
  RefreshCw, 
  ArrowRight,
  UserCheck,
  Globe,
  Building2,
  ArrowLeftRight
} from 'lucide-react';
import { 
  IncomeType, 
  ResidencyStatus, 
  CalculationResult 
} from '../types';
import {
  RESIDENT_HEALTH_RATE,
  RESIDENT_TAX_RATE_9A_9B,
  RESIDENT_TAX_RATE_50,
  THRESHOLD_HEALTH_9A_9B,
  THRESHOLD_HEALTH_50,
  THRESHOLD_TAX_RESIDENT_9A_9B,
  THRESHOLD_TAX_RESIDENT_50,
  NON_RESIDENT_TAX_RATE_HIGH,
  NON_RESIDENT_TAX_RATE_LOW_50,
  NON_RESIDENT_TAX_RATE_HIGH_50,
  THRESHOLD_TAX_NON_RESIDENT_9A_9B,
  THRESHOLD_TAX_NON_RESIDENT_50,
  INCOME_TYPE_LABELS
} from '../constants';

enum CalcMode {
  GROSS_TO_NET = 'GROSS_TO_NET',
  NET_TO_GROSS = 'NET_TO_GROSS',
}

const Calculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [incomeType, setIncomeType] = useState<IncomeType>(IncomeType.TYPE_9A);
  const [residency, setResidency] = useState<ResidencyStatus>(ResidencyStatus.RESIDENT);
  const [hasTradeUnion, setHasTradeUnion] = useState<boolean>(false);
  const [isFirm, setIsFirm] = useState<boolean>(false);
  const [mode, setMode] = useState<CalcMode>(CalcMode.GROSS_TO_NET);
  
  // Extracted pure calculation logic
  const calculateMetrics = (
    gross: number, 
    type: IncomeType, 
    res: ResidencyStatus, 
    union: boolean, 
    firm: boolean
  ): CalculationResult => {
    let taxAmount = 0;
    let taxRate = 0;
    let healthAmount = 0;
    let healthRate = 0;
    const messages: string[] = [];

    if (gross === 0) {
      return {
        incomeAmount: 0,
        taxRate: 0,
        taxAmount: 0,
        healthInsuranceRate: 0,
        healthInsuranceAmount: 0,
        netPay: 0,
        messages: []
      };
    }

    if (res === ResidencyStatus.RESIDENT) {
      // === Resident Logic ===
      
      // 1. Health Insurance
      if (type === IncomeType.TYPE_92) {
         healthRate = 0;
         messages.push('代號92：不需扣繳二代健保');
      } else if (type === IncomeType.TYPE_9A || type === IncomeType.TYPE_9B) {
         if (union) {
            healthRate = 0;
            messages.push('已於職業工會投保：免扣繳補充保費');
         } else if (firm) {
            healthRate = 0;
            messages.push('給付對象為事務所 (非個人身分投保)：免扣繳補充保費');
         } else {
            const threshold = THRESHOLD_HEALTH_9A_9B;
            if (gross >= threshold) {
              healthRate = RESIDENT_HEALTH_RATE;
              healthAmount = Math.floor(gross * healthRate);
              messages.push(`達扣繳門檻 (${threshold.toLocaleString()}元)：需扣 ${RESIDENT_HEALTH_RATE * 100}% 二代健保`);
            } else {
               messages.push(`未達二代健保扣繳門檻 (${threshold.toLocaleString()}元)`);
            }
         }
      } else if (type === IncomeType.TYPE_50) {
         const threshold = THRESHOLD_HEALTH_50;
         if (gross >= threshold) {
           healthRate = RESIDENT_HEALTH_RATE;
           healthAmount = Math.floor(gross * healthRate);
           messages.push(`達扣繳門檻 (${threshold.toLocaleString()}元)：需扣 ${RESIDENT_HEALTH_RATE * 100}% 二代健保`);
         } else {
            messages.push(`未達二代健保扣繳門檻 (${threshold.toLocaleString()}元)`);
         }
      }

      // 2. Withholding Tax
      if (type === IncomeType.TYPE_92) {
        taxRate = 0;
        messages.push('代號92：不需扣繳所得稅');
      } else {
        let taxThreshold = 0;
        let applicableRate = 0;

        if (type === IncomeType.TYPE_9A || type === IncomeType.TYPE_9B) {
          taxThreshold = THRESHOLD_TAX_RESIDENT_9A_9B;
          applicableRate = RESIDENT_TAX_RATE_9A_9B;
        } else if (type === IncomeType.TYPE_50) {
          taxThreshold = THRESHOLD_TAX_RESIDENT_50;
          applicableRate = RESIDENT_TAX_RATE_50;
        }

        if (gross > taxThreshold) {
          taxRate = applicableRate;
          taxAmount = Math.floor(gross * taxRate);
          messages.push(`超過扣繳門檻 (${taxThreshold.toLocaleString()}元)：需扣 ${taxRate * 100}% 所得稅`);
        } else {
          messages.push(`未達所得稅扣繳門檻 (${taxThreshold.toLocaleString()}元)`);
        }
      }

    } else {
      // === Non-Resident Logic ===
      healthRate = 0;
      messages.push('非居住者：通常不需扣繳二代健保');

      if (type === IncomeType.TYPE_92) {
        taxRate = NON_RESIDENT_TAX_RATE_HIGH;
        taxAmount = Math.floor(gross * taxRate);
        messages.push('代號92 (非居住者)：扣繳 20% 所得稅');
      } else if (type === IncomeType.TYPE_9A || type === IncomeType.TYPE_9B) {
        if (gross <= THRESHOLD_TAX_NON_RESIDENT_9A_9B) {
           taxRate = 0;
           messages.push('5,000元以下：免扣繳');
        } else {
           taxRate = NON_RESIDENT_TAX_RATE_HIGH;
           taxAmount = Math.floor(gross * taxRate);
           messages.push('超過 5,000元：扣繳 20%');
        }
      } else if (type === IncomeType.TYPE_50) {
        if (gross <= THRESHOLD_TAX_NON_RESIDENT_50) {
          taxRate = NON_RESIDENT_TAX_RATE_LOW_50;
          taxAmount = Math.floor(gross * taxRate);
          messages.push('基本工資1.5倍以下：扣繳 6%');
        } else {
          taxRate = NON_RESIDENT_TAX_RATE_HIGH_50;
          taxAmount = Math.floor(gross * taxRate);
          messages.push('超過基本工資1.5倍：扣繳 18%');
        }
      }
    }

    return {
      incomeAmount: gross,
      taxRate,
      taxAmount,
      healthInsuranceRate: healthRate,
      healthInsuranceAmount: healthAmount,
      netPay: gross - taxAmount - healthAmount,
      messages
    };
  };

  const result: CalculationResult = useMemo(() => {
    const val = parseInt(amount) || 0;
    if (val === 0) {
      return calculateMetrics(0, incomeType, residency, hasTradeUnion, isFirm);
    }

    if (mode === CalcMode.GROSS_TO_NET) {
      // Standard forward calculation
      return calculateMetrics(val, incomeType, residency, hasTradeUnion, isFirm);
    } else {
      // Reverse calculation (Find Gross such that Net >= val)
      // 1. Check if the input itself works as gross (i.e., no deductions needed)
      const baseline = calculateMetrics(val, incomeType, residency, hasTradeUnion, isFirm);
      if (baseline.netPay >= val) {
        return {
          ...baseline,
          messages: [`實領與給付金額相同 (未達扣繳門檻)`, ...baseline.messages]
        };
      }

      // 2. Binary Search for Minimum Gross
      // Range: [Net, Net * 2] (Max deduction is usually < 22%, factor 1.3 is enough, use 2 for safety)
      let low = val;
      let high = Math.floor(val * 2.0); 
      let ans = high;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const res = calculateMetrics(mid, incomeType, residency, hasTradeUnion, isFirm);
        
        if (res.netPay >= val) {
          ans = mid;
          high = mid - 1; // Try to find a smaller gross
        } else {
          low = mid + 1; // Need more gross
        }
      }

      const finalRes = calculateMetrics(ans, incomeType, residency, hasTradeUnion, isFirm);
      return {
        ...finalRes,
        messages: [`反推結果：若需實領 $${val.toLocaleString()}，建議申報給付 $${ans.toLocaleString()}`, ...finalRes.messages]
      };
    }
  }, [amount, incomeType, residency, hasTradeUnion, isFirm, mode]);

  const handleReset = () => {
    setAmount('');
    setIncomeType(IncomeType.TYPE_9A);
    setResidency(ResidencyStatus.RESIDENT);
    setHasTradeUnion(false);
    setIsFirm(false);
    // Keep mode as is
  };

  const toggleMode = () => {
    setMode(prev => prev === CalcMode.GROSS_TO_NET ? CalcMode.NET_TO_GROSS : CalcMode.GROSS_TO_NET);
    setAmount(''); // Clear amount to avoid confusion
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-cyan-100">
      {/* Softer Header Color: cyan-500 instead of 600 */}
      <div className="bg-cyan-500 p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalcIcon className="w-6 h-6" />
            {mode === CalcMode.GROSS_TO_NET ? '正向扣繳試算' : '反向推算給付'}
          </h2>
          <p className="text-cyan-50 text-sm mt-1">
            {mode === CalcMode.GROSS_TO_NET 
              ? '輸入「給付金額」算出「實領金額」' 
              : '輸入「實領金額」反推「給付金額」'}
          </p>
        </div>
        <button 
          onClick={handleReset}
          className="p-2 bg-cyan-600 rounded-full hover:bg-cyan-700 transition-colors shadow-sm"
          title="重置"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Mode Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              mode === CalcMode.GROSS_TO_NET
                ? 'bg-white text-cyan-500 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setMode(CalcMode.GROSS_TO_NET)}
          >
            <ArrowRight className="w-4 h-4" />
            算實領 (由給付推算)
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              mode === CalcMode.NET_TO_GROSS
                ? 'bg-white text-indigo-500 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setMode(CalcMode.NET_TO_GROSS)}
          >
            <ArrowLeftRight className="w-4 h-4" />
            算給付 (由實領反推)
          </button>
        </div>

        {/* Input Section */}
        <div className="space-y-6">
          
          {/* Residency Toggle */}
          <div className="flex bg-cyan-50 p-1 rounded-xl w-full sm:w-fit">
             <button
                className={`flex-1 sm:flex-none py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  residency === ResidencyStatus.RESIDENT 
                    ? 'bg-white text-cyan-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setResidency(ResidencyStatus.RESIDENT)}
             >
                <UserCheck className="w-4 h-4" />
                居住者 (滿183天)
             </button>
             <button
                className={`flex-1 sm:flex-none py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  residency === ResidencyStatus.NON_RESIDENT 
                    ? 'bg-white text-cyan-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setResidency(ResidencyStatus.NON_RESIDENT)}
             >
                <Globe className="w-4 h-4" />
                非居住者 (未滿183天)
             </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className={`block text-sm font-bold mb-2 transition-colors ${
              mode === CalcMode.NET_TO_GROSS ? 'text-indigo-600' : 'text-gray-700'
            }`}>
              {mode === CalcMode.GROSS_TO_NET ? '給付金額 (稅前)' : '實領金額 (稅後)'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={mode === CalcMode.GROSS_TO_NET ? "請輸入給付金額" : "請輸入欲實領金額"}
                className={`w-full pl-8 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-colors text-lg font-medium text-gray-800 placeholder-gray-300 ${
                  mode === CalcMode.NET_TO_GROSS 
                    ? 'border-indigo-100 focus:border-indigo-400' 
                    : 'border-gray-100 focus:border-cyan-400'
                }`}
              />
            </div>
            {mode === CalcMode.NET_TO_GROSS && (
              <p className="text-xs text-indigo-500 mt-1">
                * 將為您反推需要申報的「給付總額」
              </p>
            )}
          </div>

          {/* Income Type Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              所得類別
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(INCOME_TYPE_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setIncomeType(key as IncomeType)}
                  className={`py-3 px-4 rounded-xl text-left border-2 transition-all ${
                    incomeType === key 
                      ? 'border-cyan-400 bg-cyan-50 text-cyan-700' 
                      : 'border-gray-100 bg-white text-gray-500 hover:border-cyan-200'
                  }`}
                >
                  <div className="font-bold">{key}</div>
                  <div className="text-xs opacity-80">{label.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          {(incomeType === IncomeType.TYPE_9A || incomeType === IncomeType.TYPE_9B) && residency === ResidencyStatus.RESIDENT && (
            <div className="space-y-3">
              {/* Trade Union Option */}
              <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${hasTradeUnion ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
                <input 
                  type="checkbox" 
                  id="tradeUnion" 
                  checked={hasTradeUnion}
                  onChange={(e) => {
                    setHasTradeUnion(e.target.checked);
                    if (e.target.checked) setIsFirm(false);
                  }}
                  className="w-5 h-5 text-cyan-500 rounded focus:ring-cyan-400 border-gray-300 cursor-pointer"
                />
                <label htmlFor="tradeUnion" className="text-sm text-gray-700 font-medium cursor-pointer select-none">
                  個人已於職業工會投保 (免扣二代健保)
                </label>
              </div>

              {/* Firm Option */}
              <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${isFirm ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-100'}`}>
                <input 
                  type="checkbox" 
                  id="isFirm" 
                  checked={isFirm}
                  onChange={(e) => {
                    setIsFirm(e.target.checked);
                    if (e.target.checked) setHasTradeUnion(false);
                  }}
                  className="w-5 h-5 text-cyan-500 rounded focus:ring-cyan-400 border-gray-300 cursor-pointer mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="isFirm" className="text-sm text-gray-700 font-medium cursor-pointer select-none flex items-center gap-2">
                    給付對象為事務所 (免扣二代健保)
                    {isFirm && <Building2 className="w-4 h-4 text-indigo-500" />}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    例如：會計師、建築師事務所等，非以個人身分投保者。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Result Divider */}
        <hr className="border-dashed border-gray-200" />

        {/* Results Section */}
        <div className="space-y-4">
          
          {/* Main Result Display (Swaps based on mode) */}
          <div className={`p-5 rounded-2xl text-white shadow-lg transition-colors ${
            mode === CalcMode.NET_TO_GROSS ? 'bg-indigo-500 shadow-indigo-100' : 'bg-cyan-500 shadow-cyan-100'
          }`}>
            <div className="flex justify-between items-center mb-2">
               <span className="text-white/90 font-medium text-sm">
                 {mode === CalcMode.NET_TO_GROSS ? '應申報給付總額 (Gross)' : '實領金額 (Net)'}
               </span>
               <ArrowRight className="w-5 h-5 text-white/60" />
            </div>
            <div className="text-4xl font-bold">
               $ {mode === CalcMode.NET_TO_GROSS ? result.incomeAmount.toLocaleString() : result.netPay.toLocaleString()}
            </div>
            {mode === CalcMode.NET_TO_GROSS && (
               <div className="mt-2 text-xs text-indigo-100 border-t border-indigo-400 pt-2">
                 * 為達成實領 ${parseInt(amount||'0').toLocaleString()}，公司需支付此總額
               </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Tax Result */}
             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="text-xs text-gray-500 mb-1 font-bold tracking-wide uppercase">代扣所得稅</div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-gray-800">
                    {result.taxAmount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 mb-1">
                     ( {residency === ResidencyStatus.RESIDENT && result.taxRate > 0 ? (result.taxRate * 100).toFixed(0) : (result.taxRate * 100).toFixed(result.taxRate % 1 === 0 ? 0 : 0)}% )
                  </span>
                </div>
             </div>

             {/* Health Result */}
             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="text-xs text-gray-500 mb-1 font-bold tracking-wide uppercase">二代健保</div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-gray-800">
                    {result.healthInsuranceAmount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 mb-1">
                    ( {(result.healthInsuranceRate * 100).toFixed(2)}% )
                  </span>
                </div>
             </div>
          </div>

          {/* Calculation Messages */}
          {result.messages.length > 0 && (
            <div className={`rounded-xl p-4 border ${
               mode === CalcMode.NET_TO_GROSS ? 'bg-indigo-50 border-indigo-100' : 'bg-cyan-50 border-cyan-100'
            }`}>
              <div className={`flex items-center gap-2 font-bold text-sm mb-2 ${
                 mode === CalcMode.NET_TO_GROSS ? 'text-indigo-600' : 'text-cyan-700'
              }`}>
                <HelpCircle className="w-4 h-4" />
                {mode === CalcMode.NET_TO_GROSS ? '反推計算說明' : '計算說明'}
              </div>
              <ul className="space-y-1">
                {result.messages.map((msg, idx) => (
                  <li key={idx} className={`text-xs flex items-start gap-1.5 ${
                     mode === CalcMode.NET_TO_GROSS ? 'text-indigo-800' : 'text-cyan-800'
                  }`}>
                    <span className={`mt-1 block w-1 h-1 rounded-full flex-shrink-0 ${
                       mode === CalcMode.NET_TO_GROSS ? 'bg-indigo-400' : 'bg-cyan-400'
                    }`} />
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Calculator;