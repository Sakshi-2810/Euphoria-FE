import React, { useState } from "react";
import api from "../services/api"; // Axios instance pointing to your backend

function AdminPanel() {
  // State for Category Form
  const [category, setCategory] = useState({ name: "", image: "" });
  const [catLoading, setCatLoading] = useState(false);
  const [catMessage, setCatMessage] = useState("");

  // State for Product Form
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    gallery: "",
    videoUrl: "",
    tags: "",
  });
  const [prodLoading, setProdLoading] = useState(false);
  const [prodMessage, setProdMessage] = useState("");

  // Handlers
  const handleCategoryChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const submitCategory = async (e) => {
    e.preventDefault();
    setCatLoading(true);
    setCatMessage("");
    try {
      const res = await api.post("/categories", category);
      setCatMessage("Category added successfully!");
      setCategory({ name: "", image: "" });
    } catch (err) {
      setCatMessage(err.response?.data?.message || "Failed to add category");
    } finally {
      setCatLoading(false);
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setProdLoading(true);
    setProdMessage("");
    try {
      // Split gallery and tags by comma
      const payload = {
        ...product,
        price: parseFloat(product.price),
        gallery: product.gallery.split(",").map((g) => g.trim()),
        tags: product.tags.split(",").map((t) => t.trim()),
      };
      const res = await api.post("/products", payload);
      setProdMessage("Product added successfully!");
      setProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
        gallery: "",
        videoUrl: "",
        tags: "",
      });
    } catch (err) {
      setProdMessage(err.response?.data?.message || "Failed to add product");
    } finally {
      setProdLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      <div className="admin-forms">
        {/* Add Category Form */}
        <div className="form-card">
          <h2>Add Category</h2>
          <form onSubmit={submitCategory}>
            <input
              type="text"
              name="name"
              placeholder="Category Name"
              value={category.name}
              onChange={handleCategoryChange}
              required
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={category.image}
              onChange={handleCategoryChange}
              required
            />
            <button type="submit" disabled={catLoading}>
              {catLoading ? "Adding..." : "Add Category"}
            </button>
            {catMessage && <p className="message">{catMessage}</p>}
          </form>
        </div>

        {/* Add Product Form */}
        <div className="form-card">
          <h2>Add Product</h2>
          <form onSubmit={submitProduct}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleProductChange}
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={handleProductChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleProductChange}
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category Name"
              value={product.category}
              onChange={handleProductChange}
              required
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Main Image URL"
              value={product.imageUrl}
              onChange={handleProductChange}
              required
            />
            <input
              type="text"
              name="gallery"
              placeholder="Gallery URLs (comma separated)"
              value={product.gallery}
              onChange={handleProductChange}
            />
            <input
              type="text"
              name="videoUrl"
              placeholder="Video URL (optional)"
              value={product.videoUrl}
              onChange={handleProductChange}
            />
            <input
              type="text"
              name="tags"
              placeholder="Tags (comma separated)"
              value={product.tags}
              onChange={handleProductChange}
            />
            <button type="submit" disabled={prodLoading}>
              {prodLoading ? "Adding..." : "Add Product"}
            </button>
            {prodMessage && <p className="message">{prodMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;