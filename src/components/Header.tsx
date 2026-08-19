import React, { useState } from 'react';
import { 
  Search, Globe, User, Bell, Volume2, VolumeX, 
  Layers, Zap, ShieldCheck, DollarSign, LayoutGrid 
} from 'lucide-react';
import { isSoundEnabled, setSoundEnabled } from '../utils/audio';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenTrading: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  balance: number;
  unrealizedPnL: number;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onToggleTerminal: () => void;
  terminalOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenTrading,
  activeNav,
  setActiveNav,
  balance,
  unrealizedPnL,
  onToggleSidebar,
  sidebarOpen,
  onToggleTerminal,
  terminalOpen,
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const navItems = ['Products', 'Community', 'Markets', 'Brokers', 'More'];

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const totalEquity = balance + unrealizedPnL;

  return (
    <header className="bg-[#131722] border-b border-[#363A45] sticky top-0 z-40 text-[#dfe2f2]">
      <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Main Nav */}
        <div className="flex items-center gap-6 sm:gap-8">
          {/* TradingView Geometric Logo */}
          <div className="flex items-center gap-2 cursor-pointer select-none group">
            <svg
              className="w-8 h-8 transition-transform group-hover:scale-105"
              viewBox="0 0 36 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 22H7C5.34315 22 4 20.6569 4 19V9C4 7.34315 5.34315 6 7 6H14V22Z"
                fill="#2962FF"
              />
              <path
                d="M15 6H21V22H15V6Z"
                fill="#2962FF"
              />
              <path
                d="M22 6H29C30.6569 6 32 7.34315 32 9V19C32 20.6569 30.6569 22 29 22H22V6Z"
                fill="#2962FF"
              />
            </svg>
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-bold text-lg tracking-tight text-white">
                TradingView
              </span>
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[9px] font-extrabold px-1.5 py-0.2 rounded font-mono shadow-sm">
                PRO+
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors relative cursor-pointer ${
                  activeNav === item
                    ? 'text-white'
                    : 'text-[#8d90a2] hover:text-white hover:bg-[#1E222D]'
                }`}
              >
                {item}
                {activeNav === item && (
                  <span className="absolute bottom-[-14px] left-3 right-3 h-[2px] bg-[#2962FF] rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Search Bar Trigger (Ctrl+K) */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between bg-[#1E222D] hover:bg-[#262A35] border border-[#363A45] hover:border-[#8d90a2]/50 text-[#8d90a2] hover:text-white px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer shadow-inner group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#8d90a2] group-hover:text-white transition-colors" />
              <span className="truncate">Search symbols, indices, crypto...</span>
            </div>
            <kbd className="hidden sm:inline-block bg-[#131722] border border-[#363A45] rounded px-1.5 py-0.5 text-[10px] font-mono text-[#8d90a2]">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Tools, Terminal, Audio, Portfolio, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 text-[#8d90a2] hover:text-white hover:bg-[#1E222D] rounded-lg transition-colors"
            title={soundOn ? 'Trading Audio Enabled' : 'Trading Audio Muted'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#089981]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Paper Portfolio / Trading Button */}
          <button
            onClick={onOpenTrading}
            className="bg-[#1E222D] hover:bg-[#262A35] border border-[#363A45] text-white px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer"
            title="Open Order Ticket"
          >
            <div className="w-2 h-2 rounded-full bg-[#089981] animate-pulse" />
            <span className="hidden sm:inline text-[#8d90a2]">Equity:</span>
            <span className="font-bold text-white">${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          </button>

          {/* Quick Terminal Drawer Toggle */}
          <button
            onClick={onToggleTerminal}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors hidden md:flex items-center gap-1.5 ${
              terminalOpen
                ? 'bg-[#2962FF]/20 border-[#2962FF] text-white'
                : 'bg-[#1E222D] border-[#363A45] text-[#8d90a2] hover:text-white'
            }`}
            title="Toggle Bottom Trading Terminal"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="text-[11px]">Terminal</span>
          </button>

          {/* Quick Pro Panel Toggle */}
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg border transition-colors ${
              sidebarOpen
                ? 'bg-[#2962FF] border-[#2962FF] text-white'
                : 'bg-[#1E222D] border-[#363A45] text-[#8d90a2] hover:text-white'
            }`}
            title="Toggle Right Pro Tools"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* User Profile */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2962FF] to-[#A855F7] p-0.5 flex items-center justify-center cursor-pointer shadow">
            <div className="w-full h-full bg-[#131722] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
