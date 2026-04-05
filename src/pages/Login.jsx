import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight, Chrome } from "lucide-react";
import * as api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user starts typing again
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { password } = credentials;

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
      const res = await api.loginUser(credentials);
      const { token, user } = res.data.data;
      
      // Initialize auth state
      login(user, token);

      // SYNC GUEST CART TO BACKEND
      const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      if (guestCart.length > 0) {
        // We use for...of to ensure sequential syncing before navigation
        for (const item of guestCart) {
          try {
            await api.postToCart({ 
              productId: item.productId, 
              qty: item.qty, 
              price: item.price, 
              name: item.name, 
              image: item.image 
            });
          } catch (syncErr) {
            console.error("Failed to sync item:", item.productId);
          }
        }
        localStorage.removeItem("guest_cart"); 
      }

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // window.location.href = `${process.env.REACT_APP_API_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="auth-container anim-fade-in">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to access your orders and wishlist</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <div className="btn-content">
                <span className="btn-loader"></span>
                <span>Authenticating...</span>
              </div>
            ) : (
              <>
                Login <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button 
          className="auth-btn google-btn" 
          onClick={handleGoogleLogin}
          disabled={loading}
        >
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