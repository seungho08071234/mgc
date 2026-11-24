import React, { useState } from 'react';
import { Volume2, VolumeX, MapPin, Bell, ChevronDown, Search } from 'lucide-react';
import { Store, Order } from '../types';
import { playClickSound } from '../utils/sound';
import { BRAND_ASSETS } from '../data/images';

interface HeaderProps {
  currentStore: Store;
  onOpenStoreModal: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  activeOrders: Order[];
  onOpenPickupModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStore,
  onOpenStoreModal,
  isMuted,
  onToggleSound,
  activeOrders,
  onOpenPickupModal,
  searchQuery,
  onSearchChange,
}) => {
  const [logoError, setLogoError] = useState(false);
  const pendingOrdersCount = activeOrders.filter(
    (o) => o.status !== 'COMPLETED'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-all">
      {/* Top Brand Bar */}
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          {!logoError ? (
            <img
              src={BRAND_ASSETS.logoEmblem}
              alt="메가MGC커피 로고"
              onError={() => setLogoError(true)}
              className="w-10 h-10 object-contain drop-shadow-xs transition-transform hover:scale-105"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center font-black text-stone-900 text-lg shadow-sm tracking-tighter border-2 border-stone-900">
              MGC
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-stone-900 tracking-tight text-base sm:text-lg">
                메가MGC커피
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-400 text-stone-950 border border-amber-500 shadow-2xs">
                스마트오더
              </span>
            </div>
            <span className="text-[10px] text-stone-500 font-bold hidden sm:inline tracking-wide">
              MEGA MGC COFFEE · BIG SIZE 2 SHOT
            </span>
          </div>
        </div>

        {/* Right utility buttons: Sound toggle & Pickup status */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onToggleSound();
            }}
            title={isMuted ? '음소거 해제' : '음소거'}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition flex items-center gap-1 text-xs font-semibold"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-stone-400" />
                <span className="hidden md:inline text-stone-500">소리 꺼짐</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span className="hidden md:inline text-amber-800">효과음 ON</span>
              </>
            )}
          </button>

          {/* Pickup Order Alert Bell */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onOpenPickupModal();
            }}
            className="relative p-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold transition flex items-center gap-1.5 shadow-sm text-xs"
          >
            <Bell className="w-4 h-4" />
            <span className="font-bold">픽업 현황</span>
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-black flex items-center justify-center animate-pulse border-2 border-white">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Store Location Bar & Search Line */}
      <div className="bg-stone-50/90 border-t border-stone-200/60 px-4 py-2">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Store Picker trigger */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onOpenStoreModal();
            }}
            className="flex items-center gap-2 text-left group hover:opacity-90 transition"
          >
            <div className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-stone-900 text-xs sm:text-sm group-hover:text-amber-800 transition">
                {currentStore.name}
              </span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                {currentStore.waitTime}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 group-hover:translate-y-0.5 transition" />
            </div>
          </button>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="메뉴명 검색 (예: 아메리카노, 퐁크러쉬)"
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-stone-800 placeholder:text-stone-400 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
