import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react"; // Added Plus and Minus
import { Link } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart, updateQty } = useContext(CartContext);
// 🛡️ SAFETY CHECK: If cart is the object from your JSON instead of the array, 
  // we extract the items. If it's null, we use an empty array.
  const items = Array.isArray(cart) ? cart : (cart?.items || []);

  // Now use 'items' instead of 'cart' for reduce and map
  const total = items.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <ShoppingBag size={80} color="#ddd" strokeWidth={1} />
        <h2>Your cart is empty!</h2>
        <p>Add some beautiful hampers to get started.</p>
        <Link to="/" className="auth-btn">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-items-section">
        <h2 className="section-title">Shopping Cart ({cart.length} Items)</h2>
        
        {items.map((item) => (
          <div key={item.productId} className="cart-item-card">
            <div className="cart-item-image">
              <img src={item.image} alt={item.name} />
            </div>
            
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <p className="item-variant">Gift Wrap: Standard</p>
              <p className="item-price">₹{item.price * (item.qty || 1)}</p>
              
              <div className="cart-item-actions">
                {/* Quantity Controller */}
                <div className="qty-selector">
                  <button onClick={() => updateQty(item.productId, (item.qty || 1) - 1)}>
                    <Minus size={14} />
                  </button>
                  <span>{item.qty || 1}</span>
                  <button onClick={() => updateQty(item.productId, (item.qty || 1) + 1)}>
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  className="remove-btn" 
                  onClick={() => removeFromCart(item.productId)}
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary-section">
        <h4>Price Details</h4>
        <div className="summary-row">
          <span>Total MRP</span>
          <span>₹{total}</span>
        </div>
        <div className="summary-row">
          <span>Discount</span>
          <span className="discount-text">- ₹0</span>
        </div>
        <div className="summary-row">
          <span>Delivery Fee</span>
          <span className="free-text">FREE</span>
        </div>
        <hr />
        <div className="summary-row total-amount">
          <span>Total Amount</span>
          <span>₹{total}</span>
        </div>
        <button className="checkout-btn">Place Order</button>
      </div>
    </div>
  );
}

export default Cart;