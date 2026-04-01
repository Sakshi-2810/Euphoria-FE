import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand & About */}
        <div className="footer-section brand-info">
          <h2 className="footer-logo">EUPHORIA</h2>
          <p>Your one-stop destination for premium curated gift hampers. We deliver emotions, wrapped in perfection. 🎁</p>
          <div className="social-icons">
            <Instagram size={20} />
            <Facebook size={20} />
            <Twitter size={20} />
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cart">My Cart</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/login">Account</Link></li>
          </ul>
        </div>

        {/* Occasions */}
        <div className="footer-section">
          <h4>Occasions</h4>
          <ul>
            <li>Birthday Hampers</li>
            <li>Anniversary Gifts</li>
            <li>Wedding Specials</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section contact-details">
          <h4>Contact Us</h4>
          <p><Phone size={16} /> +91 98765 43210</p>
          <p><Mail size={16} /> support@hampers.com</p>
          <p><MapPin size={16} /> 123 Gift Lane, Mumbai, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 EUPHORIA. All rights reserved.</p>
        <div className="footer-legal">
          <span>Terms of Use</span> | <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;