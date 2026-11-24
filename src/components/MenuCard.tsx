import React from 'react';
import { MenuItem } from '../types';
import { Plus, SlidersHorizontal, Flame, Sparkles } from 'lucide-react';
import { playClickSound, playPopSound } from '../utils/sound';

interface MenuCardProps {
  item: MenuItem;
  onOpenOptionModal: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onOpenOptionModal,
  onQuickAdd,
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md hover:border-amber-400 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Thumbnail with Badges */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 items-center">
          {item.isBest && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black shadow-xs tracking-wider">
              <Flame className="w-2.5 h-2.5 fill-current" />
              BEST
            </span>
          )}
          {item.isNew && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black shadow-xs tracking-wider">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              NEW
            </span>
          )}
        </div>

        {/* Temperature Badges */}
        <div className="absolute top-2.5 right-2.5 flex gap-1">
          {item.isIceAvailable && (
            <span className="px-1.5 py-0.5 rounded-md bg-blue-500/90 text-white text-[10px] font-bold backdrop-blur-xs">
              ICE
            </span>
          )}
          {item.isHotAvailable && (
            <span className="px-1.5 py-0.5 rounded-md bg-red-500/90 text-white text-[10px] font-bold backdrop-blur-xs">
              HOT
            </span>
          )}
        </div>

        {/* Size Badge */}
        <div className="absolute bottom-2 right-2 bg-stone-900/85 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md backdrop-blur-xs">
          {item.size}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-1">
            <h4 className="font-extrabold text-stone-900 text-sm sm:text-base leading-snug group-hover:text-amber-900 transition">
              {item.name}
            </h4>
          </div>
          <p className="text-[11px] text-stone-600 font-medium tracking-tight mb-1">
            {item.englishName}
          </p>
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-2">
            {item.description}
          </p>
        </div>

        <div>
          {/* Nutrition info */}
          <div className="flex items-center gap-2 text-[10px] font-medium text-stone-600 mb-2.5">
            <span>{item.calories} kcal</span>
            {item.caffeine > 0 && (
              <>
                <span>•</span>
                <span>카페인 {item.caffeine}mg</span>
              </>
            )}
          </div>

          {/* Price & Action Buttons */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
            <div className="font-black text-base sm:text-lg text-stone-950 tracking-tight">
              {item.price.toLocaleString()}
              <span className="text-xs font-bold ml-0.5 text-stone-600">원</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Option Customize Button */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onOpenOptionModal(item);
                }}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 text-xs font-bold transition flex items-center gap-1"
                title="옵션 선택"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">옵션</span>
              </button>

              {/* Quick Add Button */}
              <button
                type="button"
                onClick={() => {
                  playPopSound();
                  onQuickAdd(item);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-black transition flex items-center gap-1 shadow-xs active:scale-95"
                title="기본 옵션으로 담기"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span className="text-xs">담기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
