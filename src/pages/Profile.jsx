import React, { useEffect, useState, useContext } from "react"; // Added useContext
import { useNavigate } from "react-router-dom";
import { Package, MapPin, LogOut, ChevronRight, Plus } from "lucide-react";
import * as api from "../services/api";
import { AuthContext } from "../context/AuthContext"; // Import your AuthContext

function Profile() {
  const navigate = useNavigate();
  
  // 1. Get user and logout from Context
  const { user, logout } = useContext(AuthContext); 
  
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  // 2. Simplified Access Control: Redirection is now handled by your App.jsx 
  // (the <Navigate to="/login" /> wrapper), but we still handle null checks.

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchAddresses();
    }
  }, [user]);
 const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this address?");
  if (!confirmDelete) return;

  try {
    await api.deleteAddress(id);

    // ✅ Instant UI update (no refetch needed)
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));

    alert("Address deleted successfully!");
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete address");
  }
};
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.getUserOrders();
      // Ensure we handle different backend response structures
      setOrders(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      // Using user.id or email from context
      const res = await api.getAddress();
      setAddresses(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // 3. Updated Logout to use Context
  const handleLogout = () => {
    logout(); // Clears storage AND updates global state instantly
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-grid">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="user-info">
            {/* Safe check for name */}
            <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="profile-menu">
            <div 
              className={`menu-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <Package size={20} /> <span>Orders</span> <ChevronRight size={16} />
            </div>
            <div 
              className={`menu-item ${activeTab === "addresses" ? "active" : ""}`}
              onClick={() => setActiveTab("addresses")}
            >
              <MapPin size={20} /> <span>Addresses</span> <ChevronRight size={16} />
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === "orders" && (
            <div className="tab-content">
              <div className="section-header">
                <h2 className="section-title">My Orders</h2>
              </div>
              
              {loadingOrders ? (
                <div className="loader-small"></div>
              ) : orders.length === 0 ? (
                <div className="order-placeholder">
                  <Package size={48} color="#ccc" strokeWidth={1} />
                  <p>You haven't placed any orders yet.</p>
                  <button className="auth-btn" onClick={() => navigate("/")}>Start Shopping</button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card" onClick={() => navigate(`/orders/${order.id}`)}>
                       <div className="order-info">
                        <Package size={24} className="order-icon" />
                        <div>
                          <p className="order-id">Order #{order.id}</p>
                          <p className="order-meta">{order.items?.length || 0} items • ₹{order.totalAmount}</p>
                          <span className={`status-badge ${order.status?.toLowerCase()}`}>{order.status}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="tab-content">
              <div className="section-header">
                <h2 className="section-title">My Addresses</h2>
                <button className="add-address-pill" onClick={() => navigate("/profile/add-address")}>
                  <Plus size={16} /> Add New
                </button>
              </div>

              {loadingAddresses ? (
                <div className="loader-small"></div>
              ) : addresses.length === 0 ? (
                <div className="order-placeholder">
                  <MapPin size={48} color="#ccc" strokeWidth={1} />
                  <p>No addresses saved yet.</p>
                </div>
              ) : (
                <div className="addresses-grid">
                  {addresses.map((addr, idx) => (
                <div key={idx} className="address-card">
      
                {/* EDIT */}
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/profile/edit-address/${addr.id}`, { state: addr })
                  }
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(addr.id)}
                >
                  Delete
                </button>

                <div className="address-header">
                  <strong>{addr.fullName}</strong>
                  
                </div>
                <span className={` ${addr.default ? "address-tag default-tag" : ""}`}>
                    {addr.default ? "Default" : ""}
                </span>

                <p className="address-text">{addr.addressLine}</p>
                <p className="address-text">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="address-phone">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;