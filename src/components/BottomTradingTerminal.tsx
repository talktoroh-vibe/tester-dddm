import React, { useState } from 'react';
import { Position, Order } from '../types';
import { 
  ChevronUp, ChevronDown, CheckCircle, XCircle, ArrowUpRight, 
  ArrowDownRight, DollarSign, PieChart, Clock, ShieldCheck, RefreshCw 
} from 'lucide-react';
import { playOrderSound } from '../utils/audio';

interface BottomTradingTerminalProps {
  positions: Position[];
  orders: Order[];
  balance: number;
  onClosePosition: (positionId: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onResetAccount: () => void;
}

export const BottomTradingTerminal: React.FC<BottomTradingTerminalProps> = ({
  positions,
  orders,
  balance,
  onClosePosition,
  isOpen,
  onToggleOpen,
  onResetAccount,
}) => {
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'account' | 'logs'>('positions');

  // Compute total unrealized PnL
  const totalUnrealizedPnL = positions.reduce((acc, pos) => acc + pos.pnl, 0);
  const totalEquity = balance + totalUnrealizedPnL;
  const isPositiveTotal = totalUnrealizedPnL >= 0;

  return (
    <div className="bg-[#171B26] border-t border-[#363A45] shadow-2xl transition-all duration-300 w-full">
      {/* Terminal Title Bar & Quick Stats */}
      <div className="px-4 py-2 bg-[#1E222D] border-b border-[#363A45] flex items-center justify-between">
        {/* Left: Terminal Title & Tab Triggers */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleOpen}
            className="font-headline font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 hover:text-[#2962FF] transition-colors"
          >
            <span>Trading Terminal</span>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          {/* Tab Buttons */}
          <div className="flex items-center bg-[#131722] rounded-lg p-0.5 border border-[#363A45]">
            <button
              onClick={() => {
                setActiveTab('positions');
                if (!isOpen) onToggleOpen();
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'positions' && isOpen
                  ? 'bg-[#2962FF] text-white font-semibold shadow'
                  : 'text-[#8d90a2] hover:text-[#dfe2f2]'
              }`}
            >
              <span>Positions</span>
              <span className="bg-[#1E222D] text-white px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                {positions.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                if (!isOpen) onToggleOpen();
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'orders' && isOpen
                  ? 'bg-[#2962FF] text-white font-semibold shadow'
                  : 'text-[#8d90a2] hover:text-[#dfe2f2]'
              }`}
            >
              <span>Orders</span>
              <span className="bg-[#1E222D] text-white px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('account');
                if (!isOpen) onToggleOpen();
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors hidden sm:block ${
                activeTab === 'account' && isOpen
                  ? 'bg-[#2962FF] text-white font-semibold shadow'
                  : 'text-[#8d90a2] hover:text-[#dfe2f2]'
              }`}
            >
              Account Summary
            </button>
          </div>
        </div>

        {/* Right: Balance & Total Unrealized PnL Pill */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs font-mono">
          <div className="hidden sm:block">
            <span className="text-[#8d90a2]">Cash: </span>
            <span className="text-white font-semibold">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-[#8d90a2]">Total Equity: </span>
            <span className="text-white font-bold">
              ${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div
            className={`px-2.5 py-0.5 rounded-full font-bold text-xs flex items-center gap-1 ${
              isPositiveTotal ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#F23645]/20 text-[#F23645]'
            }`}
          >
            <span>Unrealized P&L:</span>
            <span>{isPositiveTotal ? '+' : ''}${totalUnrealizedPnL.toFixed(2)}</span>
          </div>

          <button
            onClick={onResetAccount}
            className="p-1 text-[#8d90a2] hover:text-white hover:bg-[#262A35] rounded transition-colors hidden md:block"
            title="Reset Paper Account to $50,000"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Terminal Panel */}
      {isOpen && (
        <div className="h-52 overflow-y-auto bg-[#131722] text-xs">
          {/* TAB 1: POSITIONS */}
          {activeTab === 'positions' && (
            <div className="w-full">
              {positions.length === 0 ? (
                <div className="py-12 text-center text-[#8d90a2]">
                  No open positions. Click Buy or Sell on any instrument to enter a paper position.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#171B26] border-b border-[#363A45] text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">
                      <th className="py-2.5 px-4">Symbol / Side</th>
                      <th className="py-2.5 px-4 text-right">Size</th>
                      <th className="py-2.5 px-4 text-right">Entry Price</th>
                      <th className="py-2.5 px-4 text-right">Mark Price</th>
                      <th className="py-2.5 px-4 text-right">Unrealized P&L</th>
                      <th className="py-2.5 px-4 text-right">P&L %</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#363A45]/40 font-mono">
                    {positions.map((pos) => {
                      const isProfit = pos.pnl >= 0;
                      return (
                        <tr key={pos.id} className="hover:bg-[#1E222D] transition-colors">
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  pos.side === 'BUY'
                                    ? 'bg-[#089981]/20 text-[#089981]'
                                    : 'bg-[#F23645]/20 text-[#F23645]'
                                }`}
                              >
                                {pos.side}
                              </span>
                              <span className="font-bold text-white text-xs">{pos.symbol}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-right text-white font-medium">{pos.size}</td>
                          <td className="py-2.5 px-4 text-right text-[#8d90a2]">${pos.entryPrice.toFixed(2)}</td>
                          <td className="py-2.5 px-4 text-right text-white font-bold">${pos.currentPrice.toFixed(2)}</td>
                          <td className={`py-2.5 px-4 text-right font-bold ${isProfit ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                            {isProfit ? '+' : ''}${pos.pnl.toFixed(2)}
                          </td>
                          <td className={`py-2.5 px-4 text-right font-bold ${isProfit ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                            {isProfit ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => {
                                onClosePosition(pos.id);
                                playOrderSound(true);
                              }}
                              className="bg-[#F23645]/20 hover:bg-[#F23645] text-[#F23645] hover:text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Close
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="w-full">
              {orders.length === 0 ? (
                <div className="py-12 text-center text-[#8d90a2]">No orders recorded yet.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#171B26] border-b border-[#363A45] text-[10px] font-bold text-[#8d90a2] uppercase tracking-wider">
                      <th className="py-2.5 px-4">Time</th>
                      <th className="py-2.5 px-4">Symbol</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4 text-right">Amount</th>
                      <th className="py-2.5 px-4 text-right">Price</th>
                      <th className="py-2.5 px-4 text-right">Total Value</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#363A45]/40 font-mono">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#1E222D] transition-colors">
                        <td className="py-2.5 px-4 text-[#8d90a2]">
                          {ord.timestamp.toLocaleTimeString()}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-white">{ord.symbol}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              ord.type === 'BUY'
                                ? 'bg-[#089981]/20 text-[#089981]'
                                : 'bg-[#F23645]/20 text-[#F23645]'
                            }`}
                          >
                            {ord.type} {ord.orderType}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-white">{ord.amount}</td>
                        <td className="py-2.5 px-4 text-right text-white">${ord.price.toFixed(2)}</td>
                        <td className="py-2.5 px-4 text-right text-[#dfe2f2]">
                          ${ord.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="text-[10px] bg-[#089981]/20 text-[#089981] px-2 py-0.5 rounded font-bold">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT SUMMARY */}
          {activeTab === 'account' && (
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#1E222D] p-3 rounded-xl border border-[#363A45]">
                <div className="text-[#8d90a2] text-[11px] mb-1">Available Cash Balance</div>
                <div className="font-mono text-base font-bold text-white">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="bg-[#1E222D] p-3 rounded-xl border border-[#363A45]">
                <div className="text-[#8d90a2] text-[11px] mb-1">Net Portfolio Equity</div>
                <div className="font-mono text-base font-bold text-[#2962FF]">
                  ${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="bg-[#1E222D] p-3 rounded-xl border border-[#363A45]">
                <div className="text-[#8d90a2] text-[11px] mb-1">Open Positions Count</div>
                <div className="font-mono text-base font-bold text-white">{positions.length} Active</div>
              </div>
              <div className="bg-[#1E222D] p-3 rounded-xl border border-[#363A45]">
                <div className="text-[#8d90a2] text-[11px] mb-1">Broker Connectivity</div>
                <div className="font-mono text-xs font-bold text-[#089981] flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#089981]" />
                  Simulated DMA Gateway
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
