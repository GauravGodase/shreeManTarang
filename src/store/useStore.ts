import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, Size, Color } from '../types';

interface StoreState {
  // Cart
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product, size: Size, color: Color) => void;
  removeFromCart: (productId: string, size: Size, colorName: string) => void;
  updateQuantity: (productId: string, size: Size, colorName: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isCartOpen: false,
      wishlist: [],

      addToCart: (product, size, color) => {
        const items = get().cartItems;
        const existing = items.find(
          (i) =>
            i.product.id === product.id &&
            i.size === size &&
            i.color.name === color.name
        );
        if (existing) {
          set({
            cartItems: items.map((i) =>
              i.product.id === product.id &&
              i.size === size &&
              i.color.name === color.name
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ cartItems: [...items, { product, size, color, quantity: 1 }] });
        }
        set({ isCartOpen: true });
      },

      removeFromCart: (productId, size, colorName) => {
        set({
          cartItems: get().cartItems.filter(
            (i) =>
              !(i.product.id === productId && i.size === size && i.color.name === colorName)
          ),
        });
      },

      updateQuantity: (productId, size, colorName, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(productId, size, colorName);
          return;
        }
        set({
          cartItems: get().cartItems.map((i) =>
            i.product.id === productId && i.size === size && i.color.name === colorName
              ? { ...i, quantity }
              : i
          ),
        });
      },

      clearCart: () => set({ cartItems: [] }),
      toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
      closeCart: () => set({ isCartOpen: false }),

      cartTotal: () =>
        get().cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      cartCount: () =>
        get().cartItems.reduce((sum, i) => sum + i.quantity, 0),

      toggleWishlist: (productId) => {
        const wl = get().wishlist;
        set({
          wishlist: wl.includes(productId)
            ? wl.filter((id) => id !== productId)
            : [...wl, productId],
        });
      },

      isWishlisted: (productId) => get().wishlist.includes(productId),
    }),
    {
      name: 'inkdrop-store',
      partialize: (s) => ({ cartItems: s.cartItems, wishlist: s.wishlist }),
    }
  )
);
