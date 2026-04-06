import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Package, MapPin, ArrowLeft, Truck, CheckCircle, XCircle, Loader2 
} from "lucide-react";
import * as api from "../services/api";
import { CartContext } from "../context/CartContext";


function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.getOrderById(id);
      setOrder(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;

    setCancelling(true);
    try {
      await api.cancelOrder(id);
      fetchOrder();
    } catch (err) {
      console.error(err);
      alert("Cancel failed");
    } finally {
      setCancelling(false);
    }
  };

 const handleReorder = async () => {
  try {
    for (const item of order.items) {
      await addToCart({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: item.qty   // ✅ IMPORTANT
      });
    }

    navigate("/cart");
  } catch (err) {
    console.error(err);
    alert("Reorder failed");
  }
};
  const getStatusStep = () => {
    switch (order.status) {
      case "PLACED": return 1;
      case "SHIPPED": return 2;
      case "DELIVERED": return 3;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="orders-list">
        {[1,2].map(i => (
          <div key={i} className="order-card skeleton-row shimmer"></div>
        ))}
      </div>
    );
  }

  if (!order) return <div>Order not found</div>;

  const step = getStatusStep();

  return (
    <div className="order-details-container anim-fade-in">

      {/* HEADER */}
      <div className="order-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>

        <div>
          {/* <h2>Order #{order.id}</h2> */}
          <span className={`status-badge ${order.status?.toLowerCase()}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* TRACKING TIMELINE */}
      <div className="tracking-container">
        <div className={`track-step ${step >= 1 ? "active" : ""}`}>
          <Package size={18} />
          <p>Placed</p>
        </div>
        <div className={`track-step ${step >= 2 ? "active" : ""}`}>
          <Truck size={18} />
          <p>Shipped</p>
        </div>
        <div className={`track-step ${step >= 3 ? "active" : ""}`}>
          <CheckCircle size={18} />
          <p>Delivered</p>
        </div>
      </div>

      <div className="order-details-grid">

        {/* ITEMS */}
        <div className="order-items-section">
          <h3 className="section-title">
            <Package size={18} /> Items
          </h3>

          {order.items.map(item => (
            <div key={item.productId} className="order-item-card">

              <img src={item.image} alt={item.name} />

              <div className="item-info">
                <h4>{item.name}</h4>
                <p>Qty: {item.qty}</p>
                <p>Price: ₹{item.price}</p>
                <p className="total">Total: ₹{item.price * item.qty}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="order-summary-section">

          {/* PRICE */}
          <div className="summary-card">
            <h4>Price Details</h4>

            <div className="summary-row">
              <span>Total Amount</span>
              <span>₹{order.totalAmount}</span>
            </div>

            {/* ACTIONS */}
            <div className="order-actions">
              {order.status === "PENDING" && (
                <button 
                  className="cancel-btn"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? <Loader2 className="spin" size={16}/> : <XCircle size={16}/>}
                  Cancel
                </button>
              )}

              <button className="reorder-btn" onClick={handleReorder}>
                Reorder
              </button>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="summary-card">
            <h4><MapPin size={16}/> Delivery Address</h4>

            <p><strong>{order.shippingAddress.fullName}</strong></p>
            <p>{order.shippingAddress.addressLine}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>

          {/* INFO */}
          <div className="summary-card">
            <h4>Order Info</h4>
            <p>Payment: {order.paymentMethod}</p>
            <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderDetails;