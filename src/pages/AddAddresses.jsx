import React, { useState, useEffect } from "react";
import { MapPin, Phone, User, Home, ArrowLeft } from "lucide-react";
import * as api from "../services/api";
import { useNavigate, useLocation, useParams } from "react-router-dom";

function AddAddress() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = !!id;

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    default: false
  });

  const [loading, setLoading] = useState(false);

  // ✅ India states
  const indiaStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi"
  ];

  // ✅ Prefill from navigation OR API
  useEffect(() => {
    if (isEdit) {
      if (location.state) {
        // From previous page
        setAddress(location.state);
      } else {
        // 🔥 Refresh case → fetch from backend
        fetchAddress();
      }
    }
  }, [id, isEdit, location.state]);

  const fetchAddress = async () => {
    try {
      setLoading(true);
      const res = await api.getAddressById(id);
      setAddress(res.data);
    } catch (err) {
      console.error("Failed to fetch address", err);
      alert("Could not load address");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress({
      ...address,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.updateAddress(id, address);
        alert("Address updated successfully!");
      } else {
        await api.postAddress(address);
        alert("Address saved successfully!");
      }

      navigate("/profile");
    } catch (err) {
      console.error("Failed to save address", err);
      alert("Error saving address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>

        {/* Header */}
        <div className="admin-header">
          <MapPin size={28} color="#ff3366" />
          <h2>{isEdit ? "Edit Address" : "Add New Address"}</h2>
        </div>

        {/* Loader (for edit fetch) */}
        {loading && isEdit ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="admin-form">

            {/* Name */}
            <div className="input-group">
              <User className="input-icon" size={18} />
              <input
                name="fullName"
                value={address.fullName}
                onChange={handleChange}
                placeholder="Receiver's Name"
                required
              />
            </div>

            {/* Phone */}
            <div className="input-group">
              <Phone className="input-icon" size={18} />
              <input
                name="phone"
                value={address.phone}
                onChange={handleChange}
                placeholder="10-digit Mobile Number"
                required
              />
            </div>

            {/* Address */}
            <div className="input-group">
              <Home className="input-icon" size={18} />
              <input
                name="addressLine"
                value={address.addressLine}
                onChange={handleChange}
                placeholder="Flat, House no., Building, Street"
                required
              />
            </div>

            {/* City + Pincode */}
            <div className="input-row">
              <input
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="City/District"
                required
                className="standard-input"
              />

              <input
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                required
                className="standard-input"
              />
            </div>

            {/* State Dropdown */}
            <select
              name="state"
              value={address.state}
              onChange={handleChange}
              required
              className="standard-input"
            >
              <option value="">Select State</option>
              {indiaStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            {/* Default Checkbox */}
            <label className="checkbox-group">
              <input
                type="checkbox"
                name="default"
                checked={address.default}
                onChange={handleChange}
              />
              <span>Make this my default address</span>
            </label>

            {/* Submit */}
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Address"
                : "Save Address"}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}

export default AddAddress;