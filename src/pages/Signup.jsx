import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import * as api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user edits
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { password } = formData;

      // ✅ Password validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

      if (!passwordRegex.test(password)) {
        setError(
          "Password must be at least 8 characters long and include at least one uppercase and one lowercase letter."
        );
        setLoading(false);
        return;
      }
    try {
      const res = await api.signupUser(formData);
      const { token, user } = res.data.data;
      
      login(user, token); 
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container anim-fade-in">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join Hampers for a premium gifting experience</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <User className="input-icon" size={18} />
            <input 
              type="text" 
              name="name" 
              placeholder="Full Name" 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <Phone className="input-icon" size={18} />
            <input 
              type="tel" 
              name="phone" 
              placeholder="Mobile Number" 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <div className="btn-content">
                <span className="btn-loader"></span>
                <span>Creating Account...</span>
              </div>
            ) : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;