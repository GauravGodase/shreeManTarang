import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as staticProducts } from '../data/products';
import { config } from '../config';
import type { Product, Size } from '../types';

const ADMIN_EMAIL    = config.admin.email;
const ADMIN_PASSWORD = config.admin.password;

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: Size;
  colorName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
}

interface AdminState {
  // ── Auth ──────────────────────────────────────────────
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // ── Products ──────────────────────────────────────────
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;

  // ── Orders ────────────────────────────────────────────
  orders: Order[];
  addOrder: (items: OrderItem[], subtotal: number, shipping: number) => string;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      // ── Auth ────────────────────────────────────────
      isAuthenticated: false,

      login: (email, password) => {
        if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      // ── Products ────────────────────────────────────
      products: staticProducts,

      addProduct: (product) =>
        set((s) => ({ products: [product, ...s.products] })),

      updateProduct: (id, updates) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      resetProducts: () => set({ products: staticProducts }),

      // ── Orders ──────────────────────────────────────
      orders: [],

      addOrder: (items, subtotal, shipping) => {
        const id = `ORD-${Date.now()}`;
        set((s) => ({
          orders: [
            {
              id,
              items,
              subtotal,
              shipping,
              total: subtotal + shipping,
              timestamp: new Date().toISOString(),
              status: 'pending',
            },
            ...s.orders,
          ],
        }));
        return id;
      },

      updateOrderStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),

      deleteOrder: (id) =>
        set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),
    }),
    {
      name: 'sm-admin-store',
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        products: s.products,
        orders: s.orders,
      }),
    }
  )
);
