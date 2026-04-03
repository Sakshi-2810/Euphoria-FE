import React, { useContext } from "react"; // Added useContext
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Import your Context

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import CategoryPage from "./pages/CategoryPage";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";  
import Wishlist from "./pages/Wishlist";
import AddAddress from "./pages/AddAddresses"; 
import Products from "./pages/Products";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  // ✅ FIX: Use user from Context, not localStorage directly.
  // This ensures the UI updates the moment login() is called in Login.jsx.
  const { user, loading } = useContext(AuthContext);

  // Optional: Prevent flickering while checking if a user is logged in on refresh
  if (loading) return <div className="loader"></div>;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main style={{ minHeight: '80vh' }}> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/wishlist" element={<Wishlist />}/>
          <Route path="/profile/edit-address/:id" element={<AddAddress />} />
          
          {/* ✅ Protected Routes - Now reactive to Context state */}
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/profile/add-address" 
            element={user ? <AddAddress /> : <Navigate to="/login" />} 
          />

          {/* ✅ Admin Route - Works instantly after admin login */}
          <Route
            path="/admin"
            element={
              loading ? (
                <div className="loader"></div>
              ) : user?.role === "ADMIN" ? (
                <AdminPanel />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Catch-all for 404s */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;