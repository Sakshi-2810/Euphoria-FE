import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Package, MapPin, LogOut, ChevronRight, Plus, Loader2 } from "lucide-react";
import * as api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); 
  
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [deletingAddressId, setDeletingAddressId] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchAddresses();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    setDeletingAddressId(id);
    try {
      await api.deleteAddress(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete address");
    } finally {
      setDeletingAddressId(null);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.getUserOrders();
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
      const res = await api.getAddress();
      setAddresses(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="profile-container anim-fade-in">
      <div className="profile-grid">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="user-info">
            <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>

          <nav className="profile-menu">
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
          </nav>
        </aside>

        {/* Main Content */}
        <main className="profile-main">
          {activeTab === "orders" && (
            <div className="tab-content">
              <div className="section-header">
                <h2 className="section-title">My Orders</h2>
              </div>
              
              {loadingOrders ? (
                <div className="orders-list">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="order-card skeleton-row shimmer"></div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="order-placeholder">
                  <Package size={48} color="#ccc" strokeWidth={1} />
                  <p>You haven't placed any orders yet.</p>
                  <button className="auth-btn" onClick={() => navigate("/")}>Start Shopping</button>
                </div>
              ) : (
               <div className="orders-list">
                {[...orders]
                  .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)) 
                  .map((order, index) => (
                    <div 
                      key={order.id} 
                      className="order-card" 
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <div className="order-info">
                        <Package size={24} className="order-icon" />
                        <div>
                          <p className="order-id">
                           Order #{index + 1}  
                          </p>
                          <p className="order-meta">
                            {order.items?.length || 0} items • ₹{order.totalAmount}
                          </p>
                          <span className={`status-badge ${order.status?.toLowerCase()}`}>
                            {order.status}
                          </span>
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
                <div className="addresses-grid">
                  {[1, 2].map(i => (
                    <div key={i} className="address-card-skeleton shimmer"></div>
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="order-placeholder">
                  <MapPin size={48} color="#ccc" strokeWidth={1} />
                  <p>No addresses saved yet.</p>
                </div>
              ) : (
                <div className="addresses-grid">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`address-card ${addr.default ? "default-address" : ""}`}>
                      <div className="address-actions">
                        <button
                          className="edit-btn"
                          disabled={deletingAddressId !== null}
                          onClick={() => navigate(`/profile/edit-address/${addr.id}`, { state: addr })}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          disabled={deletingAddressId !== null}
                          onClick={() => handleDelete(addr.id)}
                        >
                          {deletingAddressId === addr.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>

                      <div className="address-header">
                        <strong>{addr.fullName}</strong>
                        {addr.default && <span className="address-tag default-tag">Default</span>}
                      </div>

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
        </main>
      </div>
    </div>
  );
}

export default Profile;