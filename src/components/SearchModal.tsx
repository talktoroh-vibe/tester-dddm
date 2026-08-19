import React, { useState, useEffect, useRef } from 'react';
import { Asset } from '../types';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Stocks' | 'Crypto' | 'Futures' | 'Forex' | 'Bonds'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssets = assets.filter((asset) => {
    const matchesQuery =
      asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
      asset.name.toLowerCase().includes(query.toLowerCase()) ||
      asset.category.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;

    if (activeFilter === 'Stocks') return asset.category.includes('stocks');
    if (activeFilter === 'Crypto') return asset.category === 'Crypto';
    if (activeFilter === 'Futures') return asset.category === 'Futures';
    if (activeFilter === 'Forex') return asset.category === 'Forex';
    if (activeFilter === 'Bonds') return asset.category.includes('bonds');

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="relative w-full max-w-2xl bg-[#1E222D] border border-[#363A45] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#363A45] bg-[#171B26]">
          <Search className="w-5 h-5 text-[#8d90a2] mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbols, tickers, companies, indices, crypto..."
            className="w-full bg-transparent border-none text-[#dfe2f2] placeholder-[#8d90a2] text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8d90a2] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-3 text-[11px] font-mono px-2 py-0.5 rounded bg-[#131722] text-[#8d90a2] border border-[#363A45]">
            ESC
          </kbd>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#131722] border-b border-[#363A45] overflow-x-auto no-scrollbar text-xs">
          {['All', 'Stocks', 'Crypto', 'Futures', 'Forex', 'Bonds'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-3 py-1 rounded-full transition-colors font-medium whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-[#2962FF] text-white'
                  : 'text-[#8d90a2] hover:text-[#dfe2f2] hover:bg-[#1E222D]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#363A45]/40 p-2">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-[#8d90a2] text-sm">
              No matching instruments found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const isPositive = asset.changePercent >= 0;
              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#262A35] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        backgroundColor:
                          asset.badgeBgColor || (isPositive ? '#089981' : '#F23645'),
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px] text-white font-bold flex-shrink-0"
                    >
                      {asset.badgeNumber || asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#dfe2f2] group-hover:text-[#2962FF] flex items-center gap-2">
                        <span>{asset.symbol}</span>
                        <span className="text-[10px] font-normal text-[#8d90a2] bg-[#131722] px-1.5 py-0.5 rounded border border-[#363A45]">
                          {asset.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#8d90a2]">{asset.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <div className="text-sm font-semibold text-[#dfe2f2]">
                        {asset.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: asset.price < 2 ? 4 : 2,
                        })}
                      </div>
                      <div
                        className={`text-xs font-semibold ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-[#8d90a2] group-hover:text-[#2962FF] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
