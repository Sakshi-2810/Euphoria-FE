import { createContext, useState, useEffect, useContext } from "react";
import * as api from "../services/api";
import { CartContext } from "./CartContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchRemoteCart } = useContext(CartContext);
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false); 
  }, []);

  const login = async (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData); // This triggers the instant UI update!
      try {
    await fetchRemoteCart(); // ✅ correct way
    localStorage.removeItem("guest_cart"); // cleanup
  } catch (err) {
    console.error("Cart sync failed", err);
  }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};