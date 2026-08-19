/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Asset, MarketCategory, Order } from './types';
import { ALL_ASSETS, INITIAL_INDICES } from './data/marketData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PillNavigation } from './components/PillNavigation';
import { IndicesGrid } from './components/IndicesGrid';
import { InteractiveChart } from './components/InteractiveChart';
import { MarketHeatmapTable } from './components/MarketHeatmapTable';
import { SearchModal } from './components/SearchModal';
import { TradingModal } from './components/TradingModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('US stocks');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [assets, setAssets] = useState<Asset[]>(ALL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(INITIAL_INDICES[0]); // S&P 500 default
  const [showAllIndices, setShowAllIndices] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tradingOpen, setTradingOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Markets');
  const [paperBalance, setPaperBalance] = useState(50000.0);
  const [orders, setOrders] = useState<Order[]>([]);

  // Update real-time tick in assets list
  const handlePriceTick = (newPrice: number, change: number, changePercent: number) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === selectedAsset.id
          ? {
              ...a,
              price: newPrice,
              change,
              changePercent,
              high24h: Math.max(a.high24h, newPrice),
              low24h: Math.min(a.low24h, newPrice),
            }
          : a
      )
    );
  };

  const handleExecuteOrder = (newOrder: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    const order: Order = {
      ...newOrder,
      id: `ord_${Date.now()}`,
      timestamp: new Date(),
      status: 'FILLED',
    };

    setOrders((prev) => [order, ...prev]);

    if (order.type === 'BUY') {
      setPaperBalance((prev) => prev - order.total);
    } else {
      setPaperBalance((prev) => prev + order.total);
    }
  };

  return (
    <div className="bg-[#131722] text-[#dfe2f2] antialiased min-h-screen flex flex-col font-body selection:bg-[#2962FF] selection:text-white">
      {/* Top Header Navigation */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenTrading={() => setTradingOpen(true)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        balance={paperBalance}
      />

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* Hero Section */}
        <HeroSection
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        {/* Pill Navigation (Horizontally scrollable) */}
        <PillNavigation
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Indices Section (S&P 500, Nasdaq 100, Dow 30 cards) */}
        <IndicesGrid
          indices={assets.filter((a) => a.badgeNumber !== undefined)}
          selectedAsset={selectedAsset}
          onSelectAsset={setSelectedAsset}
          showAllIndices={showAllIndices}
          setShowAllIndices={setShowAllIndices}
        />

        {/* Interactive TradingView Chart Canvas */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-headline text-lg sm:text-xl font-semibold text-[#dfe2f2]">
              Interactive Superchart
            </h2>
            <span className="text-xs text-[#8d90a2] font-mono">
              Live Feed: {selectedAsset.symbol}
            </span>
          </div>

          <InteractiveChart
            asset={selectedAsset}
            onOpenTrading={() => setTradingOpen(true)}
            onPriceTick={handlePriceTick}
          />
        </section>

        {/* Market Screener & Movers Table */}
        <MarketHeatmapTable
          assets={assets}
          activeCategory={activeCategory}
          selectedAsset={selectedAsset}
          onSelectAsset={setSelectedAsset}
          onOpenTrading={(asset) => {
            setSelectedAsset(asset);
            setTradingOpen(true);
          }}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        assets={assets}
        onSelectAsset={(asset) => {
          setSelectedAsset(asset);
          setActiveCategory(asset.category);
        }}
      />

      {/* Paper Trading Order Ticket Modal */}
      <TradingModal
        isOpen={tradingOpen}
        onClose={() => setTradingOpen(false)}
        asset={selectedAsset}
        balance={paperBalance}
        onExecuteOrder={handleExecuteOrder}
      />
    </div>
  );
}
