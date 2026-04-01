import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
// Import the specific methods you just defined
import { getWishlist, removeFromWishlist } from "../services/api"; 
import { CartContext } from "../context/CartContext";

function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await getWishlist();
      // Accessing data based on your Response DTO structure { message, data }
      setItems(res.data.data?.products || []); 
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      // Optimistic update: remove from local state immediately
      setItems(items.filter(item => item.productId !== productId));
    } catch (err) {
      alert("Could not remove item. Please try again.");
    }
  };

  const handleMoveToCart = (item) => {
    addToCart({ ...item, id: item.productId, qty: 1 });
    handleRemove(item.productId);
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="wishlist-container">
      <h2 className="section-title">My Favorites</h2>
      
      {items.length === 0 ? (
        <div className="empty-cart">
          <Heart size={80} color="#ddd" strokeWidth={1} />
          <h2>Your wishlist is empty</h2>
          <p>Tap the heart on any hamper to save it for later!</p>
          <Link to="/" className="auth-btn" style={{ width: '200px' }}>Explore Hampers</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => (
            <div key={item.productId} className="wishlist-card">
              <div className="wishlist-image">
                <img src={item.image} alt={item.name} />
                <button className="delete-icon" onClick={() => handleRemove(item.productId)}>
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="wishlist-details">
                <h4>{item.name}</h4>
                <p className="item-price">₹{item.price}</p>
                <button className="move-to-cart-btn" onClick={() => handleMoveToCart(item)}>
                  <ShoppingCart size={18} /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;