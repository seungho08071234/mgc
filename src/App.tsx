/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  MenuItem,
  CategoryId,
  CustomOptions,
  CartItem,
  Order,
  OrderStatus,
  Store,
} from './types';
import { MENU_ITEMS, STORES } from './data/menuData';
import {
  setMuted,
  getMuted,
  playPopSound,
  playPickupBellSound,
  playClickSound,
} from './utils/sound';

import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { CategoryNav } from './components/CategoryNav';
import { MenuCard } from './components/MenuCard';
import { OptionModal } from './components/OptionModal';
import { CartDrawer } from './components/CartDrawer';
import { PickupModal } from './components/PickupModal';
import { StoreModal } from './components/StoreModal';
import { FloatingCartBar } from './components/FloatingCartBar';
import { Coffee, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Store state
  const [currentStore, setCurrentStore] = useState<Store>(() => {
    try {
      const saved = localStorage.getItem('mgc_selected_store');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return STORES[0];
  });

  // Sound mute state
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(() => getMuted());

  // Navigation & Filtering
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'best' | 'decaf' | 'mega_size'>('all');

  // Modals state
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  // Cart state with localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mgc_cart_items');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Orders state with localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('mgc_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('mgc_cart_items', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Save orders changes
  useEffect(() => {
    try {
      localStorage.setItem('mgc_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Save store changes
  useEffect(() => {
    try {
      localStorage.setItem('mgc_selected_store', JSON.stringify(currentStore));
    } catch {
      // ignore
    }
  }, [currentStore]);

  // Handle sound toggle
  const handleToggleSound = () => {
    const nextMuted = !isSoundMuted;
    setIsSoundMuted(nextMuted);
    setMuted(nextMuted);
  };

  // Automated order progression simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((ord) => {
          if (ord.status === 'ACCEPTED') {
            return { ...ord, status: 'MAKING', progressPercent: 50 };
          }
          if (ord.status === 'MAKING') {
            // Transition to ready: play chime!
            playPickupBellSound();
            return { ...ord, status: 'READY', progressPercent: 95 };
          }
          return ord;
        })
      );
    }, 15000); // Progress auto every 15s for lively experience

    return () => clearInterval(timer);
  }, []);

  // Quick Add Item with default options
  const handleQuickAdd = (item: MenuItem) => {
    const defaultOptions: CustomOptions = {
      temp: item.defaultTemp,
      iceLevel: '보통',
      shot: '기본',
      sweetness: '기본',
      milk: '기본(우유)',
      toppings: [],
      cupType: '일회용컵',
    };

    const cartId = `${item.id}-${defaultOptions.temp}-${Date.now()}`;
    const newItem: CartItem = {
      cartId,
      menuItem: item,
      options: defaultOptions,
      quantity: 1,
      unitPrice: item.price,
      totalPrice: item.price,
    };

    setCartItems((prev) => {
      // check if identical item and options exist
      const existingIdx = prev.findIndex(
        (it) =>
          it.menuItem.id === item.id &&
          it.options.temp === defaultOptions.temp &&
          it.options.shot === defaultOptions.shot &&
          it.options.sweetness === defaultOptions.sweetness &&
          it.options.cupType === defaultOptions.cupType
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        updated[existingIdx].totalPrice =
          updated[existingIdx].unitPrice * updated[existingIdx].quantity;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  // Open Option modal
  const handleOpenOptionModal = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsOptionModalOpen(true);
  };

  // Add customized item from Option Modal
  const handleAddToCart = (
    item: MenuItem,
    options: CustomOptions,
    quantity: number
  ) => {
    let extra = 0;
    if (options.shot === '1샷 추가(+500원)') extra += 500;
    if (options.shot === '2샷 추가(+1,000원)') extra += 1000;
    if (options.shot === '디카페인 변경(+1,000원)') extra += 1000;

    if (options.sweetness === '바닐라시럽(+500원)') extra += 500;
    if (options.sweetness === '헤이즐넛시럽(+500원)') extra += 500;
    if (options.sweetness === '스테비아 저당(+600원)') extra += 600;

    if (options.milk === '아몬드밀크(+500원)') extra += 500;
    if (options.milk === '오트(귀리)밀크(+500원)') extra += 500;

    options.toppings.forEach((top) => {
      if (top.includes('+500원')) extra += 500;
      if (top.includes('+800원')) extra += 800;
    });

    if (options.cupType === '개인 텀블러(-300원 할인)') extra -= 300;

    const unitPrice = Math.max(0, item.price + extra);
    const cartId = `${item.id}-${options.temp}-${options.shot}-${options.sweetness}-${options.cupType}-${Date.now()}`;

    const newCartItem: CartItem = {
      cartId,
      menuItem: item,
      options,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };

    setCartItems((prev) => [...prev, newCartItem]);
  };

  // Cart operations
  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.cartId === cartId) {
            const nextQty = it.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...it,
              quantity: nextQty,
              totalPrice: it.unitPrice * nextQty,
            };
          }
          return it;
        })
        .filter((it): it is CartItem => it !== null)
    );
  };

  const handleRemoveCartItem = (cartId: string) => {
    setCartItems((prev) => prev.filter((it) => it.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Place order
  const handlePlaceOrder = ({
    items,
    takeoutType,
    paymentMethod,
    totalAmount,
  }: {
    items: CartItem[];
    takeoutType: '포장 (테이크아웃)' | '매장 이용';
    paymentMethod: string;
    totalAmount: number;
  }) => {
    const randomCallNum = `M-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: randomCallNum,
      orderTime: `오늘 ${timeStr}`,
      storeName: currentStore.name,
      takeoutType,
      items: [...items],
      totalAmount,
      paymentMethod,
      status: 'ACCEPTED',
      progressPercent: 20,
      barcode: `MGC-${now.getFullYear()}${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsPickupModalOpen(true);
  };

  // Manual status update in PickupModal
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: nextStatus,
              progressPercent:
                nextStatus === 'MAKING'
                  ? 50
                  : nextStatus === 'READY'
                  ? 95
                  : 100,
            }
          : ord
      )
    );
  };

  // Re-order past order
  const handleReorder = (pastOrder: Order) => {
    playPopSound();
    setCartItems(pastOrder.items);
    setIsCartOpen(true);
  };

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesEn = item.englishName.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesName && !matchesEn && !matchesDesc) return false;
      }

      // Dietary / quick tag filter
      if (dietaryFilter === 'best' && !item.isBest) return false;
      if (dietaryFilter === 'decaf' && item.categoryId !== 'decaf') return false;
      if (dietaryFilter === 'mega_size' && !item.size.includes('32oz') && !item.size.includes('24oz')) return false;

      // Category tab check
      if (activeCategory === 'all') return true;
      if (activeCategory === 'best') return item.isBest;
      return item.categoryId === activeCategory;
    });
  }, [activeCategory, searchQuery, dietaryFilter]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: MENU_ITEMS.length,
      best: MENU_ITEMS.filter((m) => m.isBest).length,
      coffee: MENU_ITEMS.filter((m) => m.categoryId === 'coffee').length,
      decaf: MENU_ITEMS.filter((m) => m.categoryId === 'decaf').length,
      frappe: MENU_ITEMS.filter((m) => m.categoryId === 'frappe').length,
      tea_ade: MENU_ITEMS.filter((m) => m.categoryId === 'tea_ade').length,
      dessert: MENU_ITEMS.filter((m) => m.categoryId === 'dessert').length,
    };
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col font-sans pb-28 selection:bg-amber-300 selection:text-stone-900">
      {/* 1. Header with Store & Sound Controls */}
      <Header
        currentStore={currentStore}
        onOpenStoreModal={() => setIsStoreModalOpen(true)}
        isMuted={isSoundMuted}
        onToggleSound={handleToggleSound}
        activeOrders={orders}
        onOpenPickupModal={() => setIsPickupModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Seasonal Event Banner */}
      <Banner
        onSelectPromoTag={(tag) => {
          if (tag === '시즌 한정') {
            setActiveCategory('frappe');
          } else if (tag === '시그니처') {
            setActiveCategory('coffee');
          } else if (tag === '저당/라이트') {
            setActiveCategory('tea_ade');
          }
        }}
      />

      {/* 3. Sticky Category Bar */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        categoryCounts={categoryCounts}
      />

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-4 w-full flex-1">
        {/* Quick Filter Pill Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setDietaryFilter('all');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                dietaryFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              전체 메뉴
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setDietaryFilter('best');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${
                dietaryFilter === 'best'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-300" />
              <span>베스트 랭킹</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setDietaryFilter('decaf');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${
                dietaryFilter === 'decaf'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>디카페인 원두</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setDietaryFilter('mega_size');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                dietaryFilter === 'mega_size'
                  ? 'bg-stone-900 text-amber-300 shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              대용량 24~32oz
            </button>
          </div>

          <div className="text-xs text-stone-500 font-semibold">
            총 <span className="font-black text-stone-900">{filteredMenuItems.length}</span>개 메뉴
          </div>
        </div>

        {/* Menu Grid */}
        {filteredMenuItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center my-6">
            <Coffee className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h4 className="font-extrabold text-stone-800 text-base mb-1">
              검색 조건에 맞는 메뉴가 없습니다.
            </h4>
            <p className="text-xs text-stone-500 mb-4">
              다른 검색어나 카테고리를 선택해 보세요.
            </p>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setSearchQuery('');
                setActiveCategory('all');
                setDietaryFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-bold transition"
            >
              전체 메뉴 보기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredMenuItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onOpenOptionModal={handleOpenOptionModal}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}

        {/* Brand Feature Highlights */}
        <section aria-label="메가MGC커피 브랜드 가치" className="mt-12 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
          <h4 className="font-black text-stone-900 text-base sm:text-lg mb-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            메가MGC커피만의 3대 약속
          </h4>
          <p className="text-xs text-stone-500 mb-5">
            더 크고, 더 맛있고, 더 착한 가격으로 매일의 일상을 깨웁니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50 space-y-1">
              <div className="font-black text-amber-900 text-sm">
                01. 압도적 대용량 24oz
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                기본 24oz 벤티 사이즈부터 1L 메가리카노까지 부족함 없는 넉넉함
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50 space-y-1">
              <div className="font-black text-amber-900 text-sm">
                02. 프리미엄 2샷 기본
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                풍부한 크레마와 깊은 바디감의 아라비카 고급 블렌드 원두 사용
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50 space-y-1">
              <div className="font-black text-amber-900 text-sm">
                03. 착한 가격과 스마트 픽업
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                아메리카노 1,500원부터! 기다림 없이 바로 픽업하는 초간편 오더
              </p>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <footer className="mt-8 text-center text-xs text-stone-400 space-y-1">
          <p className="font-bold text-stone-500">
            (주)앤하우스 · 메가MGC커피 공식 스마트오더 데모 시스템
          </p>
          <p>
            대표이사: 김대영 · 사업자등록번호: 105-87-73898 · 고객센터: 1588-8298
          </p>
          <p className="text-[11px] text-stone-400">
            © MEGA MGC COFFEE. All Rights Reserved.
          </p>
        </footer>
      </main>

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar
        items={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Option Customization Modal */}
      <OptionModal
        item={selectedMenuItem}
        isOpen={isOptionModalOpen}
        onClose={() => {
          setIsOptionModalOpen(false);
          setSelectedMenuItem(null);
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        currentStore={currentStore}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Live Pickup Status Modal */}
      <PickupModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onSelectReorder={handleReorder}
      />

      {/* Store Location Modal */}
      <StoreModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        currentStore={currentStore}
        onSelectStore={setCurrentStore}
      />
    </div>
  );
}
