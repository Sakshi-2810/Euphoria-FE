import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import { Trash2, ShoppingBag, Plus, Minus, MapPin, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../services/api"; // Import your API services

function Cart() {
  const { cart, removeFromCart, updateQty } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [processingId, setProcessingId] = useState(null);
  
  // --- Address Selection Logic ---
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressList, setShowAddressList] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await api.getAddress();
      const addrData = res.data.data || res.data || [];
      setAddresses(addrData);
      // Set default address as selected initially
      const defaultAddr = addrData.find(a => a.default) || addrData[0];
      setSelectedAddress(defaultAddr);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddressSelect = (addr) => {
    setSelectedAddress(addr);
    setShowAddressList(false);
  };
  // -------------------------------

  const items = Array.isArray(cart) ? cart : (cart?.items || []);
  const total = items.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  const handleRemove = async (id) => {
    setProcessingId(id);
    try {
      await removeFromCart(id);
    } finally {
      setProcessingId(null);
    }
  };

  const handleQtyChange = async (id, newQty) => {
    if (newQty < 1) return;
    setProcessingId(id);
    try {
      await updateQty(id, newQty);
    } finally {
      setProcessingId(null);
    }
  };

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
  const handlePlaceOrder = async () => {
  if (!selectedAddress) {
    alert("Please select address");
    return;
  }

  try {
    const orderData = {
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty || 1,
        image: item.image
      })),
      totalAmount: total,
      shippingAddress: selectedAddress,
      paymentMethod: "COD" // you can change later (UPI, Razorpay etc.)
    };

    const res = await api.placeOrder(orderData);

    console.log("Order placed:", res.data);
    // ✅ Redirect
    navigate("/orders"); // or success page

  } catch (err) {
    console.error("Order failed:", err);
    alert("Failed to place order");
  }
};

  return (
    <div className="cart-page-container">
      {/* 1. Address Selection Header */}
      <div className="cart-address-header">
        <div className="delivery-info" onClick={() => setShowAddressList(!showAddressList)}>
          <MapPin size={20} className="pin-icon" />
          <div className="current-address">
            {user ? (
              selectedAddress ? (
                <>
                  <p className="deliver-to">Deliver to: <strong>{selectedAddress.fullName}, {selectedAddress.pincode}</strong></p>
                  <p className="address-snippet">{selectedAddress.addressLine}, {selectedAddress.city}</p>
                </>
              ) : (
                <p>Select a delivery address</p>
              )
            ) : (
              <p>Login to select delivery address</p>
            )}
          </div>
          <ChevronDown size={18} className={`chevron ${showAddressList ? 'rotate' : ''}`} />
        </div>

        {showAddressList && user && (
          <div className="address-dropdown-portal">
            <div className="dropdown-header">
              <span>Select Address</span>
              <button onClick={() => navigate("/profile/add-address")}>+ Add New</button>
            </div>
            <div className="address-options">
              {addresses.map((addr) => (
                <div 
                  key={addr.id} 
                  className={`address-option-card ${selectedAddress?.id === addr.id ? 'active' : ''}`}
                  onClick={() => handleAddressSelect(addr)}
                >
                  <strong>{addr.fullName}</strong>
                  <p>{addr.addressLine}, {addr.city} - {addr.pincode}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="cart-layout-grid">
        <div className="cart-items-section">
          <h2 className="section-title">Shopping Cart ({items.length} Items)</h2>
          
          {items.map((item) => (
            <div key={item.productId} className={`cart-item-card ${processingId === item.productId ? 'item-processing' : ''}`}>
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p className="item-variant">Gift Wrap: Standard</p>
                <p className="item-price">₹{item.price * (item.qty || 1)}</p>
                
                <div className="cart-item-actions">
                  <div className="qty-selector">
                    <button 
                      onClick={() => handleQtyChange(item.productId, (item.qty || 1) - 1)}
                      disabled={processingId === item.productId}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-display">
                      {processingId === item.productId ? <span className="btn-loader small dark"></span> : (item.qty || 1)}
                    </span>
                    <button 
                      onClick={() => handleQtyChange(item.productId, (item.qty || 1) + 1)}
                      disabled={processingId === item.productId}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button className="remove-btn" onClick={() => handleRemove(item.productId)} disabled={processingId === item.productId}>
                    {processingId === item.productId ? <span className="btn-loader small red"></span> : <><Trash2 size={16} /> Remove</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary-section">
          <h4>Price Details</h4>
          <div className="summary-row"><span>Total MRP</span><span>₹{total}</span></div>
          <div className="summary-row"><span>Discount</span><span className="discount-text">- ₹0</span></div>
          <div className="summary-row"><span>Delivery Fee</span><span className="free-text">FREE</span></div>
          <hr />
          <div className="summary-row total-amount"><span>Total Amount</span><span>₹{total}</span></div>
          <button 
            className="checkout-btn" 
            disabled={!selectedAddress}
            onClick={handlePlaceOrder}
          >
            {selectedAddress ? "Place Order" : "Select Address to Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;