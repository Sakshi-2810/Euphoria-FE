import React, { createContext, useState, useEffect } from "react";
import { getCart, postToCart as apiAddToCart, updateCartItem, removeCartItem } from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const userStr = localStorage.getItem("user");
  const userId = userStr ? JSON.parse(userStr).email : null; 

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
      if(res.status === 403) {
        setLoading(false);
        return;
      }
      setCart(res.data.data?.items || []);
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  };

  // ADD TO CART
  const addToCart = async (product) => {
  if (userId) { // ✅ FIXED
    try {
      const res = await apiAddToCart({
        productId: product.productId,
        qty: product.qty || 1,
        price: product.price,
        name: product.name,
        image: product.image || product.media?.[0]?.url
      });
      setCart(res.data.data.items);
    } catch (err) {
      console.error("API Add failed", err);
    }
  } else {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.productId);
      let newCart;

      if (existing) {
        newCart = prev.map((item) =>
          item.productId === product.productId ? { ...item, qty: item.qty + 1 } : item
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

    if (userId) {
      try {
        const res = await updateCartItem(productId, newQty);
        setCart(res.data.data.items);
      } catch (err) {
        console.error("API Update failed", err);
      }
    } else {
      setCart((prev) => {
        const newCart = prev.map((item) =>
          item.productId === productId ? { ...item, qty: newQty } : item
        );
        localStorage.setItem("guest_cart", JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  // REMOVE ITEM
  const removeFromCart = async (productId) => {
    if (userId) {
      try {
        const res = await removeCartItem(productId);
        setCart(res.data.data.items);
      } catch (err) {
        console.error("API Remove failed", err);
      }
    } else {
      setCart((prev) => {
        const newCart = prev.filter((item) => item.productId !== productId);
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