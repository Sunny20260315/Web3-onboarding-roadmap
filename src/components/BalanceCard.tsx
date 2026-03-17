import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Wallet, Coins, TrendingUp } from 'lucide-react';

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
}

interface BalanceCardProps {
  token: Token;
  usdPrice?: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ token, usdPrice = 3500 }) => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: token.address === '0x000000000000000000000000000000000000000' ? undefined : token.address as `0x${string}`,
  });

  const formatBalance = (value: bigint | undefined, decimals: number) => {
    if (!value) return '0.00';
    const formatted = Number(value) / 10 ** decimals;
    return formatted.toFixed(4);
  };

  const calculateUSDValue = (value: bigint | undefined, decimals: number) => {
    if (!value) return '$0.00';
    const formatted = Number(value) / 10 ** decimals;
    const usdValue = formatted * usdPrice;
    return `$${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="glass-card-neon rounded-3xl p-8 hover:scale-[1.02] transition-all duration-500 group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {token.logoURI ? (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse-glow"></div>
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="relative w-14 h-14 rounded-full shadow-xl shadow-cyan-500/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl">
              <Coins className="w-7 h-7 text-white" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-white">{token.name}</h3>
            <p className="text-sm text-slate-400 font-mono">{token.symbol}</p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-lg"></div>
          <Wallet className="w-7 h-7 text-cyan-400 relative" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <p className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
            {formatBalance(balance?.value, token.decimals)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {calculateUSDValue(balance?.value, token.decimals)}
          </p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-800