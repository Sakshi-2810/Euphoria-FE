import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { 
  ShoppingCart, 
  Heart, 
  Truck, 
  ShieldCheck, 
  Star, 
  PlayCircle,
  Loader2 
} from "lucide-react";
import { getProductById } from "../services/api";

function ProductDetails() {
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { productId } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainMedia, setMainMedia] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState("");

  const isInWishlist = wishlist?.some(item => item.productId === productId);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getProductById(productId);
        const productData = res.data.data; 
        
        setProduct(productData);
        
        if (productData.media && productData.media.length > 0) {
          setMainMedia(productData.media[0]);
        } else if (productData.image) {
          setMainMedia({ url: productData.image, type: "image" });
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleWishlist = async () => {
    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist({ 
          productId: product.productId, 
          name: product.name, 
          price: product.price, 
          image: product.image || product.media[0]?.url 
        });
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setCartLoading(true);
    try {
      await addToCart({ ...product, qty });
      navigate("/cart");
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="product-details-container anim-fade-in">
        <div className="product-gallery">
          <div className="thumbnails-list">
            {Array(4).fill().map((_, i) => (
              <div key={i} className="thumb-skeleton shimmer"></div>
            ))}
          </div>
          <div className="main-media-display">
            <div className="main-media-skeleton shimmer"></div>
          </div>
        </div>

        <div className="product-info-section">
          <div className="text-skeleton title shimmer"></div>
          <div className="text-skeleton small shimmer" style={{ width: '40%' }}></div>
          <div className="text-skeleton price shimmer" style={{ width: '30%' }}></div>
          <div className="text-skeleton desc shimmer"></div>
          <div className="text-skeleton desc shimmer" style={{ width: '90%' }}></div>
          <div className="text-skeleton button shimmer" style={{ marginTop: '20px' }}></div>
        </div>
      </div>
    );
  }

  if (error) return <div className="error-message">{error}</div>;
  if (!product) return null;

  return (
    <div className="product-details-container anim-fade-in">
      {/* Left Side: Image Gallery */}
      <div className="product-gallery">
        <div className="thumbnails-list">
          {product.media?.map((item, index) => (
            <div 
              key={index} 
              className={`thumb-item ${mainMedia?.url === item.url ? 'active' : ''}`}
              onMouseEnter={() => setMainMedia(item)}
            >
              {item.type === "video" && <PlayCircle className="video-icon-small" size={16} />}
              <img 
                src={item.type === "image" ? item.url : ""} 
                alt={`Thumbnail ${index}`} 
              />
            </div>
          ))}
        </div>

        <div className="main-media-display">
          {mainMedia?.type === "video" ? (
            <video src={mainMedia.url} controls autoPlay muted loop className="main-video" />
          ) : (
            <img src={mainMedia?.url || product.image} alt={product.name} className="zoom-effect" />
          )}
        </div>
      </div>

      {/* Right Side: Product Info */}
      <div className="product-info-section">
    
        
        <h1 className="product-title">{product.name}</h1>
        
        <div className="rating-badge">
          <Star size={16} fill="#ff3366" color="#ff3366" />
          <span>{product.rating || 4.5} | {product.reviews || 0} Reviews</span>
        </div>

        <div className="price-container">
          <span className="current-price">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="original-price">₹{product.originalPrice}</span>
              <span className="discount-tag">
                ({Math.round((1 - product.price / product.originalPrice) * 100)}% OFF)
              </span>
            </>
          )}
        </div>

        <p className="product-description">{product.description}</p>

        <div className="quantity-selector">
          <span>Quantity:</span>
          <div className="qty-controls">
            <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={cartLoading}>-</button>
            <input type="number" value={qty} readOnly />
            <button onClick={() => setQty(qty + 1)} disabled={cartLoading}>+</button>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="add-to-cart-btn" 
            onClick={handleAddToCart}
            disabled={cartLoading}
          >
            {cartLoading ? (
               <span className="btn-content">
                <Loader2 className="animate-spin" size={20} /> ADDING...
               </span>
            ) : (
              <>
                <ShoppingCart size={20} /> ADD TO CART
              </>
            )}
          </button>

          <button 
            className={`wishlist-btn ${isInWishlist ? 'active' : ''}`} 
            onClick={handleWishlist}
            disabled={wishlistLoading}
          >
            {wishlistLoading ? (
              <span className="btn-loader small red"></span>
            ) : (
              <>
                <Heart size={20} fill={isInWishlist ? "#ff3366" : "none"} color={isInWishlist ? "#ff3366" : "currentColor"} />
                {isInWishlist ? "REMOVE" : "WISHLIST"}
              </>
            )}
          </button>
        </div>

        <div className="delivery-features">
          <div className="feature">
            <Truck size={20} />
            <p>Free Delivery on orders above ₹999</p>
          </div>
          <div className="feature">
            <ShieldCheck size={20} />
            <p>100% Quality Assurance</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;