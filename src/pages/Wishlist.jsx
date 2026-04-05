import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function Wishlist() {
  const { wishlist, loading, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  // Track loading per item for both "Move to Cart" and "Delete" actions
  const [processingId, setProcessingId] = useState(null);

  const handleMoveToCart = async (item) => {
    if (processingId) return;
    try {
      setProcessingId(item.productId);

      const formattedItem = {
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: 1,
      };

      await addToCart(formattedItem);
      await removeFromWishlist(item.productId);
    } catch (error) {
      console.error("Failed to move item to cart:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemove = async (id) => {
    if (processingId) return;
    try {
      setProcessingId(id);
      await removeFromWishlist(id);
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
    } finally {
      setProcessingId(null);
    }
  };

  // --- LOADING STATE (Skeleton Grid) ---
  if (loading) {
    return (
      <div className="wishlist-container anim-fade-in">
        <h2 className="section-title">My Favorites</h2>

        <div className="wishlist-grid">
          {Array(6).fill().map((_, i) => (
            <div key={i} className="wishlist-card">
              <div className="wishlist-image">
                <div className="image-skeleton shimmer" style={{ height: "250px" }}></div>
              </div>
              <div className="wishlist-details">
                <div className="text-skeleton title shimmer" style={{ width: "70%", margin: "0 auto 10px" }}></div>
                <div className="text-skeleton price shimmer" style={{ width: "40%", margin: "0 auto 15px" }}></div>
                <div className="text-skeleton button shimmer" style={{ height: "40px" }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- DATA RENDER ---
  return (
    <div className="wishlist-container anim-fade-in">
      <h2 className="section-title">My Favorites</h2>

      {!wishlist || wishlist.length === 0 ? (
        <div className="empty-cart">
          <Heart size={80} color="#ddd" strokeWidth={1} />
          <h2>Your wishlist is empty</h2>
          <p>Tap the heart on any hamper to save it for later!</p>
          <Link to="/" className="auth-btn" style={{ width: "200px", marginTop: "20px" }}>
            Explore Hampers
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.productId} className="wishlist-card">
              <div className="wishlist-image">
                <img src={item.image} alt={item.name} />

                <button
                  className="delete-icon"
                  onClick={() => handleRemove(item.productId)}
                  disabled={processingId === item.productId}
                  aria-label="Remove from wishlist"
                >
                  {processingId === item.productId ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>

              <div className="wishlist-details">
                <h4>{item.name}</h4>
                <p className="item-price">₹{item.price}</p>

                <button
                  className="move-to-cart-btn"
                  onClick={() => handleMoveToCart(item)}
                  disabled={processingId === item.productId}
                >
                  <span className="btn-content">
                    {processingId === item.productId ? (
                      <>
                        <span className="btn-loader small"></span>
                        <span>Moving...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} /> Move to Cart
                      </>
                    )}
                  </span>
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