import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight, Chrome } from "lucide-react";
import api, { loginUser } from "../services/api";

function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await loginUser(credentials);
    const { token, user } = res.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // SYNC GUEST CART TO BACKEND
    const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
    if (guestCart.length > 0) {
      for (const item of guestCart) {
        await api.post("/cart/add", { productId: item.id, qty: item.qty });
      }
      localStorage.removeItem("guest_cart"); // Clear after sync
    }

    navigate("/profile");
  } catch (err) {
    console.log(err);
    setError("Login failed");
  }
};

  const handleGoogleLogin = () => {
    // window.location.href = `${process.env.REACT_APP_API_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to access your orders and wishlist</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              onChange={handleChange} 
              required 
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
            />
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"} <LogIn size={18} />
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button className="auth-btn google-btn" onClick={handleGoogleLogin}>
          <Chrome size={18} /> Login with Google
        </button>

        <p className="auth-footer">
          New to Hampers? <Link to="/signup">Create an account <ArrowRight size={14} /></Link>
        </p>
      </div>
    </div>
  );
}

export default Login;