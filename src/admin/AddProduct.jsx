import { useState } from "react";
import { PackagePlus, Image as ImageIcon, IndianRupee } from "lucide-react";

function AddProduct() {
  const [product, setProduct] = useState({ name: "", price: "", category: "", image: "", desc: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Product Added:", product);
    alert("Product added successfully!");
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <div className="admin-header">
          <PackagePlus size={28} color="#ff3366" />
          <h2>Add New Product</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="input-group">
            <input type="text" placeholder="Product Name" required 
              onChange={(e) => setProduct({...product, name: e.target.value})} />
          </div>

          <div className="input-row">
            <div className="input-group">
              <IndianRupee size={16} className="input-icon" />
              <input type="number" placeholder="Price" required 
                onChange={(e) => setProduct({...product, price: e.target.value})} />
            </div>
            <select onChange={(e) => setProduct({...product, category: e.target.value})}>
              <option value="">Select Category</option>
              <option value="birthday">Birthday</option>
              <option value="wedding">Wedding</option>
            </select>
          </div>

          <div className="input-group">
            <ImageIcon size={16} className="input-icon" />
            <input type="text" placeholder="Image URL (Unsplash/Imgur)" 
              onChange={(e) => setProduct({...product, image: e.target.value})} />
          </div>

          <textarea placeholder="Product Description" rows="4"
            onChange={(e) => setProduct({...product, desc: e.target.value})}></textarea>

          <button type="submit" className="auth-btn">Publish Product</button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;