import React, { useState, useEffect } from 'react';
import { MenuItem, CustomOptions } from '../types';
import { X, Plus, Minus, Check, Coffee } from 'lucide-react';
import { playClickSound, playPopSound } from '../utils/sound';

interface OptionModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, options: CustomOptions, quantity: number) => void;
}

export const OptionModal: React.FC<OptionModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !item) return null;

  const [temp, setTemp] = useState<'ICE' | 'HOT'>(item.defaultTemp);
  const [iceLevel, setIceLevel] = useState<'적게' | '보통' | '많이'>('보통');
  const [shot, setShot] = useState<CustomOptions['shot']>('기본');
  const [sweetness, setSweetness] = useState<CustomOptions['sweetness']>('기본');
  const [milk, setMilk] = useState<CustomOptions['milk']>('기본(우유)');
  const [toppings, setToppings] = useState<string[]>([]);
  const [cupType, setCupType] = useState<CustomOptions['cupType']>('일회용컵');
  const [quantity, setQuantity] = useState(1);

  // Reset defaults when item changes
  useEffect(() => {
    if (item) {
      setTemp(item.defaultTemp);
      setIceLevel('보통');
      setShot('기본');
      setSweetness('기본');
      setMilk('기본(우유)');
      setToppings([]);
      setCupType('일회용컵');
      setQuantity(1);
    }
  }, [item]);

  // Compute unit price modifications
  const calculateOptionExtra = () => {
    let extra = 0;
    if (shot === '1샷 추가(+500원)') extra += 500;
    if (shot === '2샷 추가(+1,000원)') extra += 1000;
    if (shot === '디카페인 변경(+1,000원)') extra += 1000;

    if (sweetness === '바닐라시럽(+500원)') extra += 500;
    if (sweetness === '헤이즐넛시럽(+500원)') extra += 500;
    if (sweetness === '스테비아 저당(+600원)') extra += 600;

    if (milk === '아몬드밀크(+500원)') extra += 500;
    if (milk === '오트(귀리)밀크(+500원)') extra += 500;

    toppings.forEach((top) => {
      if (top.includes('+500원')) extra += 500;
      if (top.includes('+800원')) extra += 800;
    });

    if (cupType === '개인 텀블러(-300원 할인)') extra -= 300;

    return extra;
  };

  const unitPrice = Math.max(0, item.price + calculateOptionExtra());
  const totalPrice = unitPrice * quantity;

  const handleToggleTopping = (toppingName: string) => {
    playClickSound();
    setToppings((prev) =>
      prev.includes(toppingName)
        ? prev.filter((t) => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const handleConfirmAddToCart = () => {
    playPopSound();
    const options: CustomOptions = {
      temp,
      iceLevel,
      shot,
      sweetness,
      milk,
      toppings,
      cupType,
    };
    onAddToCart(item, options, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300"
        role="dialog"
      >
        {/* Modal Header */}
        <div className="relative p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
            />
            <div>
              <h3 className="font-extrabold text-stone-900 text-base leading-tight">
                {item.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                <span className="text-amber-800 font-bold">{item.size}</span>
                <span>•</span>
                <span>{item.calories} kcal</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* 1. Temperature selection */}
          {item.isHotAvailable && item.isIceAvailable && (
            <div>
              <label className="block font-extrabold text-stone-900 mb-2">
                온도 선택 (HOT / ICE)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setTemp('ICE');
                  }}
                  className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition border ${
                    temp === 'ICE'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>🧊 ICE (시원한 얼음)</span>
                  {temp === 'ICE' && <Check className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setTemp('HOT');
                  }}
                  className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition border ${
                    temp === 'HOT'
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>🔥 HOT (따뜻하게)</span>
                  {temp === 'HOT' && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* 2. Ice level (if ICE) */}
          {temp === 'ICE' && item.availableOptions.iceLevel && (
            <div>
              <label className="block font-extrabold text-stone-900 mb-2">
                얼음량 선택
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['적게', '보통', '많이'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setIceLevel(lvl);
                    }}
                    className={`py-2 px-2.5 rounded-xl font-bold text-xs transition border ${
                      iceLevel === lvl
                        ? 'bg-amber-400 text-stone-950 border-amber-500 font-black'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    얼음 {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Shot Options */}
          {item.availableOptions.shots && (
            <div>
              <label className="block font-extrabold text-stone-900 mb-2">
                에스프레소 샷 조절 & 원두 선택
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    '기본',
                    '연하게(-1샷)',
                    '1샷 추가(+500원)',
                    '2샷 추가(+1,000원)',
                    '디카페인 변경(+1,000원)',
                  ] as const
                ).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setShot(s);
                    }}
                    className={`py-2 px-2.5 rounded-xl font-bold text-xs transition border text-left flex items-center justify-between ${
                      shot === s
                        ? 'bg-amber-400 text-stone-950 border-amber-500 font-black'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className="truncate">{s}</span>
                    {shot === s && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Sweetness / Syrups */}
          {item.availableOptions.sweetness && (
            <div>
              <label className="block font-extrabold text-stone-900 mb-2">
                당도 및 시럽 변경
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    '기본',
                    '덜 달게',
                    '달게',
                    '바닐라시럽(+500원)',
                    '헤이즐넛시럽(+500원)',
                    '스테비아 저당(+600원)',
                  ] as const
                ).map((sw) => (
                  <button
                    key={sw}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSweetness(sw);
                    }}
                    className={`py-2 px-2 rounded-xl font-bold text-xs transition border text-left flex items-center justify-between ${
                      sweetness === sw
                        ? 'bg-amber-400 text-stone-950 border-amber-500 font-black'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className="truncate">{sw}</span>
                    {sweetness === sw && (
                      <Check className="w-3.5 h-3.5 shrink-0 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. Milk selection */}
          {item.availableOptions.milk && (
            <div>
              <label className="block font-extrabold text-stone-900 mb-2">
                우유 선택 (비건 & 락토프리)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    '기본(우유)',
                    '아몬드밀크(+500원)',
                    '오트(귀리)밀크(+500원)',
                  ] as const
                ).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setMilk(m);
                    }}
                    className={`py-2 px-2 rounded-xl font-bold text-xs transition border text-left flex items-center justify-between ${
                      milk === m
                        ? 'bg-amber-400 text-stone-950 border-amber-500 font-black'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className="truncate">{m}</span>
                    {milk === m && (
                      <Check className="w-3.5 h-3.5 shrink-0 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. Toppings */}
          {item.availableOptions.toppings && (
            <div>
              <label className="block font-extrabold text-stone-900 mb-2">
                토핑 추가 (다중 선택 가능)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  '죠리퐁 추가(+500원)',
                  '휘핑 추가(+500원)',
                  '화이트펄 추가(+800원)',
                ].map((top) => {
                  const isChecked = toppings.includes(top);
                  return (
                    <button
                      key={top}
                      type="button"
                      onClick={() => handleToggleTopping(top)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition border flex items-center justify-between ${
                        isChecked
                          ? 'bg-amber-100 border-amber-400 text-stone-900 font-black'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span>{top}</span>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isChecked
                            ? 'bg-stone-900 border-stone-900 text-white'
                            : 'border-stone-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. Cup Type & Eco Discount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-extrabold text-stone-900">컵 선택</label>
              <span className="text-[11px] text-emerald-700 font-bold">
                텀블러 이용 시 300원 즉시 할인 🌱
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  '일회용컵',
                  '매장컵',
                  '개인 텀블러(-300원 할인)',
                ] as const
              ).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setCupType(c);
                  }}
                  className={`py-2 px-2 rounded-xl font-bold text-xs transition border text-center ${
                    cupType === c
                      ? 'bg-stone-900 text-amber-300 border-stone-900 font-black'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-xl border border-stone-300 shadow-xs">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => {
                playClickSound();
                setQuantity((q) => Math.max(1, q - 1));
              }}
              className="p-1 rounded-lg text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-black text-stone-900 text-sm">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setQuantity((q) => q + 1);
              }}
              className="p-1 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleConfirmAddToCart}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-sm transition shadow-md active:scale-[0.98] flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Coffee className="w-4 h-4" />
              <span>장바구니 담기</span>
            </span>
            <span className="text-base tracking-tight font-black">
              {totalPrice.toLocaleString()}원
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
