import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { X, CheckCircle2, Clock, Coffee, Bell, ChevronRight, RotateCcw } from 'lucide-react';
import { playClickSound, playPickupBellSound } from '../utils/sound';
import { BRAND_ASSETS } from '../data/images';

interface PickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onSelectReorder: (order: Order) => void;
}

export const PickupModal: React.FC<PickupModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  onSelectReorder,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const activeOrders = orders.filter((o) => o.status !== 'COMPLETED');
  const pastOrders = orders.filter((o) => o.status === 'COMPLETED');

  // Select the latest active order or latest past order
  const latestOrder = activeOrders[0] || orders[0] || null;

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return 1;
      case 'MAKING':
        return 2;
      case 'READY':
        return 3;
      case 'COMPLETED':
        return 4;
      default:
        return 1;
    }
  };

  const handleAdvanceStatus = (order: Order) => {
    playClickSound();
    let nextStatus: OrderStatus = 'MAKING';
    if (order.status === 'ACCEPTED') {
      nextStatus = 'MAKING';
    } else if (order.status === 'MAKING') {
      nextStatus = 'READY';
      // Play pickup alert chime when ready!
      playPickupBellSound();
    } else if (order.status === 'READY') {
      nextStatus = 'COMPLETED';
    }
    onUpdateOrderStatus(order.id, nextStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <img
              src={BRAND_ASSETS.logoEmblem}
              alt="메가MGC커피 로고"
              className="w-8 h-8 object-contain drop-shadow-2xs"
            />
            <div>
              <h3 className="font-extrabold text-stone-900 text-base">
                스마트오더 픽업 현황
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                실시간 음료 제조 알림 및 전자 영수증
              </p>
            </div>
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

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('current');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'current'
                ? 'bg-white text-stone-950 shadow-xs font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>진행 중 주문 ({activeOrders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('history');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white text-stone-950 shadow-xs font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>지난 주문 내역 ({pastOrders.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'current' ? (
            activeOrders.length === 0 ? (
              <div className="py-12 text-center text-stone-400">
                <Coffee className="w-12 h-12 mx-auto mb-3 stroke-1 text-stone-300" />
                <p className="font-bold text-stone-700 text-sm mb-1">
                  현재 진행 중인 주문이 없습니다.
                </p>
                <p className="text-xs text-stone-400">
                  메뉴를 주문하시면 실시간 제조 상태를 안내해 드립니다!
                </p>
              </div>
            ) : (
              activeOrders.map((order) => {
                const step = getStatusStepIndex(order.status);
                const isReady = order.status === 'READY';

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${
                      isReady
                        ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-400/40'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    {/* Store & Time */}
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                      <span className="font-bold text-stone-800">
                        {order.storeName}
                      </span>
                      <span>{order.orderTime}</span>
                    </div>

                    {/* Calling Number Banner */}
                    <div className="bg-stone-900 text-white rounded-2xl p-4 text-center my-3 relative overflow-hidden">
                      <div className="absolute top-2 left-3 text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                        PICKUP NUMBER
                      </div>
                      <div className="text-3xl sm:text-4xl font-black tracking-widest text-amber-400 pt-2 pb-1">
                        {order.orderNumber}
                      </div>
                      <div className="text-xs font-medium text-stone-300">
                        {order.takeoutType}
                      </div>
                    </div>

                    {/* Status Step Indicators */}
                    <div className="my-4">
                      <div className="flex items-center justify-between relative">
                        {/* Connecting line */}
                        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-stone-200 -z-0" />
                        <div
                          className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-amber-400 transition-all duration-500 -z-0"
                          style={{
                            width: `${((step - 1) / 2) * 80}%`,
                          }}
                        />

                        {/* Step 1: Accepted */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition ${
                              step >= 1
                                ? 'bg-amber-400 text-stone-950 ring-4 ring-amber-100'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            1
                          </div>
                          <span className="text-[11px] font-bold text-stone-700 mt-1">
                            접수완료
                          </span>
                        </div>

                        {/* Step 2: Making */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition ${
                              step >= 2
                                ? 'bg-amber-400 text-stone-950 ring-4 ring-amber-100 animate-pulse'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            2
                          </div>
                          <span className="text-[11px] font-bold text-stone-700 mt-1">
                            제조중
                          </span>
                        </div>

                        {/* Step 3: Ready */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition ${
                              step >= 3
                                ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 animate-bounce'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            3
                          </div>
                          <span className="text-[11px] font-bold text-stone-700 mt-1">
                            픽업준비
                          </span>
                        </div>
                      </div>

                      {/* Status Text Box */}
                      <div
                        className={`mt-3 p-3 rounded-xl text-center text-xs font-bold ${
                          isReady
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {order.status === 'ACCEPTED' &&
                          '주문이 매장 포스에 접수되었습니다. 곧 제조를 시작합니다.'}
                        {order.status === 'MAKING' &&
                          '바리스타가 맛있는 음료를 정성껏 제조 중입니다! ☕'}
                        {order.status === 'READY' &&
                          '🎉 음료가 준비되었습니다! 픽업대에서 픽업 번호를 확인해 주세요.'}
                      </div>
                    </div>

                    {/* Barcode Visualization */}
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center my-3">
                      <div className="text-[10px] font-bold text-stone-400 mb-1">
                        매장 픽업 확인용 바코드
                      </div>
                      {/* Stylized Barcode SVG */}
                      <div className="h-10 flex items-center justify-center gap-1 mx-auto max-w-[240px]">
                        {[
                          3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3,
                          8, 4, 6, 2, 6, 4,
                        ].map((w, idx) => (
                          <div
                            key={idx}
                            className="h-full bg-stone-900 rounded-xs"
                            style={{ width: `${w * 1.4}px` }}
                          />
                        ))}
                      </div>
                      <div className="text-[11px] font-mono tracking-widest text-stone-600 mt-1">
                        {order.barcode}
                      </div>
                    </div>

                    {/* Order Items summary */}
                    <div className="space-y-1.5 border-t border-stone-200 pt-3 text-xs">
                      <div className="font-bold text-stone-800">주문 내역:</div>
                      {order.items.map((it) => (
                        <div
                          key={it.cartId}
                          className="flex justify-between text-stone-600"
                        >
                          <span>
                            {it.menuItem.name} ({it.options.temp}) x {it.quantity}
                          </span>
                          <span className="font-bold text-stone-900">
                            {it.totalPrice.toLocaleString()}원
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between font-black text-stone-950 pt-2 border-t border-stone-100">
                        <span>결제 금액 ({order.paymentMethod})</span>
                        <span className="text-amber-600">
                          {order.totalAmount.toLocaleString()}원
                        </span>
                      </div>
                    </div>

                    {/* Simulation Controls for testing interactive flow */}
                    <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(order)}
                        className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>
                          {order.status === 'ACCEPTED' && '상태 넘기기 (제조 시작)'}
                          {order.status === 'MAKING' && '상태 넘기기 (제조 완료 알림 🔔)'}
                          {order.status === 'READY' && '픽업 완료 처리'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            /* Past Orders Tab */
            pastOrders.length === 0 ? (
              <div className="py-12 text-center text-stone-400">
                <p className="font-bold text-stone-700 text-sm mb-1">
                  지난 주문 내역이 없습니다.
                </p>
              </div>
            ) : (
              pastOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-stone-200 p-4 bg-stone-50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="font-bold text-stone-800">
                      {order.orderNumber} · {order.storeName}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 픽업 완료
                    </span>
                  </div>
                  <div className="text-stone-700 font-medium">
                    {order.items.map((it) => it.menuItem.name).join(', ')}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-black text-stone-900">
                      {order.totalAmount.toLocaleString()}원
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onSelectReorder(order);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs transition flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>재주문</span>
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
