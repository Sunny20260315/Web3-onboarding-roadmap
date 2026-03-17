import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { BalanceCard } from './components/BalanceCard';
import { SwapPanel } from './components/SwapPanel';
import { TransactionHistory } from './components/TransactionHistory';
import { ETH_TOKEN, USDC_TOKEN } from './constants';
import { Wallet, Zap, Sparkles, Globe, Shield, Cpu, Activity } from 'lucide-react';

function App() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-slate-950 cyber-grid relative">
      {/* 装饰性背景元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-blue-600/10 rounded-full blur-[120px]" />
        
        {/* 粒子效果 */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <nav className="relative z-10 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur-xl opacity-60 animate-pulse-glow" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
                  <Zap className="w-8 h-8 text-white fill-current" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent neon-text">
                  DeFi NEXUS
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">Sepolia • LIVE</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="hidden md:flex items-center gap-8 text-sm">
                <a href="#" className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-all duration-300">
                  <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Protocol</span>
                </a>
                <a href="#" className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-all duration-300">
                  <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Security</span>
                </a>
                <a href="#" className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-all duration-300">
                  <Cpu className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Analytics</span>
                </a>
              </div>
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="relative inline-block mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-[2rem] blur-3xl opacity-40 animate-pulse-glow" />
              <div className="relative w-40 h-40 mx-auto rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700/50 flex items-center justify-center shadow-2xl animate-float">
                <Wallet className="w-20 h-20 text-cyan-400" />
                <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Enter the
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-2">
                DeFi Matrix
              </span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Harness the power of decentralized finance. Connect your wallet to 
              <span className="text-cyan-400 font-semibold"> swap tokens</span>, 
              <span className="text-blue-400 font-semibold"> track balances</span>, and 
              <span className="text-purple-400 font-semibold"> dominate</span> the markets.
            </p>
            
            <div className="flex flex-col items-center gap-6">
              <ConnectButton />
              
              <div className="flex items-center gap-3 text-sm text-slate-500 mt-6">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-mono">SYSTEM ONLINE • POWERED BY RAINBOWKIT</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BalanceCard token={ETH_TOKEN} usdPrice={3500} />
              <BalanceCard token={USDC_TOKEN} usdPrice={1} />
            </div>

            <div className="flex justify-center">
              <SwapPanel />
            </div>

            <div className="max-w-3xl mx-auto">
              <TransactionHistory />
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-3xl mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-purple-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-xl text-white">DeFi NEXUS</h3>
                <p className="text-sm text-slate-500 font-mono">ENGINEERED FOR THE FUTURE</p>
              </div>
            </div>
            
            <div className="flex items-center gap-12">
              <div className="text-center group cursor-pointer">
                <p className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">50K+</p>
                <p className="text-sm text-slate-500 font-mono">ACTIVE USERS</p>
              </div>
              <div className="text-center group cursor-pointer">
                <p className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">$250M+</p>
                <p className="text-sm text-slate-500 font-mono">TOTAL VOLUME</p>
              </div>
              <div className="text-center group cursor-pointer">
                <p className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">99.99%</p>
                <p className="text-sm text-slate-500 font-mono">UPTIME</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 font-mono">
              © 2026 DeFi NEXUS. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
