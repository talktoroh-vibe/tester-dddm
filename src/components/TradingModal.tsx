import React, { useState } from 'react';
import { Asset, Order } from '../types';
import { X, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
  balance: number;
  onExecuteOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => void;
  initialSide?: 'BUY' | 'SELL';
}

export const TradingModal: React.FC<TradingModalProps> = ({
  isOpen,
  onClose,
  asset,
  balance,
  onExecuteOrder,
  initialSide = 'BUY',
}) => {
  const [side, setSide] = useState<'BUY' | 'SELL'>(initialSide);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [amount, setAmount] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(asset.price);
  const [successMsg, setSuccessMsg] = useState('');

  // Synchronize initial side when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSide(initialSide);
      setLimitPrice(asset.price);
    }
  }, [isOpen, initialSide, asset.price]);

  if (!isOpen) return null;

  const currentPrice = orderType === 'MARKET' ? asset.price : limitPrice;
  const totalCost = amount * currentPrice;
  const canAfford = side === 'SELL' || totalCost <= balance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAfford) return;

    onExecuteOrder({
      symbol: asset.symbol,
      type: side,
      orderType,
      price: currentPrice,
      amount,
      total: totalCost,
    });

    setSuccessMsg(`Successfully submitted ${side} order for ${amount} ${asset.symbol}`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#1E222D] border border-[#363A45] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#363A45] bg-[#171B26]">
          <div className="flex items-center gap-2.5">
            <span className="font-headline font-bold text-base text-white">
              Paper Order Ticket
            </span>
            <span className="text-xs bg-[#2962FF]/20 text-[#2962FF] border border-[#2962FF]/40 px-2 py-0.5 rounded-full font-mono">
              {asset.symbol}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-[#8d90a2] hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Side Selector (BUY / SELL) */}
          <div className="grid grid-cols-2 gap-2 bg-[#131722] p-1 rounded-xl border border-[#363A45]">
            <button
              type="button"
              onClick={() => setSide('BUY')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                side === 'BUY'
                  ? 'bg-[#089981] text-white shadow-md'
                  : 'text-[#8d90a2] hover:text-white'
              }`}
            >
              BUY / LONG
            </button>
            <button
              type="button"
              onClick={() => setSide('SELL')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                side === 'SELL'
                  ? 'bg-[#F23645] text-white shadow-md'
                  : 'text-[#8d90a2] hover:text-white'
              }`}
            >
              SELL / SHORT
            </button>
          </div>

          {/* Order Type Selector */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8d90a2]">Order Type:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOrderType('MARKET')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  orderType === 'MARKET' ? 'bg-[#2962FF] text-white font-medium' : 'text-[#8d90a2] bg-[#131722]'
                }`}
              >
                Market
              </button>
              <button
                type="button"
                onClick={() => setOrderType('LIMIT')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  orderType === 'LIMIT' ? 'bg-[#2962FF] text-white font-medium' : 'text-[#8d90a2] bg-[#131722]'
                }`}
              >
                Limit
              </button>
            </div>
          </div>

          {/* Limit Price Input (if LIMIT) */}
          {orderType === 'LIMIT' && (
            <div>
              <label className="block text-xs text-[#8d90a2] mb-1">Limit Price ({asset.currency})</label>
              <input
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(Number(e.target.value))}
                className="w-full bg-[#131722] border border-[#363A45] focus:border-[#2962FF] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none"
              />
            </div>
          )}

          {/* Quantity / Amount */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#8d90a2] mb-1">
              <span>Quantity / Units</span>
              <span>
                Available: ${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#131722] border border-[#363A45] focus:border-[#2962FF] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Summary Breakdown */}
          <div className="bg-[#131722] rounded-xl p-3.5 space-y-2 text-xs border border-[#363A45]">
            <div className="flex justify-between text-[#8d90a2]">
              <span>Execution Price:</span>
              <span className="font-mono text-white font-medium">
                ${currentPrice.toFixed(2)} {asset.currency}
              </span>
            </div>
            <div className="flex justify-between text-[#8d90a2]">
              <span>Estimated Value:</span>
              <span className="font-mono text-white font-bold text-sm">
                ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-[#8d90a2]">
              <span>Commission & Fees:</span>
              <span className="font-mono text-[#089981]">$0.00 (Zero-Fee Demo)</span>
            </div>
          </div>

          {/* Error / Success state */}
          {!canAfford && (
            <div className="flex items-center gap-2 text-xs text-[#F23645] bg-[#F23645]/10 p-2.5 rounded-lg border border-[#F23645]/30">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Insufficient paper balance to execute this buy order.</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 text-xs text-[#089981] bg-[#089981]/10 p-2.5 rounded-lg border border-[#089981]/30">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canAfford}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-150 cursor-pointer ${
              side === 'BUY'
                ? 'bg-[#089981] hover:bg-[#07856f] disabled:opacity-50'
                : 'bg-[#F23645] hover:bg-[#d82a38] disabled:opacity-50'
            }`}
          >
            Confirm {side} Order
          </button>
        </form>
      </div>
    </div>
  );
};
