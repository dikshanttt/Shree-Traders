"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItemType {
  productVariantId: string;
  productId: string;
  name: string;
  nameNe?: string | null;
  slug: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  colorName?: string | null;
  sizeName?: string | null;
  quantity: number;
  maxStock: number;
}

interface CartContextType {
  items: CartItemType[];
  addItem: (item: CartItemType) => void;
  removeItem: (productVariantId: string) => void;
  updateQuantity: (productVariantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("shree_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("shree_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (item: CartItemType) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productVariantId === item.productVariantId);
      if (existing) {
        const newQty = Math.min(existing.quantity + item.quantity, item.maxStock);
        return prev.map((i) =>
          i.productVariantId === item.productVariantId ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productVariantId: string) => {
    setItems((prev) => prev.filter((i) => i.productVariantId !== productVariantId));
  };

  const updateQuantity = (productVariantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productVariantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.productVariantId === productVariantId) {
          const validQty = Math.min(quantity, i.maxStock);
          return { ...i, quantity: validQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => {
    const itemPrice = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
