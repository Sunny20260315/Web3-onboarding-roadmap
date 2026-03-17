import React, { useState } from 'react';
import { ArrowDownUp, Settings, CheckCircle2, Zap } from 'lucide-react';
import { ETH_TOKEN, USDC_TOKEN, DEFAULT_SLIPPAGE } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
}

interface Transaction {
  hash: string;
  type: 'swap' | 'send' | 'receive';
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
}

export const SwapPanel: React.FC = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>(ETH_TOKEN);
  const [toToken, setToToken] = useState<Token>(USDC_TOKEN);
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSlippageModal, setShowSlippageModal] = useState(false);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);

  const exchangeRate = 3500;

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value && !isNaN(Number(value))) {
      const estimated = (Number(value) * exchangeRate).toFixed(2);
      setToAmount(estimated);
    } else {
      setToAmount('');
    }
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    if (value && !isNaN(Number(value))) {
      const estimated = (Number(value) / exchangeRate).toFixed(6);
      setFromAmount(estimated);
    } else {
      setFromAmount('');
    }
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);

    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = async () => {
    if (!fromAmount) return;

    setIsSwapping(true);

    setTimeout(() => {
      const newTransaction: Transaction = {
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        type: 'swap',
        fromToken: fromToken.symbol,
        toToken: toToken.symbol,
        fromAmount,
        toAmount,
        timestamp: Date.now(),
        status: 'success',
      };

      setTransactions([newTransaction, ...transactions]);

      setIsSwapping(false);
      setFromAmount('');
      setToAmount('');
    }, 2000);
  };

  return (
    <div className="glass-card-neon rounded-3xl p-8 w-full max-w-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
          <h2 className="text-2xl font-black text-white">INSTANT SWAP</h2>
        </div>
        <button
          onClick={() => setShowSlippageModal(true)}
          className="p-3 hover:bg-slate-800/50 rounded-xl transition-all duration-300 group"
        >
          <Settings className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="relative bg-slate-900/60 rounded-2xl p-6 border border-slate-800/50 group hover:border-cyan-500/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400 font-mono tracking-wider uppercase">From</span>
              <span className="text-sm text-slate-500 font-mono">Balance: --</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.0"
                className="flex-1 bg-transparent text-4xl font-black text-white outline-none placeholder:text-slate-700 font-mono"
              />
              <div className="flex items-center gap-3 bg-slate-800/80 rounded-xl px-4 py-3 border border-slate-700/50 backdrop-blur-xl">
                {fromToken.logoURI && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-md opacity-40" />
                    <img
                      src={fromToken.logoURI}
                      alt={fromToken.symbol}
                      className="relative w-8 h-8 rounded-full shadow-lg"
                    />
                  </div>
                )}
                <span className="font-bold text-white text-lg">{fromToken.symbol}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center relative">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <button
            onClick={handleSwapTokens}
            className="relative z-10 p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all duration-300 border border-slate-700 shadow-xl hover:shadow-cyan-500/20 hover:scale-110 group"
          >
            <ArrowDownUp className="w-7 h-7 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        <div className="relative bg-slate-900/60 rounded-2xl p-6 border border-slate-800/50 group hover:border-purple-500/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-l from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400 font-mono tracking-wider uppercase">To</span>
              <span className="text-sm text-slate-500 font-mono">Balance: --</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={toAmount}
                onChange={(e) => handleToAmountChange(e.target.value)}
                placeholder="0.0"
                className="flex-1 bg-transparent text-4xl font-black text-white outline-none placeholder:text-slate-700 font-mono"
              />
              <div className="flex items-center gap-3 bg-slate-800/80 rounded-xl px-4 py-3 border border-slate-700/50 backdrop-blur-xl">
                {toToken.logoURI && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-40" />
                    <img
                      src={toToken.logoURI}
                      alt={toToken.symbol}
                      className="relative w-8 h-8 rounded-full shadow-lg"
                    />
                  </div>
                )}
                <span className="font-bold text-white text-lg">{toToken.symbol}</span>
              </div>
            </div>
          </div>
        </div>

        {fromAmount && toAmount && (
          <div className="bg-slate-900/40 rounded-2xl p-5 border border-slate-800/50 space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 font-mono">EXCHANGE RATE</span>
              <span className="text-white font-mono">1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 font-mono">SLIPPAGE</span>
              <span className="text-emerald-400 font-mono font-bold">{slippage}%</span>
            </div>
          </div>
        )}

        <button
          onClick={handleSwap}
          disabled={!fromAmount || isSwapping}
          className="w-full h-16 text-lg font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-cyan-500/25 rounded-2xl text-white group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
          {isSwapping ? (
            <span className="flex items-center justify-center gap-3 relative z-10">
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              EXECUTING...
            </span>
          ) : (
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 fill-current" />
              INITIATE SWAP
            </span>
          )}
        </button>
      </div>

      {showSlippageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50">
          <div className="glass-card-neon rounded-3xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <Settings className="w-6 h-6 text-cyan-400" />
              SLIPPAGE CONFIG
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-slate-400 mb-4 block font-mono tracking-wider uppercase">Slippage Tolerance</label>
                <div className="grid grid-cols-3 gap-3">
                  {[0.5, 1.0, 2.0].map((value) => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                        slippage === value
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowSlippageModal(false)}
                className="w-full py-4 bg-slate-800/50 text-white rounded-xl font-bold text-lg hover:bg-slate-700/50 border border-slate-700/50 transition-all duration-300"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
