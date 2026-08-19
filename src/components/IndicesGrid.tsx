import React from 'react';
import { Asset } from '../types';
import { ChevronRight } from 'lucide-react';

interface IndicesGridProps {
  indices: Asset[];
  selectedAsset: Asset;
  onSelectAsset: (asset: Asset) => void;
  showAllIndices: boolean;
  setShowAllIndices: (show: boolean) => void;
}

export const IndicesGrid: React.FC<IndicesGridProps> = ({
  indices,
  selectedAsset,
  onSelectAsset,
  showAllIndices,
  setShowAllIndices,
}) => {
  const displayIndices = showAllIndices ? indices : indices.slice(0, 3);

  return (
    <section className="mb-10 w-full max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2
          onClick={() => setShowAllIndices(!showAllIndices)}
          className="font-headline text-lg sm:text-xl font-semibold text-[#dfe2f2] hover:text-[#2962FF] flex items-center gap-1 cursor-pointer transition-colors w-fit select-none"
        >
          <span>Indices</span>
          <ChevronRight
            className={`w-5 h-5 transition-transform duration-200 ${
              showAllIndices ? 'rotate-90 text-[#2962FF]' : ''
            }`}
          />
        </h2>

        <button
          onClick={() => setShowAllIndices(!showAllIndices)}
          className="text-xs text-[#8d90a2] hover:text-[#dfe2f2] font-medium transition-colors"
        >
          {showAllIndices ? 'Show top 3' : 'View all indices'}
        </button>
      </div>

      {/* Responsive Grid matching the screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayIndices.map((index) => {
          const isSelected = selectedAsset.id === index.id;
          const isPositive = index.changePercent >= 0;

          return (
            <div
              key={index.id}
              onClick={() => onSelectAsset(index)}
              className={`bg-[#1E222D] border rounded-xl p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer group select-none relative overflow-hidden ${
                isSelected
                  ? 'border-[#2962FF] bg-[#262A35] shadow-lg shadow-[#2962FF]/10 ring-1 ring-[#2962FF]'
                  : 'border-[#363A45] hover:bg-[#262A35] hover:border-[#8d90a2]/50'
              }`}
            >
              {/* Active Indicator Bar */}
              {isSelected && (
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#2962FF]" />
              )}

              {/* Number Badge Icon */}
              <div
                style={{ backgroundColor: index.badgeBgColor || (isPositive ? '#089981' : '#F23645') }}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
              >
                <span className="font-mono text-xs text-white font-bold tracking-tight">
                  {index.badgeNumber || index.symbol.slice(0, 3)}
                </span>
              </div>

              {/* Index Info */}
              <div className="flex-grow flex justify-between items-center min-w-0">
                <div className="space-y-0.5 truncate pr-2">
                  <span className="font-body text-sm sm:text-base font-semibold text-[#dfe2f2] group-hover:text-[#2962FF] transition-colors block truncate">
                    {index.name}
                  </span>
                  <span className="text-[11px] text-[#8d90a2] block">
                    {index.exchange} • {index.symbol}
                  </span>
                </div>

                {/* Tabular Data (Price & Change) */}
                <div className="text-right flex-shrink-0">
                  <div className="font-mono text-sm font-medium text-[#dfe2f2]">
                    {index.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div
                    className={`font-mono text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                      isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    <span>{isPositive ? '+' : ''}</span>
                    <span>{index.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
