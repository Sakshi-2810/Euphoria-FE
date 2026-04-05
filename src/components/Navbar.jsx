import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react"; 
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { Search, ShoppingCart, User, Heart, Shield } from "lucide-react";
import { useState } from "react";
import logo from "../logo/logo.jpg";

function Navbar() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
const [searchTerm, setSearchTerm] = useState("");

const handleSearch = () => {
  if (!searchTerm.trim()) return;
  navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
};
  const handleAdminRedirect = () => {
    navigate("/admin"); // Admin panel route
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={logo} alt="Euphoria Logo" className="logo-img" />
        </Link>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for gifts, cakes, hampers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            <Search size={18} />
          </button>
        </div>

        {/* Action Links */}
        <div className="nav-actions">
          <Link to="/profile" className="nav-item">
            <User size={20} />
            <span>Profile</span>
          </Link>

          <Link to="/wishlist" className="nav-item">
            <Heart size={20} />
            <span>Wishlist</span>
          </Link>

          <Link to="/cart" className="nav-item cart-icon">
            <ShoppingCart size={20} />
            <span className="cart-count">{cart.length}</span>
            <span>Cart</span>
          </Link>

          {/* Admin Button – Visible only to admins */}
          {user?.role === "ADMIN" && (
            <button
              className="admin-btn"
              onClick={handleAdminRedirect}
              title="Go to Admin Panel"
            >
              <Shield size={18} /> Admin
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;