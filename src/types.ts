export type CategoryId = 
  | 'all' 
  | 'best' 
  | 'coffee' 
  | 'decaf' 
  | 'frappe' 
  | 'tea_ade' 
  | 'dessert';

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
}

export interface MenuItem {
  id: string;
  name: string;
  englishName: string;
  categoryId: CategoryId;
  price: number;
  description: string;
  image: string;
  size: string; // e.g. "MEGA 24oz", "32oz", "Standard"
  calories: number; // kcal
  caffeine: number; // mg
  isHotAvailable: boolean;
  isIceAvailable: boolean;
  defaultTemp: 'ICE' | 'HOT';
  isBest?: boolean;
  isNew?: boolean;
  availableOptions: {
    shots?: boolean;
    sweetness?: boolean;
    milk?: boolean;
    toppings?: boolean;
    iceLevel?: boolean;
  };
}

export interface CustomOptions {
  temp: 'ICE' | 'HOT';
  iceLevel: '적게' | '보통' | '많이';
  shot: '기본' | '연하게(-1샷)' | '1샷 추가(+500원)' | '2샷 추가(+1,000원)' | '디카페인 변경(+1,000원)';
  sweetness: '기본' | '덜 달게' | '달게' | '바닐라시럽(+500원)' | '헤이즐넛시럽(+500원)' | '스테비아 저당(+600원)';
  milk: '기본(우유)' | '아몬드밀크(+500원)' | '오트(귀리)밀크(+500원)';
  toppings: string[]; // e.g. ["죠리퐁 추가(+500원)", "휘핑 추가(+500원)"]
  cupType: '매장컵' | '일회용컵' | '개인 텀블러(-300원 할인)';
}

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  options: CustomOptions;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'ACCEPTED' | 'MAKING' | 'READY' | 'COMPLETED';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "M-108"
  orderTime: string;
  storeName: string;
  takeoutType: '포장 (테이크아웃)' | '매장 이용';
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  status: OrderStatus;
  progressPercent: number;
  barcode: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  waitTime: string;
  isOpen: boolean;
  phone: string;
}
