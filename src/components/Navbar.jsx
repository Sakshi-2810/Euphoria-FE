import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Search, ShoppingCart, User, Heart, Shield } from "lucide-react";

function Navbar() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleAdminRedirect = () => {
    navigate("/admin"); // Admin panel route
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo">EUPHORIA</Link>

        {/* Search Bar */}
        <div className="search-container">
          <input type="text" placeholder="Search for gifts, cakes, hampers..." />
          <button className="search-btn"><Search size={18} /></button>
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
          {user?.role === "admin" && (
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