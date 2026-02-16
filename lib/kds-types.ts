export type OrderType = "dine_in" | "pickup" | "delivery";

export interface OrderItem {
  id: string;
  name: string;
  variant: string | null;
  quantity: number;
  customizations: string[];
  isReady: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  tableNumber: string | null;
  customerName: string | null;
  guestCount: number | null;
  isPriority: boolean;
  claimedBy: string | null;
  waitTime: number; // seconds
  specialInstructions: string | null;
  items: OrderItem[];
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  avatar: string;
}

export interface Stats {
  active: number;
  avgWaitTime: string;
  completedToday: number;
  streak: number;
}

export type FilterType = "all" | "dine_in" | "pickup" | "priority";

export interface ToastState {
  isVisible: boolean;
  orderNumber: string | null;
}
