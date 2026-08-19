import React, { useRef } from 'react';
import { MarketCategory } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PillNavigationProps {
  activeCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
}

const CATEGORIES: MarketCategory[] = [
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Government bonds',
  'Corporate bonds',
  'ETFs',
  'Economy',
];

export const PillNavigation: React.FC<PillNavigationProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 relative group">
      {/* Scroll left button */}
      <button
        onClick={() => handleScroll('left')}
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[#1E222D] border border-[#363A45] text-[#8d90a2] hover:text-white hover:border-[#2962FF] items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto no-scrollbar scroll-smooth px-2"
      >
        <div className="flex items-center justify-start md:justify-center gap-2 min-w-max pb-1">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`font-body text-xs sm:text-sm px-4 py-2 rounded-full transition-all duration-200 border whitespace-nowrap cursor-pointer select-none font-medium ${
                  isActive
                    ? 'bg-[#313441] text-white border-transparent shadow-sm'
                    : 'text-[#8d90a2] hover:text-[#dfe2f2] hover:bg-[#262A35] border-transparent'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scroll right button */}
      <button
        onClick={() => handleScroll('right')}
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[#1E222D] border border-[#363A45] text-[#8d90a2] hover:text-white hover:border-[#2962FF] items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
