import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, User, Home, ArrowLeft } from "lucide-react";
import api from "../services/api";

function AddAddress() {
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress({ ...address, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assuming you'll add this endpoint to your Spring Boot Backend
      await api.post("/auth/address", address); 
      alert("Address saved successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Failed to save address", err);
      alert("Error saving address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container"> {/* Reusing admin styles for consistency */}
      <div className="admin-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        
        <div className="admin-header">
          <MapPin size={28} color="#ff3366" />
          <h2>Add New Address</h2>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="input-group">
            <User className="input-icon" size={18} />
            <input name="fullName" placeholder="Receiver's Name" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <Phone className="input-icon" size={18} />
            <input name="phone" placeholder="10-digit Mobile Number" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <Home className="input-icon" size={18} />
            <input name="addressLine" placeholder="Flat, House no., Building, Street" onChange={handleChange} required />
          </div>

          <div className="input-row">
            <input name="city" placeholder="City/District" onChange={handleChange} required className="standard-input" />
            <input name="pincode" placeholder="Pincode" onChange={handleChange} required className="standard-input" />
          </div>

          <select name="state" onChange={handleChange} required className="standard-input">
            <option value="">Select State</option>
            <option value="Delhi">Delhi</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            {/* Add more states as needed */}
          </select>

          <label className="checkbox-group">
            <input type="checkbox" name="isDefault" onChange={handleChange} />
            <span>Make this my default address</span>
          </label>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAddress;