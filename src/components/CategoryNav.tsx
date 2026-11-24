import React from 'react';
import { CATEGORIES } from '../data/menuData';
import { CategoryId } from '../types';
import { Coffee, Flame, CupSoda, Sparkles, IceCream, GlassWater, Cake } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface CategoryNavProps {
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  categoryCounts: Record<CategoryId, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const getIcon = (name: string, isActive: boolean) => {
    const className = `w-4 h-4 ${isActive ? 'text-stone-950' : 'text-stone-500'}`;
    switch (name) {
      case 'Flame':
        return <Flame className={className} />;
      case 'CupSoda':
        return <CupSoda className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'IceCream':
        return <IceCream className={className} />;
      case 'GlassWater':
        return <GlassWater className={className} />;
      case 'Cake':
        return <Cake className={className} />;
      case 'Coffee':
      default:
        return <Coffee className={className} />;
    }
  };

  return (
    <nav className="sticky top-[105px] z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs py-2 px-4 transition-all">
      <div className="max-w-5xl mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                playClickSound();
                onSelectCategory(cat.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-amber-400 text-stone-950 shadow-sm border border-stone-900/20 scale-[1.02]'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              {getIcon(cat.iconName, isActive)}
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive
                    ? 'bg-stone-950 text-amber-300'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
