import React, { useState } from 'react';
import { CartItem, Store } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, ChevronRight } from 'lucide-react';
import { playClickSound, playDingDongSound } from '../utils/sound';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  currentStore: Store;
  onPlaceOrder: (orderData: {
    items: CartItem[];
    takeoutType: '포장 (테이크아웃)' | '매장 이용';
    paymentMethod: string;
    totalAmount: number;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentStore,
  onPlaceOrder,
}) => {
  if (!isOpen) return null;

  const [takeoutType, setTakeoutType] = useState<
    '포장 (테이크아웃)' | '매장 이용'
  >('포장 (테이크아웃)');
  const [paymentMethod, setPaymentMethod] = useState<string>('메가페이 (1초 결제)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItemCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + it.totalPrice, 0);

  // Calculate tumbler discounts
  const tumblerDiscount = items.reduce((sum, it) => {
    return it.options.cupType.includes('텀블러') ? sum + 300 * it.quantity : sum;
  }, 0);

  const finalAmount = Math.max(0, subtotal);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    playDingDongSound();

    setTimeout(() => {
      onPlaceOrder({
        items,
        takeoutType,
        paymentMethod,
        totalAmount: finalAmount,
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-stone-900 text-base">
              주문서 및 장바구니
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-xs font-black">
              {totalItemCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  if (confirm('장바구니를 모두 비우시겠습니까?')) {
                    onClearCart();
                  }
                }}
                className="text-xs text-stone-500 hover:text-red-600 font-semibold transition"
              >
                전체 비우기
              </button>
            )}
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
        </div>

        {/* Pickup Store Notice */}
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-800">
            <span className="font-bold text-amber-900">픽업 매장:</span>
            <span className="font-extrabold">{currentStore.name}</span>
          </div>
          <span className="font-semibold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-md">
            {currentStore.waitTime}
          </span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <ShoppingBag className="w-12 h-12 mb-3 stroke-1 text-stone-300" />
              <p className="font-bold text-stone-700 text-sm mb-1">
                장바구니가 비어 있습니다.
              </p>
              <p className="text-xs text-stone-400">
                메가커피의 맛있는 시그니처 음료를 담아보세요!
              </p>
            </div>
          ) : (
            items.map((cartItem) => (
              <div
                key={cartItem.cartId}
                className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col gap-2 relative group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={cartItem.menuItem.image}
                      alt={cartItem.menuItem.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="font-black text-stone-900 text-sm leading-tight">
                        {cartItem.menuItem.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                            cartItem.options.temp === 'ICE'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {cartItem.options.temp}
                        </span>
                        <span className="text-[11px] text-stone-500 font-bold">
                          {cartItem.menuItem.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onRemoveItem(cartItem.cartId);
                    }}
                    className="p-1 text-stone-400 hover:text-red-500 transition"
                    title="항목 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Option summary labels */}
                <div className="text-[11px] text-stone-600 bg-white p-2 rounded-xl border border-stone-200/60 space-y-0.5">
                  <div>• 옵션: {cartItem.options.shot} / {cartItem.options.sweetness}</div>
                  {cartItem.options.temp === 'ICE' && (
                    <div>• 얼음: {cartItem.options.iceLevel}</div>
                  )}
                  {cartItem.options.milk !== '기본(우유)' && (
                    <div>• 우유: {cartItem.options.milk}</div>
                  )}
                  {cartItem.options.toppings.length > 0 && (
                    <div>• 토핑: {cartItem.options.toppings.join(', ')}</div>
                  )}
                  <div className="text-amber-800 font-semibold">• 컵: {cartItem.options.cupType}</div>
                </div>

                {/* Price and quantity controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="font-black text-stone-950 text-sm">
                    {cartItem.totalPrice.toLocaleString()}원
                  </div>

                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-stone-300">
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onUpdateQuantity(cartItem.cartId, -1);
                      }}
                      className="p-0.5 text-stone-600 hover:text-stone-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-4 text-center font-bold text-xs text-stone-900">
                      {cartItem.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onUpdateQuantity(cartItem.cartId, 1);
                      }}
                      className="p-0.5 text-stone-600 hover:text-stone-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Takeout or In-Store Choice */}
          {items.length > 0 && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-black text-stone-800 mb-1.5">
                  포장 방식 선택
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['포장 (테이크아웃)', '매장 이용'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setTakeoutType(type);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                        takeoutType === type
                          ? 'bg-stone-900 text-amber-300 border-stone-900 font-black'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-black text-stone-800 mb-1.5">
                  결제 수단 선택
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '메가페이 (1초 결제)',
                    '신용/체크카드',
                    '카카오페이',
                    '네이버페이',
                  ].map((pay) => (
                    <button
                      key={pay}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setPaymentMethod(pay);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition border text-left flex items-center justify-between ${
                        paymentMethod === pay
                          ? 'bg-amber-400 text-stone-950 border-amber-500 font-black'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      <span className="truncate">{pay}</span>
                      {paymentMethod === pay && (
                        <CreditCard className="w-3.5 h-3.5 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>총 주문 상품</span>
                <span>{totalItemCount}개</span>
              </div>
              {tumblerDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>텀블러 에코 할인</span>
                  <span>-{tumblerDiscount.toLocaleString()}원</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-stone-950 pt-1 border-t border-stone-200">
                <span>최종 결제 금액</span>
                <span className="text-base text-amber-600">
                  {finalAmount.toLocaleString()}원
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-sm transition shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>결제 및 주문 접수 중...</span>
              ) : (
                <>
                  <span>{finalAmount.toLocaleString()}원 ⚡ 결제 및 주문하기</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
