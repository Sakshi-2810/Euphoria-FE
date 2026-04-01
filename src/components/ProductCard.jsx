import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const [addingCart, setAddingCart] = useState(false);
  const [addingWishlist, setAddingWishlist] = useState(false);

  const handleAddToCart = async () => {
    setAddingCart(true);
    try {
      await addToCart(product);
    } finally {
      setAddingCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    setAddingWishlist(true);
    try {
      await addToWishlist(product);
    } finally {
      setAddingWishlist(false);
    }
  };

  return (
    <div className="card">
      <img
        src={product.image}
        alt={product.name}
        onClick={() => navigate(`/product/${product.id}`)}
        style={{ cursor: "pointer" }}
      />
      <h4>{product.name}</h4>
      <p>₹{product.price}</p>

      <button onClick={handleAddToCart} disabled={addingCart}>
        {addingCart ? "Adding..." : "Add to Cart"}
      </button>
      <button onClick={handleAddToWishlist} disabled={addingWishlist}>
        {addingWishlist ? "Adding..." : "❤️"}
      </button>
    </div>
  );
}

export default ProductCard;