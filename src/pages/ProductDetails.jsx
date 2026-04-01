import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, Heart, Truck, ShieldCheck, Star, PlayCircle } from "lucide-react";
import { getProductById, addToWishlist } from "../services/api"; // Reuse your service file!

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainMedia, setMainMedia] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getProductById(id);
        // FIX: Accessing the 'data' field inside your Response object
        const productData = res.data.data; 
        
        setProduct(productData);
        
        // FIX: Safe check for media array to prevent crash
        if (productData.media && productData.media.length > 0) {
          setMainMedia(productData.media[0]);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // FIX: Send specific fields or the whole object based on your Context needs
    addToCart({ ...product, qty });
    navigate("/cart");
  };

  const handleWishlist = async () => {
    try {
      // Reusing your Wishlist API
      await addToWishlist({ 
        productId: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image || product.media[0]?.url 
      });
      alert("Added to wishlist!");
    } catch (err) {
      alert("Please login to use the wishlist.");
      navigate("/login");
    }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return null;

  return (
    <div className="product-details-container">
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
                src={item.type === "image" ? item.url : "https://via.placeholder.com/100?text=Video"} 
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
        <nav className="breadcrumb">Home / Hampers / {product.name}</nav>
        
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
            <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
            <input type="number" value={qty} readOnly />
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>
        </div>

        <div className="action-buttons">
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <ShoppingCart size={20} /> ADD TO CART
          </button>
          <button className="wishlist-btn" onClick={handleWishlist}>
            <Heart size={20} /> WISHLIST
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