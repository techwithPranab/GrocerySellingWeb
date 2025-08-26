import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import apiClient from '@/lib/api';
import { Cart, CartItem, Product } from '@/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getItemQuantity: (productId: string) => number;
  cartItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const cartItemsCount = useMemo(() => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart.items]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [isAuthenticated]);

  const refreshCart = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await apiClient.get('/cart');
      setCart(response.cart);
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(async (product: Product, quantity: number): Promise<void> => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.post('/cart/add', {
        productId: product._id,
        quantity,
        name: product.name,
        price: product.price,
        unit: product.unit,
      });
      setCart(response.cart);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const updateQuantity = useCallback(async (productId: string, quantity: number): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiClient.put(`/cart/item/${productId}`, { quantity });
      setCart(response.cart);
    } catch (error) {
      console.error('Failed to update cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (productId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiClient.delete(`/cart/item/${productId}`);
      setCart(response.cart);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCart = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await apiClient.delete('/cart/clear');
      setCart({ items: [], total: 0 });
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getItemQuantity = useCallback((productId: string): number => {
    const item = cart.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }, [cart.items]);

  const value: CartContextType = useMemo(() => ({
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    getItemQuantity,
    cartItemsCount,
  }), [cart, isLoading, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart, getItemQuantity, cartItemsCount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
