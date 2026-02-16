import { Order, Staff, Stats } from "./kds-types";

export const staff: Staff = {
  id: "1",
  name: "Marco",
  avatar: "👨‍🍳"
};

export const initialStats: Stats = {
  active: 8,
  avgWaitTime: "6:30",
  completedToday: 47,
  streak: 12
};

export const initialOrders: Order[] = [
  {
    id: "1234",
    orderNumber: "1234",
    orderType: "dine_in",
    tableNumber: "5",
    customerName: null,
    guestCount: 4,
    isPriority: true,
    claimedBy: "Marco",
    waitTime: 270, // seconds
    specialInstructions: "Extra crispy please, birthday celebration 🎂",
    items: [
      { 
        id: "1",
        name: "Margherita", 
        variant: "Large", 
        quantity: 2, 
        customizations: ["Extra Cheese", "Mushrooms"],
        isReady: true 
      },
      { 
        id: "2",
        name: "Pepperoni", 
        variant: "Medium", 
        quantity: 1, 
        customizations: ["Jalapeños"],
        isReady: true 
      },
      { 
        id: "3",
        name: "Tiramisu", 
        variant: null, 
        quantity: 1, 
        customizations: [],
        isReady: false 
      },
      { 
        id: "4",
        name: "Coca-Cola", 
        variant: null, 
        quantity: 2, 
        customizations: [],
        isReady: false 
      }
    ],
    createdAt: "2026-01-25T14:30:00Z"
  },
  {
    id: "1235",
    orderNumber: "1235",
    orderType: "pickup",
    tableNumber: null,
    customerName: "John",
    guestCount: null,
    isPriority: false,
    claimedBy: null,
    waitTime: 135,
    specialInstructions: null,
    items: [
      { id: "5", name: "Caesar Salad", variant: null, quantity: 1, customizations: [], isReady: false },
      { id: "6", name: "Garlic Bread", variant: null, quantity: 2, customizations: [], isReady: false }
    ],
    createdAt: "2026-01-25T14:32:15Z"
  },
  {
    id: "1236",
    orderNumber: "1236",
    orderType: "dine_in",
    tableNumber: "3",
    customerName: null,
    guestCount: 2,
    isPriority: false,
    claimedBy: "Sofia",
    waitTime: 500,
    specialInstructions: "Nut allergy - please be careful",
    items: [
      { id: "7", name: "Quattro Formaggi", variant: "Medium", quantity: 1, customizations: [], isReady: true },
      { id: "8", name: "Tiramisu", variant: null, quantity: 2, customizations: [], isReady: false }
    ],
    createdAt: "2026-01-25T14:25:00Z"
  },
  {
    id: "1237",
    orderNumber: "1237",
    orderType: "dine_in",
    tableNumber: "5",
    customerName: null,
    guestCount: 4,
    isPriority: false,
    claimedBy: null,
    waitTime: 180,
    specialInstructions: null,
    items: [
      { id: "9", name: "Hawaiian", variant: "Large", quantity: 1, customizations: [], isReady: true },
      { id: "10", name: "Greek Salad", variant: null, quantity: 2, customizations: [], isReady: false }
    ],
    createdAt: "2026-01-25T14:33:00Z"
  },
  {
    id: "1238",
    orderNumber: "1238",
    orderType: "pickup",
    tableNumber: null,
    customerName: "Sarah",
    guestCount: null,
    isPriority: false,
    claimedBy: null,
    waitTime: 90,
    specialInstructions: "No onions",
    items: [
      { id: "11", name: "Carbonara", variant: null, quantity: 1, customizations: ["No Onions"], isReady: false },
      { id: "12", name: "Garlic Bread", variant: null, quantity: 1, customizations: [], isReady: false }
    ],
    createdAt: "2026-01-25T14:34:30Z"
  },
  {
    id: "1239",
    orderNumber: "1239",
    orderType: "dine_in",
    tableNumber: "7",
    customerName: null,
    guestCount: 3,
    isPriority: true,
    claimedBy: null,
    waitTime: 45,
    specialInstructions: null,
    items: [
      { id: "13", name: "Margherita", variant: "Medium", quantity: 2, customizations: [], isReady: false },
      { id: "14", name: "Coca-Cola", variant: null, quantity: 3, customizations: [], isReady: false }
    ],
    createdAt: "2026-01-25T14:35:15Z"
  },
  {
    id: "1240",
    orderNumber: "1240",
    orderType: "pickup",
    tableNumber: null,
    customerName: "Mike",
    guestCount: null,
    isPriority: false,
    claimedBy: "Marco",
    waitTime: 120,
    specialInstructions: null,
    items: [
      { id: "15", name: "Pepperoni", variant: "Large", quantity: 1, customizations: [], isReady: true },
      { id: "16", name: "Caesar Salad", variant: null, quantity: 1, customizations: [], isReady: true }
    ],
    createdAt: "2026-01-25T14:36:00Z"
  },
  {
    id: "1241",
    orderNumber: "1241",
    orderType: "dine_in",
    tableNumber: "2",
    customerName: null,
    guestCount: 2,
    isPriority: false,
    claimedBy: null,
    waitTime: 60,
    specialInstructions: null,
    items: [
      { id: "17", name: "Quattro Formaggi", variant: "Small", quantity: 1, customizations: [], isReady: false }
    ],
    createdAt: "2026-01-25T14:37:00Z"
  }
];
