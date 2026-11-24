import React, { useState, useEffect } from 'react';
import { PROMO_BANNERS } from '../data/menuData';
import { Sparkles, ChevronRight } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface BannerProps {
  onSelectPromoTag?: (tag: string) => void;
}

export const Banner: React.FC<BannerProps> = ({ onSelectPromoTag }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentBanner = PROMO_BANNERS[currentIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 pt-3 pb-1">
      <div
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-r ${currentBanner.bgColor} ${currentBanner.textColor} shadow-md transition-all duration-500`}
      >
        {/* Decorative background shapes */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/20 blur-xl pointer-events-none" />
        <div className="absolute right-12 -top-4 w-24 h-24 rounded-full bg-black/10 blur-md pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900/80 text-white text-[11px] font-bold tracking-wide">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{currentBanner.badge}</span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              {currentBanner.title}
            </h3>
            <p className="text-xs sm:text-sm font-medium opacity-90">
              {currentBanner.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                if (onSelectPromoTag) {
                  onSelectPromoTag(currentBanner.tag);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition flex items-center gap-1 shrink-0 shadow-sm"
            >
              <span>메뉴 보러가기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Carousel indicator dots */}
        <div className="flex items-center gap-1.5 mt-3">
          {PROMO_BANNERS.map((banner, idx) => (
            <button
              key={banner.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-6 bg-stone-900' : 'w-2 bg-stone-900/30'
              }`}
              aria-label={`배너 ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
