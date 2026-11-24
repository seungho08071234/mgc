import React from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { CartItem } from '../types';
import { playClickSound } from '../utils/sound';

interface FloatingCartBarProps {
  items: CartItem[];
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  items,
  onOpenCart,
}) => {
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  if (totalCount === 0) return null;

  return (
    <aside aria-label="장바구니 바로가기" className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onOpenCart();
          }}
          className="w-full bg-stone-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-stone-800 flex items-center justify-between hover:bg-stone-850 active:scale-[0.99] transition-all duration-200 group ring-4 ring-amber-400/20"
        >
          {/* Left: Badge & Count */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-black flex items-center justify-center border-2 border-stone-900 animate-bounce">
                {totalCount}
              </span>
            </div>

            <div className="text-left">
              <div className="text-[11px] text-stone-400 font-medium">
                담긴 음료 {totalCount}개
              </div>
              <div className="text-base sm:text-lg font-black text-amber-400 tracking-tight">
                {totalPrice.toLocaleString()}원
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex items-center gap-1.5 bg-amber-400 text-stone-950 px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm shadow-sm group-hover:bg-amber-300 transition">
            <span>주문서 확인</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>
      </div>
    </aside>
  );
};
