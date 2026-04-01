import React, { createContext, useState, useEffect } from "react";
import { getCart, addToCart as apiAddToCart, updateCartItem, removeCartItem } from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const userStr = localStorage.getItem("user");
  const userId = userStr ? JSON.parse(userStr).id : null; 

  useEffect(() => {
    if (userId) {
      fetchRemoteCart();
    } else {
      const localCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      setCart(localCart);
      setLoading(false);
    }
  }, [userId]);

  const fetchRemoteCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.data?.items || []);
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  };

  // ADD TO CART
  const addToCart = async (product) => {
    if (user) {
      // Logged in: API Call
      try {
        const res = await apiAddToCart({ productId: product.id, qty: 1 });
        setCart(res.data.data.items);
      } catch (err) {
        console.error("API Add failed", err);
      }
    } else {
      // Guest: Local Storage
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        let newCart;
        if (existing) {
          newCart = prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          );
        } else {
          newCart = [...prev, { ...product, qty: 1 }];
        }
        localStorage.setItem("guest_cart", JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  // UPDATE QTY
  const updateQty = async (productId, newQty) => {
    if (newQty < 1) return;

    if (user) {
      try {
        const res = await updateCartItem(productId, newQty);
        setCart(res.data.data.items);
      } catch (err) {
        console.error("API Update failed", err);
      }
    } else {
      setCart((prev) => {
        const newCart = prev.map((item) =>
          item.id === productId ? { ...item, qty: newQty } : item
        );
        localStorage.setItem("guest_cart", JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  // REMOVE ITEM
  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const res = await removeCartItem(productId);
        setCart(res.data.data.items);
      } catch (err) {
        console.error("API Remove failed", err);
      }
    } else {
      setCart((prev) => {
        const newCart = prev.filter((item) => item.id !== productId);
        localStorage.setItem("guest_cart", JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};