import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, MapPin, LogOut, ChevronRight } from "lucide-react";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' or 'addresses'

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  // Fetch orders
  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await api.get("/orders");
          setOrders(res.data.data || []);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [user]);

  // Fetch addresses
  useEffect(() => {
    if (user) {
      const fetchAddresses = async () => {
        setLoadingAddresses(true);
        try {
          const res = await api.get("/users/addresses", { params: { userId: user.email } });
          setAddresses(res.data.data || []);
        } catch (err) {
          console.error("Failed to fetch addresses:", err);
        } finally {
          setLoadingAddresses(false);
        }
      };
      fetchAddresses();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-grid">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="user-info">
            <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
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
            <>
              <h2 className="section-title">My Orders</h2>
              {loadingOrders ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="order-placeholder">
                  <Package size={48} color="#ccc" strokeWidth={1} />
                  <p>You haven't placed any orders yet.</p>
                  <button className="view-all" onClick={() => navigate("/")}>Start Shopping</button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card" onClick={() => navigate(`/orders/${order.id}`)}>
                      <div className="order-info">
                        <Package size={24} />
                        <div>
                          <p>Order #{order.id}</p>
                          <p>{order.items.length} items • ₹{order.totalAmount}</p>
                          <p>Status: {order.status}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "addresses" && (
            <>
              <h2 className="section-title">My Addresses</h2>
              {loadingAddresses ? (
                <p>Loading addresses...</p>
              ) : addresses.length === 0 ? (
                <div className="order-placeholder">
                  <MapPin size={48} color="#ccc" strokeWidth={1} />
                  <p>No addresses saved yet.</p>
                  <button className="view-all" onClick={() => navigate("/profile/add-address")}>Add Address</button>
                </div>
              ) : (
                <div className="addresses-list">
                  {addresses.map((addr, idx) => (
                    <div key={idx} className="address-card">
                      <p><strong>{addr.fullName}</strong> ({addr.phone})</p>
                      <p>{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;