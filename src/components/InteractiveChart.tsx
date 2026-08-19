import React, { useState, useEffect, useRef } from 'react';
import { Asset, Candle, ChartType, Timeframe, DrawingTool, TechnicalIndicatorConfig } from '../types';
import { generateCandles } from '../data/marketData';
import { 
  Maximize2, Minimize2, TrendingUp, BarChart2, Eye, EyeOff, 
  Activity, Zap, RotateCcw, PenTool, Minus, Compass, 
  Sliders, ArrowUpRight, ArrowDownRight, Layers, DollarSign,
  Grid, PieChart, Volume2, ShieldCheck, HelpCircle
} from 'lucide-react';
import { playTickSound } from '../utils/audio';

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
  const [indicators, setIndicators] = useState<TechnicalIndicatorConfig>({
    ma20: true,
    ma50: false,
    ema20: false,
    bollinger: false,
    volume: true,
    rsi: false,
    macd: false,
    vwap: false,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [activeTool, setActiveTool] = useState<DrawingTool>('cursor');
  const [drawnItems, setDrawnItems] = useState<{ type: DrawingTool; x1: number; y1: number; x2: number; y2: number; label?: string }[]>([]);
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);
  const [livePrice, setLivePrice] = useState(asset.price);
  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const livePriceRef = useRef(asset.price);
  const onPriceTickRef = useRef(onPriceTick);
  onPriceTickRef.current = onPriceTick;

  // Keep livePriceRef in sync with asset changes
  useEffect(() => {
    livePriceRef.current = asset.price;
  }, [asset.price, asset.id]);

  // Generate historical data
  useEffect(() => {
    const newCandles = generateCandles(asset, timeframe);
    setCandles(newCandles);
    setLivePrice(asset.price);
    livePriceRef.current = asset.price;
    setDrawnItems([]);
  }, [asset.id, timeframe]);

  // Real-time price fluctuation simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const deltaPercent = (Math.random() - 0.49) * 0.0016;
      const current = livePriceRef.current;
      const nextPrice = Number((current * (1 + deltaPercent)).toFixed(2));
      const direction = nextPrice >= current ? 'up' : 'down';

      livePriceRef.current = nextPrice;
      setLivePrice(nextPrice);
      setPriceFlash(direction);
      playTickSound(direction);

      setTimeout(() => setPriceFlash(null), 600);

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
          volume: lastCandle.volume + Math.floor(Math.random() * 320),
        };
        return updated;
      });

      if (onPriceTickRef.current) {
        const change = nextPrice - asset.basePrice;
        const changePercent = (change / asset.basePrice) * 100;
        onPriceTickRef.current(nextPrice, change, changePercent);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [asset.basePrice]);

  // Comprehensive Canvas Drawing Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Background
    ctx.fillStyle = '#131722';
    ctx.fillRect(0, 0, width, height);

    // Padding calculations
    const padLeft = 12;
    const padRight = 68; // Y-axis price labels
    const padTop = 32;
    let extraBottom = 40;
    if (indicators.rsi) extraBottom += 70;
    if (indicators.macd) extraBottom += 70;

    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - extraBottom;

    // Price scaling
    let minPrice = Math.min(...candles.map((c) => c.low));
    let maxPrice = Math.max(...candles.map((c) => c.high));
    const buffer = (maxPrice - minPrice) * 0.08 || 1;
    minPrice -= buffer;
    maxPrice += buffer;

    const maxVolume = Math.max(...candles.map((c) => c.volume), 1000);

    const getY = (price: number) => padTop + chartH - ((price - minPrice) / (maxPrice - minPrice)) * chartH;
    const getX = (index: number) => padLeft + (index / (candles.length - 1 || 1)) * chartW;

    // 1. Grid Lines
    ctx.strokeStyle = '#1E222D';
    ctx.lineWidth = 1;

    // Horizontal Price Lines
    const gridSteps = 5;
    for (let i = 0; i <= gridSteps; i++) {
      const priceVal = minPrice + ((maxPrice - minPrice) / gridSteps) * i;
      const y = getY(priceVal);

      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();

      ctx.fillStyle = '#8d90a2';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(priceVal.toFixed(2), width - padRight + 6, y + 4);
    }

    // Vertical Time Lines
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

      ctx.fillStyle = '#8d90a2';
      ctx.font = '11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(candle.time, x, padTop + chartH + 18);
    }

    // 2. Bollinger Bands (if enabled)
    if (indicators.bollinger && candles.length > 20) {
      const period = 20;
      const upperBand: number[] = [];
      const lowerBand: number[] = [];
      const middleBand: number[] = [];

      for (let i = period - 1; i < candles.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += candles[i - j].close;
        }
        const mean = sum / period;
        middleBand.push(mean);

        let variance = 0;
        for (let j = 0; j < period; j++) {
          variance += Math.pow(candles[i - j].close - mean, 2);
        }
        const stdDev = Math.sqrt(variance / period);
        upperBand.push(mean + stdDev * 2);
        lowerBand.push(mean - stdDev * 2);
      }

      // Translucent Cloud Fill
      ctx.beginPath();
      for (let i = 0; i < upperBand.length; i++) {
        const x = getX(period - 1 + i);
        const y = getY(upperBand[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let i = lowerBand.length - 1; i >= 0; i--) {
        const x = getX(period - 1 + i);
        const y = getY(lowerBand[i]);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(41, 98, 255, 0.08)';
      ctx.fill();

      // Band Outlines
      ctx.strokeStyle = 'rgba(41, 98, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 3. Volume Overlay
    if (indicators.volume) {
      const volMaxH = chartH * 0.22;
      const volBaseY = padTop + chartH;
      const barW = Math.max(2, (chartW / candles.length) * 0.68);

      candles.forEach((c, idx) => {
        const x = getX(idx);
        const barH = (c.volume / maxVolume) * volMaxH;
        const isUp = c.close >= c.open;

        ctx.fillStyle = isUp ? 'rgba(8, 153, 129, 0.28)' : 'rgba(242, 54, 69, 0.28)';
        ctx.fillRect(x - barW / 2, volBaseY - barH, barW, barH);
      });
    }

    // 4. Primary Chart Series (Candles / Hollow / Heikin Ashi / Area / Line)
    if (chartType === 'candles' || chartType === 'hollow' || chartType === 'heikin') {
      const candleW = Math.max(3, (chartW / candles.length) * 0.68);

      candles.forEach((c, idx) => {
        const x = getX(idx);
        let open = c.open;
        let close = c.close;
        let high = c.high;
        let low = c.low;

        // Heikin-Ashi calculation
        if (chartType === 'heikin' && idx > 0) {
          const prev = candles[idx - 1];
          close = (c.open + c.high + c.low + c.close) / 4;
          open = (prev.open + prev.close) / 2;
          high = Math.max(c.high, open, close);
          low = Math.min(c.low, open, close);
        }

        const yOpen = getY(open);
        const yClose = getY(close);
        const yHigh = getY(high);
        const yLow = getY(low);
        const isUp = close >= open;
        const color = isUp ? '#089981' : '#F23645';

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Body
        const topY = Math.min(yOpen, yClose);
        const bodyH = Math.max(1.5, Math.abs(yClose - yOpen));

        if (chartType === 'hollow' && isUp) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x - candleW / 2, topY, candleW, bodyH);
        } else {
          ctx.fillStyle = color;
          ctx.fillRect(x - candleW / 2, topY, candleW, bodyH);
        }
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
        const gradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
        gradient.addColorStop(0, 'rgba(41, 98, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(41, 98, 255, 0.0)');
        
        ctx.lineTo(getX(candles.length - 1), padTop + chartH);
        ctx.lineTo(getX(0), padTop + chartH);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

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

    // 5. Moving Average Lines (MA 20 in Amber, MA 50 in Cyan, EMA 20 in Purple)
    const drawMA = (period: number, color: string) => {
      if (candles.length <= period) return;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      let started = false;

      for (let i = period - 1; i < candles.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) sum += candles[i - j].close;
        const ma = sum / period;
        const x = getX(i);
        const y = getY(ma);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    if (indicators.ma20) drawMA(20, '#F59E0B');
    if (indicators.ma50) drawMA(50, '#06B6D4');
    if (indicators.ema20) drawMA(15, '#A855F7');

    // 6. Current Live Price Line & Y-Axis Tag
    const currentClose = candles[candles.length - 1].close;
    const currentY = getY(currentClose);
    const isLiveUp = currentClose >= (candles[candles.length - 2]?.close || currentClose);

    ctx.strokeStyle = isLiveUp ? 'rgba(8, 153, 129, 0.75)' : 'rgba(242, 54, 69, 0.75)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padLeft, currentY);
    ctx.lineTo(width - padRight, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Live Tag
    const tagColor = isLiveUp ? '#089981' : '#F23645';
    ctx.fillStyle = tagColor;
    ctx.beginPath();
    ctx.roundRect(width - padRight + 2, currentY - 10, padRight - 6, 20, 4);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(currentClose.toFixed(2), width - padRight + 2 + (padRight - 8) / 2, currentY + 4);

    // 7. Sub-Panel: RSI (14)
    let currentBottomY = padTop + chartH + 28;
    if (indicators.rsi) {
      const rsiH = 55;
      ctx.fillStyle = '#171B26';
      ctx.fillRect(padLeft, currentBottomY, chartW, rsiH);

      // Boundaries
      ctx.strokeStyle = '#363A45';
      ctx.setLineDash([2, 2]);
      const y70 = currentBottomY + rsiH * 0.3;
      const y30 = currentBottomY + rsiH * 0.7;

      ctx.beginPath();
      ctx.moveTo(padLeft, y70);
      ctx.lineTo(padLeft + chartW, y70);
      ctx.moveTo(padLeft, y30);
      ctx.lineTo(padLeft + chartW, y30);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#8d90a2';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('RSI (14)  58.2', padLeft + 6, currentBottomY + 12);
      ctx.fillText('70', width - padRight + 6, y70 + 3);
      ctx.fillText('30', width - padRight + 6, y30 + 3);

      // RSI curve
      ctx.beginPath();
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 1.5;
      candles.forEach((c, idx) => {
        const x = getX(idx);
        const rsiVal = 50 + Math.sin(idx * 0.3) * 22;
        const y = currentBottomY + rsiH - (rsiVal / 100) * rsiH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      currentBottomY += rsiH + 15;
    }

    // 8. Sub-Panel: MACD (12, 26, 9)
    if (indicators.macd) {
      const macdH = 55;
      ctx.fillStyle = '#171B26';
      ctx.fillRect(padLeft, currentBottomY, chartW, macdH);

      ctx.fillStyle = '#8d90a2';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('MACD (12, 26, 9)', padLeft + 6, currentBottomY + 12);

      const midY = currentBottomY + macdH / 2;
      ctx.strokeStyle = '#363A45';
      ctx.beginPath();
      ctx.moveTo(padLeft, midY);
      ctx.lineTo(padLeft + chartW, midY);
      ctx.stroke();

      // MACD histogram bars
      candles.forEach((c, idx) => {
        const x = getX(idx);
        const val = Math.sin(idx * 0.28) * (macdH * 0.35);
        const isUp = val >= 0;
        ctx.fillStyle = isUp ? '#089981' : '#F23645';
        ctx.fillRect(x - 1.5, midY, 3, -val);
      });

      currentBottomY += macdH + 15;
    }

    // 9. Drawing Annotations (Fibonacci, Trendlines, Position tools)
    drawnItems.forEach((item) => {
      if (item.type === 'trendline') {
        ctx.strokeStyle = '#2962FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(item.x1, item.y1);
        ctx.lineTo(item.x2, item.y2);
        ctx.stroke();
      } else if (item.type === 'horizontal') {
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 2]);
        ctx.beginPath();
        ctx.moveTo(padLeft, item.y1);
        ctx.lineTo(width - padRight, item.y1);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (item.type === 'fibonacci') {
        // Fibonacci Retracement Levels
        const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0];
        const colors = ['#8d90a2', '#F23645', '#F59E0B', '#089981', '#06B6D4', '#2962FF', '#A855F7'];
        const dy = item.y2 - item.y1;

        levels.forEach((lvl, li) => {
          const y = item.y1 + dy * lvl;
          ctx.strokeStyle = colors[li];
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(padLeft, y);
          ctx.lineTo(width - padRight, y);
          ctx.stroke();

          ctx.fillStyle = colors[li];
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(`Fib ${lvl} (${lvl * 100}%)`, padLeft + 6, y - 3);
        });
      } else if (item.type === 'position_long') {
        // Long Position Target & Stop Box
        const stopY = item.y1 + 40;
        const targetY = item.y1 - 60;
        const boxW = Math.min(220, chartW * 0.4);

        // Profit target box (Green)
        ctx.fillStyle = 'rgba(8, 153, 129, 0.2)';
        ctx.fillRect(item.x1, targetY, boxW, item.y1 - targetY);
        ctx.strokeStyle = '#089981';
        ctx.strokeRect(item.x1, targetY, boxW, item.y1 - targetY);

        // Stop loss box (Red)
        ctx.fillStyle = 'rgba(242, 54, 69, 0.2)';
        ctx.fillRect(item.x1, item.y1, boxW, stopY - item.y1);
        ctx.strokeStyle = '#F23645';
        ctx.strokeRect(item.x1, item.y1, boxW, stopY - item.y1);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px "Inter", sans-serif';
        ctx.fillText('LONG: Risk:Reward 1.50', item.x1 + 6, item.y1 - 6);
      }
    });

    // 10. Interactive Crosshair HUD
    if (mousePos && mousePos.x >= padLeft && mousePos.x <= width - padRight && mousePos.y >= padTop && mousePos.y <= padTop + chartH) {
      const relX = (mousePos.x - padLeft) / chartW;
      const cIdx = Math.max(0, Math.min(candles.length - 1, Math.round(relX * (candles.length - 1))));
      const activeC = candles[cIdx];
      const snapX = getX(cIdx);

      ctx.strokeStyle = 'rgba(223, 226, 242, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(snapX, padTop);
      ctx.lineTo(snapX, padTop + chartH);
      ctx.moveTo(padLeft, mousePos.y);
      ctx.lineTo(width - padRight, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Price Tag on Y Axis
      const hoverPrice = maxPrice - ((mousePos.y - padTop) / chartH) * (maxPrice - minPrice);
      ctx.fillStyle = '#262A35';
      ctx.strokeStyle = '#363A45';
      ctx.fillRect(width - padRight + 2, mousePos.y - 10, padRight - 6, 20);
      ctx.strokeRect(width - padRight + 2, mousePos.y - 10, padRight - 6, 20);

      ctx.fillStyle = '#dfe2f2';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(hoverPrice.toFixed(2), width - padRight + 2 + (padRight - 8) / 2, mousePos.y + 4);

      // Time Tag on X Axis
      ctx.fillStyle = '#262A35';
      ctx.fillRect(snapX - 35, padTop + chartH + 4, 70, 18);
      ctx.strokeRect(snapX - 35, padTop + chartH + 4, 70, 18);

      ctx.fillStyle = '#dfe2f2';
      ctx.font = '10px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(activeC.time, snapX, padTop + chartH + 16);
    }
  }, [candles, chartType, indicators, mousePos, drawnItems]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const padLeft = 12;
    const padRight = 68;
    const chartW = rect.width - padLeft - padRight;
    const relX = (x - padLeft) / chartW;
    const cIdx = Math.max(0, Math.min(candles.length - 1, Math.round(relX * (candles.length - 1))));
    setHoveredCandle(candles[cIdx] || null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'trendline' || activeTool === 'fibonacci' || activeTool === 'position_long') {
      if (!drawingStart) {
        setDrawingStart({ x, y });
      } else {
        setDrawnItems((prev) => [...prev, { type: activeTool, x1: drawingStart.x, y1: drawingStart.y, x2: x, y2: y }]);
        setDrawingStart(null);
      }
    } else if (activeTool === 'horizontal') {
      setDrawnItems((prev) => [...prev, { type: 'horizontal', x1: 12, y1: y, x2: rect.width - 68, y2: y }]);
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
      <div className="bg-[#171B26] border-b border-[#363A45] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Asset Ticker Info */}
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: asset.badgeBgColor || (isPositive ? '#089981' : '#F23645') }}
            className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs text-white font-bold shadow-md flex-shrink-0"
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
              <span className="text-[10px] bg-[#262A35] text-[#8d90a2] border border-[#363A45] px-1.5 py-0.5 rounded font-mono">
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
        <div className="flex items-center bg-[#131722] rounded-lg p-0.5 border border-[#363A45]">
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

        {/* Right: Chart Style & Technical Indicator Toggles */}
        <div className="flex items-center gap-2">
          {/* Chart Style Toggle */}
          <div className="flex items-center bg-[#131722] rounded-lg p-0.5 border border-[#363A45]">
            <button
              onClick={() => setChartType('candles')}
              className={`px-2 py-1 rounded text-xs transition-colors font-medium ${
                chartType === 'candles' ? 'bg-[#262A35] text-[#2962FF]' : 'text-[#8d90a2] hover:text-white'
              }`}
              title="Candlesticks"
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('hollow')}
              className={`px-2 py-1 rounded text-xs transition-colors font-medium ${
                chartType === 'hollow' ? 'bg-[#262A35] text-[#2962FF]' : 'text-[#8d90a2] hover:text-white'
              }`}
              title="Hollow Candles"
            >
              Hollow
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-1 rounded text-xs transition-colors font-medium ${
                chartType === 'area' ? 'bg-[#262A35] text-[#2962FF]' : 'text-[#8d90a2] hover:text-white'
              }`}
              title="Area Gradient"
            >
              Area
            </button>
          </div>

          {/* Indicator Toggles */}
          <div className="hidden xl:flex items-center gap-1">
            <button
              onClick={() => setIndicators((p) => ({ ...p, ma20: !p.ma20 }))}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                indicators.ma20 ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]' : 'bg-[#131722] border-[#363A45] text-[#8d90a2]'
              }`}
            >
              MA 20
            </button>
            <button
              onClick={() => setIndicators((p) => ({ ...p, bollinger: !p.bollinger }))}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                indicators.bollinger ? 'bg-[#2962FF]/20 border-[#2962FF] text-[#2962FF]' : 'bg-[#131722] border-[#363A45] text-[#8d90a2]'
              }`}
            >
              BBands
            </button>
            <button
              onClick={() => setIndicators((p) => ({ ...p, rsi: !p.rsi }))}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                indicators.rsi ? 'bg-[#A855F7]/20 border-[#A855F7] text-[#A855F7]' : 'bg-[#131722] border-[#363A45] text-[#8d90a2]'
              }`}
            >
              RSI
            </button>
            <button
              onClick={() => setIndicators((p) => ({ ...p, macd: !p.macd }))}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                indicators.macd ? 'bg-[#089981]/20 border-[#089981] text-[#089981]' : 'bg-[#131722] border-[#363A45] text-[#8d90a2]'
              }`}
            >
              MACD
            </button>
          </div>

          {/* Quick Buy & Sell Buttons */}
          <div className="flex items-center gap-1.5 ml-1">
            <button
              onClick={() => onOpenTrading('BUY')}
              className="bg-[#089981] hover:bg-[#07856f] text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow transition-transform active:scale-95 cursor-pointer"
            >
              Buy
            </button>
            <button
              onClick={() => onOpenTrading('SELL')}
              className="bg-[#F23645] hover:bg-[#d82a38] text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow transition-transform active:scale-95 cursor-pointer"
            >
              Sell
            </button>
          </div>

          {/* Fullscreen */}
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
      <div className="flex flex-grow relative min-h-[400px] sm:min-h-[460px]">
        {/* Left Toolbar for Pro Drawing Tools */}
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
            title="Trendline (Click 2 points)"
          >
            <PenTool className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('horizontal')}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'horizontal' ? 'bg-[#2962FF] text-white' : 'text-[#8d90a2] hover:text-white hover:bg-[#262A35]'
            }`}
            title="Horizontal Support/Resistance Level"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('fibonacci')}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'fibonacci' ? 'bg-[#2962FF] text-white' : 'text-[#8d90a2] hover:text-white hover:bg-[#262A35]'
            }`}
            title="Fibonacci Retracement Grid"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('position_long')}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'position_long' ? 'bg-[#2962FF] text-white' : 'text-[#8d90a2] hover:text-white hover:bg-[#262A35]'
            }`}
            title="Long Position Risk:Reward Tool"
          >
            <PieChart className="w-4 h-4" />
          </button>

          {drawnItems.length > 0 && (
            <button
              onClick={() => setDrawnItems([])}
              className="p-2 rounded-lg text-[#F23645] hover:bg-[#262A35] transition-colors mt-auto"
              title="Clear All Annotations"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Canvas & HUD Area */}
        <div className="relative flex-grow h-full overflow-hidden bg-[#131722]">
          {/* Dynamic HUD / Candle Metrics */}
          {displayCandle && (
            <div className="absolute top-2 left-3 z-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono pointer-events-none bg-[#131722]/85 backdrop-blur px-2.5 py-1 rounded-md border border-[#363A45]/50">
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

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              setMousePos(null);
              setHoveredCandle(null);
            }}
            onMouseDown={handleMouseDown}
            className="w-full h-full block cursor-crosshair"
            style={{ minHeight: indicators.rsi && indicators.macd ? '520px' : indicators.rsi || indicators.macd ? '460px' : '400px' }}
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

        <div className="flex items-center gap-3 font-mono">
          <span className="inline-flex items-center gap-1 text-[11px] text-[#089981]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981]"></span>
            PRO FEED ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
};
