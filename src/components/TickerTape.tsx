import React from 'react';
import { Asset } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerTapeProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  selectedAssetId: string;
}

export const TickerTape: React.FC<TickerTapeProps> = ({
  assets,
  onSelectAsset,
  selectedAssetId,
}) => {
  // Key ticker assets to show
  const tapeSymbols = ['SPX', 'NDX', 'DJI', 'BTC/USD', 'ETH/USD', 'GC1!', 'CL1!', 'EUR/USD', 'NVDA', 'AAPL', 'US10Y'];
  const tapeAssets = assets.filter((a) => tapeSymbols.includes(a.symbol));

  return (
    <div className="bg-[#0b0e14] border-b border-[#363A45]/80 h-8 flex items-center overflow-x-auto no-scrollbar select-none text-xs">
      <div className="flex items-center gap-6 px-4 min-w-max">
        <div className="flex items-center gap-1.5 pr-2 border-r border-[#363A45]/60 text-[10px] uppercase font-bold tracking-wider text-[#2962FF]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#089981] animate-ping" />
          <span>PRO FEED</span>
        </div>

        {tapeAssets.map((asset) => {
          const isPositive = asset.changePercent >= 0;
          const isSelected = selectedAssetId === asset.id;

          return (
            <button
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`flex items-center gap-2 px-2 py-0.5 rounded transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#2962FF]/20 border border-[#2962FF]/40 text-white'
                  : 'hover:bg-[#1E222D] text-[#dfe2f2]'
              }`}
            >
              <span className="font-semibold text-xs text-[#8d90a2] hover:text-white">
                {asset.symbol}
              </span>
              <span className="font-mono font-medium text-xs">
                {asset.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: asset.price < 2 ? 4 : 2,
                })}
              </span>
              <span
                className={`font-mono text-[10px] font-semibold flex items-center gap-0.5 ${
                  isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isPositive ? '+' : ''}
                {asset.changePercent.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
