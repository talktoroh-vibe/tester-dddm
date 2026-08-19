import React, { useState } from 'react';
import { ChevronDown, Check, Globe, Activity, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { REGIONS } from '../data/marketData';

interface HeroSectionProps {
  selectedRegion: string;
  onSelectRegion: (regionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedRegion,
  onSelectRegion,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeRegionObj = REGIONS.find((r) => r.id === selectedRegion) || REGIONS[0];

  return (
    <section className="flex flex-col items-center justify-center mb-10 text-center relative">
      {/* Live Market Status Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E222D] border border-[#363A45] text-[11px] text-[#8d90a2] mb-4">
        <span className="w-2 h-2 rounded-full bg-[#089981] animate-ping"></span>
        <span className="text-white font-medium">US Markets Open</span>
        <span>•</span>
        <span>Regular Trading Session</span>
      </div>

      {/* Main Hero Title with Dropdown Chevron */}
      <div className="relative inline-block">
        <h1
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-[#dfe2f2] hover:text-white flex items-center justify-center gap-2 sm:gap-3 cursor-pointer transition-all duration-200 select-none tracking-tight"
        >
          <span>{activeRegionObj.name}</span>
          <ChevronDown
            className={`w-7 h-7 sm:w-9 sm:h-9 text-[#8d90a2] transition-transform duration-300 ${
              dropdownOpen ? 'rotate-180 text-[#2962FF]' : ''
            }`}
          />
        </h1>

        {/* Region Selector Popover */}
        {dropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />

            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 sm:w-96 bg-[#1E222D] border border-[#363A45] rounded-2xl shadow-2xl p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#363A45]/60 mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8d90a2] uppercase tracking-wider">
                  Select Market Region
                </span>
                <span className="text-[10px] text-[#2962FF] font-medium bg-[#2962FF]/10 px-2 py-0.5 rounded-full">
                  Real-time Data
                </span>
              </div>

              <div className="space-y-1 max-h-72 overflow-y-auto">
                {REGIONS.map((region) => {
                  const isSelected = region.id === selectedRegion;
                  return (
                    <button
                      key={region.id}
                      onClick={() => {
                        onSelectRegion(region.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-start justify-between p-2.5 rounded-xl transition-colors text-left ${
                        isSelected
                          ? 'bg-[#2962FF]/15 border border-[#2962FF]/40 text-white'
                          : 'hover:bg-[#262A35] text-[#dfe2f2]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-sm flex items-center gap-1.5">
                          {region.name}
                          {region.id === 'all' && (
                            <Globe className="w-3.5 h-3.5 text-[#2962FF]" />
                          )}
                        </div>
                        <div className="text-[11px] text-[#8d90a2]">
                          {region.description}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                        <span className="text-[10px] text-[#8d90a2] font-mono">
                          {region.count}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#2962FF]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <p className="text-sm text-[#8d90a2] max-w-xl mx-auto mt-2 hidden sm:block">
        Track global equities, cryptocurrencies, sovereign bonds, and macroeconomic indicators with precision tick data.
      </p>
    </section>
  );
};
