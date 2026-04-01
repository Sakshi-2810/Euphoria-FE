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
        setWishlist(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  // Add item to wishlist
  const addToWishlist = async (product) => {
    if (!isLoggedIn) {
      alert("Please login to save items to your wishlist!");
      return;
    }
    try {
      // Check if product already exists
      if (wishlist.find((item) => item.id === product.id)) return;

      await apiAddToWishlist(product);
      setWishlist([...wishlist, product]);
    } catch (error) {
      console.error("Add to wishlist failed:", error);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await apiRemoveFromWishlist(productId);
      setWishlist(wishlist.filter((item) => item.id !== productId));
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