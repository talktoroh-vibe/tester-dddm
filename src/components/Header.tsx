import React, { useState } from 'react';
import { Search, Globe, User, Menu, X, ChevronDown, Check, TrendingUp, BarChart2, Shield, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenTrading: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  balance: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenTrading,
  activeNav,
  setActiveNav,
  balance,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English (US)');

  const languages = ['English (US)', 'English (UK)', 'Deutsch', 'Español', 'Français', '日本語', '한국어', '简体中文'];

  return (
    <header className="bg-[#131722] border-b border-[#363A45] w-full sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 w-full max-w-[1440px] mx-auto">
        {/* Logo & Search (Left Side) */}
        <div className="flex items-center gap-6 sm:gap-8 flex-shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            {/* Exact TradingView geometric icon */}
            <svg
              className="text-[#dfe2f2] group-hover:text-white transition-colors"
              fill="none"
              height="28"
              viewBox="0 0 28 28"
              width="28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0H9V28H0V0Z" fill="currentColor" />
              <path d="M11 0H28V9H11V0Z" fill="currentColor" />
              <path d="M19 11H28V28H19V11Z" fill="currentColor" />
            </svg>
            <span className="sr-only">TradingView</span>
          </a>

          {/* Search Bar matching the design */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden md:flex items-center bg-[#1E222D] hover:bg-[#262A35] rounded-full px-4 py-2 border border-[#363A45] focus:outline-none focus:border-[#2962FF] transition-all w-64 group text-left cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#8d90a2] mr-2 group-hover:text-[#dfe2f2] transition-colors" />
            <span className="text-xs text-[#8d90a2] group-hover:text-[#dfe2f2] flex-grow">
              Search (Ctrl+K)
            </span>
            <kbd className="hidden lg:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#131722] text-[#8d90a2] border border-[#363A45]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Links (Center) */}
        <nav className="hidden md:flex items-center gap-6 h-full relative">
          {/* Products with Dropdown */}
          <div className="relative h-full flex items-center">
            <button
              onClick={() => {
                setProductsOpen(!productsOpen);
                setUserMenuOpen(false);
              }}
              className={`text-sm font-medium transition-colors duration-200 px-2 py-1 rounded-md flex items-center gap-1 ${
                productsOpen ? 'text-[#dfe2f2] bg-[#1E222D]' : 'text-[#8d90a2] hover:text-[#dfe2f2] hover:bg-[#1E222D]'
              }`}
            >
              Products
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {productsOpen && (
              <div className="absolute top-14 left-0 w-64 bg-[#1E222D] border border-[#363A45] rounded-xl shadow-2xl p-2 z-50">
                <div className="p-2 border-b border-[#363A45]/60 mb-1">
                  <div className="text-xs font-semibold text-[#8d90a2] uppercase tracking-wider">Trading Tools</div>
                </div>
                <button
                  onClick={() => {
                    setActiveNav('Supercharts');
                    setProductsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#dfe2f2] hover:bg-[#262A35] rounded-lg transition-colors text-left"
                >
                  <TrendingUp className="w-4 h-4 text-[#2962FF]" />
                  <div>
                    <div className="font-medium text-white">Supercharts</div>
                    <div className="text-[11px] text-[#8d90a2]">Real-time interactive technical analysis</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveNav('Screeners');
                    setProductsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#dfe2f2] hover:bg-[#262A35] rounded-lg transition-colors text-left"
                >
                  <BarChart2 className="w-4 h-4 text-[#089981]" />
                  <div>
                    <div className="font-medium text-white">Stock & Crypto Screener</div>
                    <div className="text-[11px] text-[#8d90a2]">Filter 10,000+ assets by 100+ metrics</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveNav('Heatmaps');
                    setProductsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#dfe2f2] hover:bg-[#262A35] rounded-lg transition-colors text-left"
                >
                  <Layers className="w-4 h-4 text-[#F23645]" />
                  <div>
                    <div className="font-medium text-white">Market Heatmaps</div>
                    <div className="text-[11px] text-[#8d90a2]">Visual market cap & sector performance</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveNav('Community')}
            className={`text-sm font-medium transition-colors duration-200 px-2 py-1 rounded-md h-full flex items-center ${
              activeNav === 'Community'
                ? 'text-[#2962FF] border-b-2 border-[#2962FF]'
                : 'text-[#8d90a2] hover:text-[#dfe2f2] hover:bg-[#1E222D]'
            }`}
          >
            Community
          </button>

          <button
            onClick={() => setActiveNav('Markets')}
            className={`text-sm font-medium transition-colors duration-200 px-2 py-1 rounded-md h-full flex items-center ${
              activeNav === 'Markets'
                ? 'text-[#2962FF] border-b-2 border-[#2962FF] font-semibold'
                : 'text-[#8d90a2] hover:text-[#dfe2f2] hover:bg-[#1E222D]'
            }`}
          >
            Markets
          </button>

          <button
            onClick={() => setActiveNav('Brokers')}
            className={`text-sm font-medium transition-colors duration-200 px-2 py-1 rounded-md h-full flex items-center ${
              activeNav === 'Brokers'
                ? 'text-[#2962FF] border-b-2 border-[#2962FF]'
                : 'text-[#8d90a2] hover:text-[#dfe2f2] hover:bg-[#1E222D]'
            }`}
          >
            Brokers
          </button>

          <button
            onClick={() => setActiveNav('More')}
            className={`text-sm font-medium transition-colors duration-200 px-2 py-1 rounded-md h-full flex items-center ${
              activeNav === 'More'
                ? 'text-[#2962FF] border-b-2 border-[#2962FF]'
                : 'text-[#8d90a2] hover:text-[#dfe2f2] hover:bg-[#1E222D]'
            }`}
          >
            More
          </button>
        </nav>

        {/* Trailing Actions (Right Side) */}
        <div className="flex items-center gap-3 sm:gap-4 relative">
          {/* Paper Trading Balance Chip */}
          <div className="hidden lg:flex items-center gap-2 bg-[#1E222D] border border-[#363A45] px-3 py-1.5 rounded-full text-xs">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
            <span className="text-[#8d90a2]">Paper Balance:</span>
            <span className="font-mono font-semibold text-white">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          {/* Search Button on Mobile */}
          <button
            onClick={onOpenSearch}
            className="md:hidden text-[#8d90a2] hover:text-white p-2 rounded-full hover:bg-[#1E222D]"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setLangModalOpen(!langModalOpen);
                setUserMenuOpen(false);
              }}
              className="text-[#8d90a2] hover:text-white transition-colors p-2 rounded-full hover:bg-[#1E222D] hidden sm:flex items-center justify-center cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-5 h-5" />
            </button>

            {langModalOpen && (
              <div className="absolute right-0 top-12 w-48 bg-[#1E222D] border border-[#363A45] rounded-xl shadow-2xl p-1.5 z-50">
                <div className="text-[11px] font-semibold text-[#8d90a2] px-3 py-1.5 uppercase">Select Language</div>
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLang(lang);
                      setLangModalOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#dfe2f2] hover:bg-[#262A35] rounded-lg transition-colors"
                  >
                    <span>{lang}</span>
                    {selectedLang === lang && <Check className="w-3.5 h-3.5 text-[#2962FF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setLangModalOpen(false);
              }}
              className="text-[#8d90a2] hover:text-white transition-colors p-2 rounded-full hover:bg-[#1E222D] hidden sm:flex items-center justify-center cursor-pointer"
              title="User Account"
            >
              <User className="w-5 h-5" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-12 w-60 bg-[#1E222D] border border-[#363A45] rounded-xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-[#363A45]/60 mb-2">
                  <div className="font-semibold text-xs text-white">Trader Account</div>
                  <div className="text-[11px] text-[#8d90a2]">talktoroh@gmail.com</div>
                </div>
                <button
                  onClick={() => {
                    onOpenTrading();
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#dfe2f2] hover:bg-[#262A35] rounded-lg transition-colors text-left"
                >
                  <TrendingUp className="w-4 h-4 text-[#089981]" />
                  <span>Paper Trading Terminal</span>
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#dfe2f2] hover:bg-[#262A35] rounded-lg transition-colors text-left"
                >
                  <Shield className="w-4 h-4 text-[#2962FF]" />
                  <span>Security & API Keys</span>
                </button>
              </div>
            )}
          </div>

          {/* Get started button */}
          <button
            onClick={onOpenTrading}
            className="bg-[#2962FF] hover:bg-[#1e4cd2] active:scale-95 text-white font-medium text-sm py-2 px-5 rounded-full transition-all duration-200 shadow-md shadow-[#2962FF]/20 cursor-pointer whitespace-nowrap"
          >
            Get started
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#8d90a2] hover:text-white p-2 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#131722] border-b border-[#363A45] px-4 py-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#363A45]">
            <span className="text-xs text-[#8d90a2]">Paper Balance:</span>
            <span className="font-mono text-sm font-semibold text-[#089981]">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            {['Markets', 'Products', 'Community', 'Brokers', 'More'].map((nav) => (
              <button
                key={nav}
                onClick={() => {
                  setActiveNav(nav);
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 text-sm rounded-lg text-left ${
                  activeNav === nav ? 'bg-[#2962FF] text-white font-semibold' : 'text-[#8d90a2] hover:bg-[#1E222D]'
                }`}
              >
                {nav}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
