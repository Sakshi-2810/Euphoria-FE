import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

function ProductCard({ product }) {  
  // ✅ FIX 1: Destructure 'wishlist' (not 'items') and 'removeFromWishlist'
  const { addToWishlist, wishlist = [], removeFromWishlist } = useContext(WishlistContext);
  
  const navigate = useNavigate();

  const isInWishlist =
  Array.isArray(wishlist) &&
  wishlist.some(
    item => item.productId === product.productId || item.productId === product.productId
  );

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    console.log("Wishlist toggle for product:", product);
    // ✅ Logic: No local API calls. The Context functions handle the API internally.
    if (isInWishlist) {
      await removeFromWishlist(product.productId);
    } else {
      await addToWishlist({
        productId: product.productId,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };

  return (
    <div className="card product-card anim-fade-in" onClick={() => navigate(`/product/${product.productId}`)}>
      <div className="product-image-wrapper">
        <img
          src={product.image} 
          alt={product.name}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
        />
        <button 
          className={`wishlist-overlay ${isInWishlist ? 'active' : ''}`} 
          onClick={handleWishlistToggle}
          type="button"
        >
          <Heart 
            size={18} 
            fill={isInWishlist ? "#ff3366" : "none"} 
            color={isInWishlist ? "#ff3366" : "#666"} 
          />
        </button>
      </div>

    <div className="product-info">
  <h4 className="product-title">{product.name}</h4>

  <div className="price-row">
    <span className="price">₹{product.price}</span>
    {product.originalPrice && (
      <span className="old-price">₹{product.originalPrice}</span>
    )}
    {product.discount && (
      <span className="discount">{product.discount}% OFF</span>
    )}
  </div>

  <p className="desc">
    {product.description || "No description available"}
  </p>
</div>
    </div>
  );
}

export default ProductCard;