/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Asset, MarketCategory, Order, Position, PriceAlert } from './types';
import { ALL_ASSETS, INITIAL_INDICES } from './data/marketData';
import { TickerTape } from './components/TickerTape';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PillNavigation } from './components/PillNavigation';
import { IndicesGrid } from './components/IndicesGrid';
import { InteractiveChart } from './components/InteractiveChart';
import { MarketHeatmapTable } from './components/MarketHeatmapTable';
import { RightProSidebar } from './components/RightProSidebar';
import { BottomTradingTerminal } from './components/BottomTradingTerminal';
import { SearchModal } from './components/SearchModal';
import { TradingModal } from './components/TradingModal';
import { Footer } from './components/Footer';
import { playAlertSound, playOrderSound } from './utils/audio';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('US stocks');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [assets, setAssets] = useState<Asset[]>(ALL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(INITIAL_INDICES[0]); // S&P 500 default
  const [showAllIndices, setShowAllIndices] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tradingOpen, setTradingOpen] = useState(false);
  const [tradingSide, setTradingSide] = useState<'BUY' | 'SELL'>('BUY');
  const [activeNav, setActiveNav] = useState('Markets');
  const [paperBalance, setPaperBalance] = useState(50000.0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'alt_1',
      symbol: 'SPX',
      targetPrice: 5120.00,
      condition: 'ABOVE',
      createdPrice: 5088.80,
      createdAt: new Date(),
      isTriggered: false,
    },
    {
      id: 'alt_2',
      symbol: 'NVDA',
      targetPrice: 890.00,
      condition: 'ABOVE',
      createdPrice: 875.28,
      createdAt: new Date(),
      isTriggered: false,
    }
  ]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update real-time tick in assets list and active positions
  const handlePriceTick = (newPrice: number, change: number, changePercent: number) => {
    // 1. Update Asset Price
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

    // 2. Update Live Positions PnL
    setPositions((prev) =>
      prev.map((pos) => {
        if (pos.symbol === selectedAsset.symbol) {
          const pnl =
            pos.side === 'BUY'
              ? (newPrice - pos.entryPrice) * pos.size
              : (pos.entryPrice - newPrice) * pos.size;
          const pnlPercent =
            pos.side === 'BUY'
              ? ((newPrice - pos.entryPrice) / pos.entryPrice) * 100
              : ((pos.entryPrice - newPrice) / pos.entryPrice) * 100;
          return { ...pos, currentPrice: newPrice, pnl, pnlPercent };
        }
        return pos;
      })
    );

    // 3. Check Price Alerts
    alerts.forEach((alt) => {
      if (alt.symbol === selectedAsset.symbol && !alt.isTriggered) {
        if (
          (alt.condition === 'ABOVE' && newPrice >= alt.targetPrice) ||
          (alt.condition === 'BELOW' && newPrice <= alt.targetPrice)
        ) {
          playAlertSound();
          setAlerts((prev) =>
            prev.map((a) => (a.id === alt.id ? { ...a, isTriggered: true } : a))
          );
        }
      }
    });
  };

  // Toggle starred status
  const handleToggleStar = (assetId: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, isStarred: !a.isStarred } : a))
    );
  };

  // Execute Order from Trading Ticket Modal or Quick Level 2 DOM
  const handleExecuteOrder = (newOrder: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    const order: Order = {
      ...newOrder,
      id: `ord_${Date.now()}`,
      timestamp: new Date(),
      status: 'FILLED',
    };

    setOrders((prev) => [order, ...prev]);

    // Check if position already exists for this symbol
    setPositions((prev) => {
      const existing = prev.find((p) => p.symbol === order.symbol && p.side === order.type);
      if (existing) {
        const totalSize = existing.size + order.amount;
        const avgPrice =
          (existing.entryPrice * existing.size + order.price * order.amount) / totalSize;
        return prev.map((p) =>
          p.id === existing.id
            ? {
                ...p,
                size: totalSize,
                entryPrice: avgPrice,
                currentPrice: order.price,
                pnl: 0,
                pnlPercent: 0,
              }
            : p
        );
      } else {
        const newPosition: Position = {
          id: `pos_${Date.now()}`,
          symbol: order.symbol,
          assetName: selectedAsset.name,
          side: order.type,
          size: order.amount,
          entryPrice: order.price,
          currentPrice: order.price,
          pnl: 0,
          pnlPercent: 0,
          timestamp: new Date(),
        };
        return [newPosition, ...prev];
      }
    });

    if (order.type === 'BUY') {
      setPaperBalance((prev) => prev - order.total);
    } else {
      setPaperBalance((prev) => prev + order.total);
    }

    playOrderSound(true);
  };

  // Quick 1-Click Execution from DOM
  const handleQuickExecute = (side: 'BUY' | 'SELL', price: number, amount: number) => {
    handleExecuteOrder({
      symbol: selectedAsset.symbol,
      type: side,
      orderType: 'MARKET',
      price,
      amount,
      total: price * amount,
    });
  };

  // Close Open Position
  const handleClosePosition = (positionId: string) => {
    const pos = positions.find((p) => p.id === positionId);
    if (!pos) return;

    // Realize PnL into cash balance
    setPaperBalance((prev) => prev + (pos.entryPrice * pos.size + pos.pnl));
    setPositions((prev) => prev.filter((p) => p.id !== positionId));
    setOrders((prev) => [
      {
        id: `ord_close_${Date.now()}`,
        symbol: pos.symbol,
        type: pos.side === 'BUY' ? 'SELL' : 'BUY',
        orderType: 'MARKET',
        price: pos.currentPrice,
        amount: pos.size,
        total: pos.currentPrice * pos.size,
        timestamp: new Date(),
        status: 'FILLED',
      },
      ...prev,
    ]);
  };

  // Reset Account
  const handleResetAccount = () => {
    setPaperBalance(50000.0);
    setPositions([]);
    setOrders([]);
  };

  // Alert Handlers
  const handleAddAlert = (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'isTriggered'>) => {
    const alert: PriceAlert = {
      ...newAlert,
      id: `alt_${Date.now()}`,
      createdAt: new Date(),
      isTriggered: false,
    };
    setAlerts((prev) => [alert, ...prev]);
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const totalUnrealizedPnL = positions.reduce((acc, p) => acc + p.pnl, 0);

  return (
    <div className="bg-[#131722] text-[#dfe2f2] antialiased min-h-screen flex flex-col font-body selection:bg-[#2962FF] selection:text-white">
      {/* 1. Pro Live Ticker Tape Header */}
      <TickerTape
        assets={assets}
        onSelectAsset={(asset) => {
          setSelectedAsset(asset);
          setActiveCategory(asset.category);
        }}
        selectedAssetId={selectedAsset.id}
      />

      {/* 2. Top Header Navigation */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenTrading={() => setTradingOpen(true)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        balance={paperBalance}
        unrealizedPnL={totalUnrealizedPnL}
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        sidebarOpen={sidebarOpen}
        onToggleTerminal={() => setTerminalOpen((p) => !p)}
        terminalOpen={terminalOpen}
      />

      {/* 3. Main Workspace with Pro Right Dock */}
      <div className="flex-grow flex w-full">
        {/* Main Content Area */}
        <main className="flex-grow min-w-0 px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto w-full">
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

          {/* Interactive TradingView Pro Superchart */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-lg sm:text-xl font-bold text-white tracking-tight">
                  Superchart Pro
                </h2>
                <span className="bg-[#2962FF]/20 text-[#2962FF] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#2962FF]/40">
                  REAL-TIME CANVAS
                </span>
              </div>
              <span className="text-xs text-[#8d90a2] font-mono hidden sm:inline">
                Crosshair Precision • Multi-Indicator Suite
              </span>
            </div>

            <InteractiveChart
              asset={selectedAsset}
              onOpenTrading={(side = 'BUY') => {
                setTradingSide(side);
                setTradingOpen(true);
              }}
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

        {/* 4. Pro Right Docking Sidebar (Watchlist, DOM Level 2, Technical Gauge, News, Calendar, Alerts) */}
        <RightProSidebar
          assets={assets}
          selectedAsset={selectedAsset}
          onSelectAsset={(asset) => {
            setSelectedAsset(asset);
            setActiveCategory(asset.category);
          }}
          onToggleStar={handleToggleStar}
          onExecuteQuickOrder={handleQuickExecute}
          isOpen={sidebarOpen}
          onToggleOpen={() => setSidebarOpen((p) => !p)}
          alerts={alerts}
          onAddAlert={handleAddAlert}
          onRemoveAlert={handleRemoveAlert}
        />
      </div>

      {/* 5. Collapsible Pro Bottom Trading Terminal */}
      <BottomTradingTerminal
        positions={positions}
        orders={orders}
        balance={paperBalance}
        onClosePosition={handleClosePosition}
        isOpen={terminalOpen}
        onToggleOpen={() => setTerminalOpen((p) => !p)}
        onResetAccount={handleResetAccount}
      />

      {/* 6. Footer */}
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
        initialSide={tradingSide}
      />
    </div>
  );
}
