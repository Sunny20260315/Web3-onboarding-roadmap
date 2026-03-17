import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Clock, CheckCircle2, XCircle, ArrowRight, History } from 'lucide-react';

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

export const TransactionHistory: React.FC = () => {
  const [transactions] = useLocalStorage<Transaction[]>('transactions', []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-md" />
            <CheckCircle2 className="w-6 h-6 text-emerald-400 relative" />
          </div>
        );
      case 'failed':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/30 rounded-full blur-md" />
            <XCircle className="w-6 h-6 text-red-400 relative" />
          </div>
        );
      default:
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-md animate-pulse" />
            <Clock className="w-6 h-6 text-yellow-400 relative animate-spin" />
          </div>
        );
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="glass-card-neon rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-50" />
            <History className="w-6 h-6 text-cyan-400 relative" />
          </div>
          <h3 className="text-2xl font-black text-white">TRANSACTION LOG</h3>
        </div>
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
            <History className="w-10 h-10 text-slate-600" />
          </div>
          <p className="text-slate-400 text-lg font-medium">NO TRANSACTIONS YET</p>
          <p className="text-sm text-slate-500 mt-2 font-mono">Your swap activity will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-neon rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-50 animate-pulse-glow" />
          <History className="w-6 h-6 text-cyan-400 relative" />
        </div>
        <h3 className="text-2xl font-black text-white">TRANSACTION LOG</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-sm font-mono">LIVE</span>
        </div>
      </div>
      <div className="space-y-4">
        {transactions.map((tx, index) => (
          <div
            key={tx.hash}
            className="group relative overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl hover:bg-slate-800/40 transition-all duration-300 border border-slate-800/50 group-hover:border-cyan-500/30">
              <div className="flex items-center gap-5">
                {getStatusIcon(tx.status)}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-lg font-mono">
                      {tx.fromAmount} {tx.fromToken}
                    </span>
                    <div className="relative">
                      <ArrowRight className="w-5 h-5 text-cyan-400" />
                      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md" />
                    </div>
                    <span className="text-white font-bold text-lg font-mono">
                      {tx.toAmount} {tx.toToken}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 font-mono mt-1">{formatDate(tx.timestamp)}</p>
                </div>
              </div>
              <a
                href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link relative px-5 py-2.5 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300"
              >
                <span className="text-cyan-400 font-bold text-sm group-hover/link:text-white transition-colors">
                  VIEW TX
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
