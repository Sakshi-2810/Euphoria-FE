import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Added Navigate
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

function App() {
  // ✅ FIX 1: Define 'user'. Usually, we check localStorage or an AuthContext.
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Navbar />
      {/* Optional: Add a main-content wrapper to push Footer to bottom */}
      <main style={{ minHeight: '80vh' }}> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/wishlist" element={<Wishlist />}/>
          
          {/* ✅ Protected Routes */}
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/profile/add-address" 
            element={user ? <AddAddress /> : <Navigate to="/login" />} 
          />

          {/* ✅ Admin Route - Check for admin role */}
          <Route 
            path="/admin" 
            element={user?.role === "ADMIN" ? <AdminPanel /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;