import React, { useState, useEffect, useRef } from 'react';
import { Asset, Candle, ChartType, Timeframe } from '../types';
import { generateCandles } from '../data/marketData';
import { 
  Maximize2, Minimize2, TrendingUp, BarChart2, Eye, EyeOff, 
  Activity, Zap, RotateCcw, PenTool, Minus, Compass, 
  Sliders, ArrowUpRight, ArrowDownRight, Layers, DollarSign 
} from 'lucide-react';

interface InteractiveChartProps {
  asset: Asset;
  onOpenTrading: (side?: 'BUY' | 'SELL') => void;
  onPriceTick?: (newPrice: number, change: number, changePercent: number) => void;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  asset,
  onOpenTrading,
  onPriceTick,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('candles');
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [activeTool, setActiveTool] = useState<'cursor' | 'trendline' | 'horizontal' | 'measure'>('cursor');
  const [drawnLines, setDrawnLines] = useState<{ x1: number; y1: number; x2: number; y2: number; type: string }[]>([]);
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);
  const [livePrice, setLivePrice] = useState(asset.price);
  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Re-generate candles whenever asset or timeframe changes
  useEffect(() => {
    const newCandles = generateCandles(asset, timeframe);
    setCandles(newCandles);
    setLivePrice(asset.price);
    setDrawnLines([]);
  }, [asset.id, timeframe]);

  // Real-time price simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      const deltaPercent = (Math.random() - 0.49) * 0.0015;
      setLivePrice((prev) => {
        const nextPrice = Number((prev * (1 + deltaPercent)).toFixed(2));
        const direction = nextPrice >= prev ? 'up' : 'down';
        setPriceFlash(direction);
        setTimeout(() => setPriceFlash(null), 600);

        // Update current candle
        setCandles((prevCandles) => {
          if (!prevCandles.length) return prevCandles;
          const updated = [...prevCandles];
          const lastIndex = updated.length - 1;
          const lastCandle = updated[lastIndex];
          updated[lastIndex] = {
            ...lastCandle,
            close: nextPrice,
            high: Math.max(lastCandle.high, nextPrice),
            low: Math.min(lastCandle.low, nextPrice),
            volume: lastCandle.volume + Math.floor(Math.random() * 250),
          };
          return updated;
        });

        if (onPriceTick) {
          const change = nextPrice - asset.basePrice;
          const changePercent = (change / asset.basePrice) * 100;
          onPriceTick(nextPrice, change, changePercent);
        }

        return nextPrice;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [asset.basePrice, onPriceTick]);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear background
    ctx.fillStyle = '#131722';
    ctx.fillRect(0, 0, width, height);

    // Padding parameters
    const padLeft = 10;
    const padRight = 65; // Y-axis price label area
    const padTop = 30;
    const padBottom = showRSI ? 130 : 50; // Extra room if RSI is shown
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    // Calculate Min & Max price for scale
    let minPrice = Math.min(...candles.map((c) => c.low));
    let maxPrice = Math.max(...candles.map((c) => c.high));
    const priceBuffer = (maxPrice - minPrice) * 0.08 || 1;
    minPrice -= priceBuffer;
    maxPrice += priceBuffer;

    const maxVolume = Math.max(...candles.map((c) => c.volume), 1000);

    const getY = (price: number) => padTop + chartH - ((price - minPrice) / (maxPrice - minPrice)) * chartH;
    const getX = (index: number) => padLeft + (index / (candles.length - 1 || 1)) * chartW;

    // 1. Draw Grid Lines (Horizontal & Vertical)
    ctx.strokeStyle = '#1E222D';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    const gridSteps = 5;
    for (let i = 0; i <= gridSteps; i++) {
      const priceVal = minPrice + ((maxPrice - minPrice) / gridSteps) * i;
      const y = getY(priceVal);

      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();

      // Y-axis price labels
      ctx.fillStyle = '#8d90a2';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(priceVal.toFixed(2), width - padRight + 6, y + 4);
    }

    // Vertical grid lines and time labels
    const timeSteps = Math.min(6, candles.length);
    for (let i = 0; i < timeSteps; i++) {
      const idx = Math.floor((i / (timeSteps - 1 || 1)) * (candles.length - 1));
      const candle = candles[idx];
      if (!candle) continue;
      const x = getX(idx);

      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, padTop + chartH);
      ctx.stroke();

      // X-axis time labels
      ctx.fillStyle = '#8d90a2';
      ctx.font = '11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(candle.time, x, padTop + chartH + 20);
    }

    // 2. Draw Volume Histogram (if enabled)
    if (showVolume) {
      const volMaxHeight = chartH * 0.22;
      const volBaseY = padTop + chartH;
      const barWidth = Math.max(2, (chartW / candles.length) * 0.7);

      candles.forEach((c, idx) => {
        const x = getX(idx);
        const barH = (c.volume / maxVolume) * volMaxHeight;
        const isUp = c.close >= c.open;

        ctx.fillStyle = isUp ? 'rgba(8, 153, 129, 0.25)' : 'rgba(242, 54, 69, 0.25)';
        ctx.fillRect(x - barWidth / 2, volBaseY - barH, barWidth, barH);
      });
    }

    // 3. Draw Chart Series (Candles or Area / Line)
    if (chartType === 'candles') {
      const candleWidth = Math.max(3, (chartW / candles.length) * 0.68);

      candles.forEach((c, idx) => {
        const x = getX(idx);
        const yOpen = getY(c.open);
        const yClose = getY(c.close);
        const yHigh = getY(c.high);
        const yLow = getY(c.low);
        const isUp = c.close >= c.open;
        const color = isUp ? '#089981' : '#F23645';

        // Draw Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Draw Body
        ctx.fillStyle = color;
        const topY = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(1.5, Math.abs(yClose - yOpen));
        ctx.fillRect(x - candleWidth / 2, topY, candleWidth, bodyHeight);
      });
    } else {
      // Area / Line Chart
      ctx.beginPath();
      candles.forEach((c, idx) => {
        const x = getX(idx);
        const y = getY(c.close);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      if (chartType === 'area') {
        // Gradient fill
        const gradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
        gradient.addColorStop(0, 'rgba(41, 98, 255, 0.35)');
        gradient.addColorStop(1, 'rgba(41, 98, 255, 0.0)');
        
        ctx.lineTo(getX(candles.length - 1), padTop + chartH);
        ctx.lineTo(getX(0), padTop + chartH);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Top line
        ctx.beginPath();
        candles.forEach((c, idx) => {
          const x = getX(idx);
          const y = getY(c.close);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#2962FF';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#2962FF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // 4. Moving Average 20 (Orange)
    if (showMA20 && candles.length > 5) {
      const ma20Period = Math.min(20, Math.floor(candles.length / 2));
      ctx.beginPath();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      let first = true;

      for (let i = ma20Period - 1; i < candles.length; i++) {
        let sum = 0;
        for (let j = 0; j < ma20Period; j++) {
          sum += candles[i - j].close;
        }
        const ma = sum / ma20Period;
        const x = getX(i);
        const y = getY(ma);

        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // 5. Moving Average 50 (Cyan)
    if (showMA50 && candles.length > 15) {
      const ma50Period = Math.min(50, Math.floor(candles.length * 0.7));
      ctx.beginPath();
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 1.5;
      let first = true;

      for (let i = ma50Period - 1; i < candles.length; i++) {
        let sum = 0;
        for (let j = 0; j < ma50Period; j++) {
          sum += candles[i - j].close;
        }
        const ma = sum / ma50Period;
        const x = getX(i);
        const y = getY(ma);

        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // 6. Current Live Price Line & Pulsing Beacon
    const currentClose = candles[candles.length - 1].close;
    const currentY = getY(currentClose);
    const isLiveUp = currentClose >= (candles[candles.length - 2]?.close || currentClose);

    ctx.strokeStyle = isLiveUp ? 'rgba(8, 153, 129, 0.7)' : 'rgba(242, 54, 69, 0.7)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padLeft, currentY);
    ctx.lineTo(width - padRight, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Live Price Pill on Y-Axis
    const pillColor = isLiveUp ? '#089981' : '#F23645';
    ctx.fillStyle = pillColor;
    ctx.beginPath();
    ctx.roundRect(width - padRight + 2, currentY - 10, padRight - 6, 20, 4);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(currentClose.toFixed(2), width - padRight + 2 + (padRight - 8) / 2, currentY + 4);

    // 7. RSI Sub-Chart (if enabled)
    if (showRSI) {
      const rsiTop = padTop + chartH + 30;
      const rsiH = 65;
      const rsiW = chartW;

      // Background
      ctx.fillStyle = '#171B26';
      ctx.fillRect(padLeft, rsiTop, rsiW, rsiH);

      // 70 and 30 Overbought/Oversold levels
      ctx.strokeStyle = '#363A45';
      ctx.setLineDash([2, 2]);
      const y70 = rsiTop + rsiH * 0.3;
      const y30 = rsiTop + rsiH * 0.7;

      ctx.beginPath();
      ctx.moveTo(padLeft, y70);
      ctx.lineTo(padLeft + rsiW, y70);
      ctx.moveTo(padLeft, y30);
      ctx.lineTo(padLeft + rsiW, y30);
      ctx.stroke();
      ctx.setLineDash([]);

      // RSI Label
      ctx.fillStyle = '#8d90a2';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('RSI (14)  58.4', padLeft + 6, rsiTop + 14);
      ctx.fillText('70', width - padRight + 6, y70 + 3);
      ctx.fillText('30', width - padRight + 6, y30 + 3);

      // Simulated RSI curve
      ctx.beginPath();
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 1.5;
      candles.forEach((c, idx) => {
        const x = getX(idx);
        const pseudoRsi = 50 + Math.sin(idx * 0.25) * 20 + ((c.close - minPrice) / (maxPrice - minPrice) - 0.5) * 20;
        const clampedRsi = Math.max(10, Math.min(90, pseudoRsi));
        const y = rsiTop + rsiH - (clampedRsi / 100) * rsiH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // 8. Draw Custom Annotations / Lines
    drawnLines.forEach((line) => {
      ctx.strokeStyle = '#2962FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    });

    // 9. Interactive Crosshair & Tooltips
    if (mousePos && mousePos.x >= padLeft && mousePos.x <= width - padRight && mousePos.y >= padTop && mousePos.y <= padTop + chartH) {
      // Find nearest candle
      const relativeX = (mousePos.x - padLeft) / chartW;
      const candleIndex = Math.max(0, Math.min(candles.length - 1, Math.round(relativeX * (candles.length - 1))));
      const activeCandle = candles[candleIndex];
      const snapX = getX(candleIndex);

      // Draw dashed crosshair lines
      ctx.strokeStyle = 'rgba(223, 226, 242, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(snapX, padTop);
      ctx.lineTo(snapX, padTop + chartH);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(padLeft, mousePos.y);
      ctx.lineTo(width - padRight, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Crosshair Price Tag on Y-Axis
      const hoveredPrice = maxPrice - ((mousePos.y - padTop) / chartH) * (maxPrice - minPrice);
      ctx.fillStyle = '#262A35';
      ctx.strokeStyle = '#363A45';
      ctx.lineWidth = 1;
      ctx.fillRect(width - padRight + 2, mousePos.y - 10, padRight - 6, 20);
      ctx.strokeRect(width - padRight + 2, mousePos.y - 10, padRight - 6, 20);

      ctx.fillStyle = '#dfe2f2';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(hoveredPrice.toFixed(2), width - padRight + 2 + (padRight - 8) / 2, mousePos.y + 4);

      // Crosshair Time Tag on X-Axis
      ctx.fillStyle = '#262A35';
      ctx.fillRect(snapX - 35, padTop + chartH + 4, 70, 18);
      ctx.strokeRect(snapX - 35, padTop + chartH + 4, 70, 18);

      ctx.fillStyle = '#dfe2f2';
      ctx.font = '10px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(activeCandle.time, snapX, padTop + chartH + 16);
    }
  }, [candles, chartType, showMA20, showMA50, showVolume, showRSI, mousePos, drawnLines]);

  // Handle Mouse Hover on Canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const padLeft = 10;
    const padRight = 65;
    const chartW = rect.width - padLeft - padRight;
    const relativeX = (x - padLeft) / chartW;
    const candleIndex = Math.max(0, Math.min(candles.length - 1, Math.round(relativeX * (candles.length - 1))));
    setHoveredCandle(candles[candleIndex] || null);

    if (drawingStart && activeTool === 'trendline') {
      // Live preview drawing line
    }
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setHoveredCandle(null);
    setDrawingStart(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'trendline') {
      if (!drawingStart) {
        setDrawingStart({ x, y });
      } else {
        setDrawnLines((prev) => [...prev, { x1: drawingStart.x, y1: drawingStart.y, x2: x, y2: y, type: 'trendline' }]);
        setDrawingStart(null);
      }
    } else if (activeTool === 'horizontal') {
      setDrawnLines((prev) => [...prev, { x1: 10, y1: y, x2: rect.width - 65, y2: y, type: 'horizontal' }]);
    }
  };

  const displayCandle = hoveredCandle || candles[candles.length - 1] || null;
  const isPositive = asset.changePercent >= 0;

  return (
    <div
      ref={containerRef}
      className={`bg-[#1E222D] border border-[#363A45] rounded-xl overflow-hidden mb-12 shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl flex flex-col' : 'w-full'
      }`}
    >
      {/* Top Header Controls Bar */}
      <div className="bg-[#171B26] border-b border-[#363A45] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Asset Ticker Info */}
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: asset.badgeBgColor || (isPositive ? '#089981' : '#F23645') }}
            className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs text-white font-bold shadow-md flex-shrink-0"
          >
            {asset.badgeNumber || asset.symbol.slice(0, 3)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-base sm:text-lg text-white">
                {asset.symbol}
              </span>
              <span className="text-xs text-[#8d90a2] hidden sm:inline">
                {asset.name}
              </span>
              <span className="text-[10px] bg-[#262A35] text-[#8d90a2] border border-[#363A45] px-1.5 py-0.5 rounded">
                {asset.exchange}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-base font-bold transition-colors duration-200 ${
                  priceFlash === 'up'
                    ? 'text-[#089981] bg-[#089981]/20 px-1 rounded'
                    : priceFlash === 'down'
                    ? 'text-[#F23645] bg-[#F23645]/20 px-1 rounded'
                    : 'text-white'
                }`}
              >
                {livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-[#8d90a2] font-mono">{asset.currency}</span>
              <span
                className={`font-mono text-xs font-semibold flex items-center gap-0.5 ${
                  isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isPositive ? '+' : ''}
                {asset.change.toFixed(2)} ({isPositive ? '+' : ''}
                {asset.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Center: Timeframe Selectors */}
        <div className="flex items-center bg-[#131722] rounded-lg p-1 border border-[#363A45]">
          {(['1D', '5D', '1M', '3M', '6M', '1Y', '5Y', 'ALL'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                timeframe === tf
                  ? 'bg-[#2962FF] text-white font-semibold shadow'
                  : 'text-[#8d90a2] hover:text-[#dfe2f2] hover:bg-[#1E222D]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Right: Chart Controls & Order Buttons */}
        <div className="flex items-center gap-2">
          {/* Chart Type Selector */}
          <div className="flex items-center bg-[#131722] rounded-lg p-0.5 border border-[#363A45]">
            <button
              onClick={() => setChartType('candles')}
              className={`p-1.5 rounded text-xs transition-colors ${
                chartType === 'candles' ? 'bg-[#262A35] text-[#2962FF]' : 'text-[#8d90a2] hover:text-white'
              }`}
              title="Candlestick Chart"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded text-xs transition-colors ${
                chartType === 'area' ? 'bg-[#262A35] text-[#2962FF]' : 'text-[#8d90a2] hover:text-white'
              }`}
              title="Area Chart"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          {/* Indicator Toggles */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => setShowMA20(!showMA20)}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                showMA20
                  ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]'
                  : 'bg-[#131722] border-[#363A45] text-[#8d90a2]'
              }`}
            >
              MA 20
            </button>
            <button
              onClick={() => setShowMA50(!showMA50)}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                showMA50
                  ? 'bg-[#06B6D4]/20 border-[#06B6D4] text-[#06B6D4]'
                  : 'bg-[#131722] border-[#363A45] text-[#8d90a2]'
              }`}
            >
              MA 50
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                showRSI
                  ? 'bg-[#A855F7]/20 border-[#A855F7] text-[#A855F7]'
                  : 'bg-[#131722] border-[#363A45] text-[#8d90a2]'
              }`}
            >
              RSI
            </button>
          </div>

          {/* Quick Buy & Sell Buttons */}
          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={() => onOpenTrading('BUY')}
              className="bg-[#089981] hover:bg-[#07856f] text-white font-semibold text-xs py-1.5 px-3 rounded-lg shadow transition-transform active:scale-95 cursor-pointer"
            >
              Buy
            </button>
            <button
              onClick={() => onOpenTrading('SELL')}
              className="bg-[#F23645] hover:bg-[#d82a38] text-white font-semibold text-xs py-1.5 px-3 rounded-lg shadow transition-transform active:scale-95 cursor-pointer"
            >
              Sell
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-[#8d90a2] hover:text-white rounded hover:bg-[#262A35] transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Chart Body: Left Tools + Canvas Stage */}
      <div className="flex flex-grow relative min-h-[380px] sm:min-h-[440px]">
        {/* Left Toolbar for Drawing Tools */}
        <div className="w-10 bg-[#171B26] border-r border-[#363A45] flex flex-col items-center py-3 gap-2 flex-shrink-0">
          <button
            onClick={() => setActiveTool('cursor')}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'cursor' ? 'bg-[#2962FF] text-white' : 'text-[#8d90a2] hover:text-white hover:bg-[#262A35]'
            }`}
            title="Crosshair Cursor"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('trendline')}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'trendline' ? 'bg-[#2962FF] text-white' : 'text-[#8d90a2] hover:text-white hover:bg-[#262A35]'
            }`}
            title="Trendline Tool (Click 2 points)"
          >
            <PenTool className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('horizontal')}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'horizontal' ? 'bg-[#2962FF] text-white' : 'text-[#8d90a2] hover:text-white hover:bg-[#262A35]'
            }`}
            title="Horizontal Support/Resistance Line"
          >
            <Minus className="w-4 h-4" />
          </button>
          {drawnLines.length > 0 && (
            <button
              onClick={() => setDrawnLines([])}
              className="p-2 rounded-lg text-[#F23645] hover:bg-[#262A35] transition-colors mt-auto"
              title="Clear Drawings"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Canvas & HUD Area */}
        <div className="relative flex-grow h-full overflow-hidden bg-[#131722]">
          {/* Dynamic HUD / Candle Metrics */}
          {displayCandle && (
            <div className="absolute top-2 left-3 z-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono pointer-events-none bg-[#131722]/80 backdrop-blur px-2.5 py-1 rounded-md border border-[#363A45]/40">
              <span className="text-[#8d90a2]">
                O: <span className="text-white">{displayCandle.open.toFixed(2)}</span>
              </span>
              <span className="text-[#8d90a2]">
                H: <span className="text-white">{displayCandle.high.toFixed(2)}</span>
              </span>
              <span className="text-[#8d90a2]">
                L: <span className="text-white">{displayCandle.low.toFixed(2)}</span>
              </span>
              <span className="text-[#8d90a2]">
                C: <span className={displayCandle.close >= displayCandle.open ? 'text-[#089981]' : 'text-[#F23645]'}>{displayCandle.close.toFixed(2)}</span>
              </span>
              <span className="text-[#8d90a2] hidden sm:inline">
                Vol: <span className="text-white">{displayCandle.volume.toLocaleString()}</span>
              </span>
            </div>
          )}

          {/* HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            className="w-full h-full block cursor-crosshair"
            style={{ minHeight: showRSI ? '480px' : '400px' }}
          />
        </div>
      </div>

      {/* Bottom Key Statistics Bar */}
      <div className="bg-[#171B26] border-t border-[#363A45] px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-[#8d90a2] gap-4">
        <div className="flex items-center gap-6">
          <div>
            <span>24h Range: </span>
            <span className="font-mono text-white font-medium">
              {asset.low24h.toFixed(2)} - {asset.high24h.toFixed(2)}
            </span>
          </div>
          <div>
            <span>24h Volume: </span>
            <span className="font-mono text-white font-medium">{asset.volume}</span>
          </div>
          {asset.marketCap && (
            <div className="hidden sm:block">
              <span>Market Cap: </span>
              <span className="font-mono text-white font-medium">{asset.marketCap}</span>
            </div>
          )}
          {asset.peRatio && (
            <div className="hidden md:block">
              <span>P/E Ratio: </span>
              <span className="font-mono text-white font-medium">{asset.peRatio}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] text-[#089981]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981]"></span>
            Live Precision Feed
          </span>
        </div>
      </div>
    </div>
  );
};
