import React from 'react';
import { Store } from '../types';
import { STORES } from '../data/menuData';
import { X, MapPin, Check, Phone } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStore: Store;
  onSelectStore: (store: Store) => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  onClose,
  currentStore,
  onSelectStore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-stone-900 text-base">
              픽업 매장 선택
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store List */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {STORES.map((store) => {
            const isSelected = store.id === currentStore.id;

            return (
              <button
                key={store.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  onSelectStore(store);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50/60 ring-2 ring-amber-300 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-stone-900 text-sm">
                      {store.name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-amber-400 text-stone-950">
                        현재 선택
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500">{store.address}</p>
                  <div className="flex items-center gap-2 text-[11px] text-stone-600 font-medium pt-0.5">
                    <span className="text-amber-800 font-bold">{store.distance}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">{store.waitTime}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-stone-500">
                      <Phone className="w-3 h-3" /> {store.phone}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-amber-400 border-amber-500 text-stone-950'
                      : 'border-stone-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
