import { createContext, useState, useEffect } from "react";
import {
  getWishlist as apiGetWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from "../services/api";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
// Helper to check if user is logged in
  const isLoggedIn = !!localStorage.getItem("token");


  // Load wishlist from backend on mount
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    async function fetchWishlist() {
      try {
        const res = await apiGetWishlist();
        if(res.status === 403) {
          setLoading(false);
          return;
        }
        const products = res?.data?.data?.products;
        setWishlist(Array.isArray(products) ? products : []);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  const addToWishlist = async (product) => {
    const token = localStorage.getItem("token"); // Fresh check
    if (!token) {
      alert("Please login to save items!");
      return;
    }
    
    // Prevent duplicate API calls if already in local state
    if (wishlist.some((item) => item.productId === product.productId)) return;

    try {
      await apiAddToWishlist(product);
      setWishlist(prev => [...prev, product]); // Functional update is safer
    } catch (error) {
      console.error("Add failed:", error);
    }
  };
  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await apiRemoveFromWishlist(productId);
     setWishlist(prev =>
      Array.isArray(prev)
        ? prev.filter(item => item.productId !== productId)
        : []
    );
    } catch (error) {
      console.error("Remove from wishlist failed:", error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}