import React, { useState, useEffect } from "react";
import * as api from "../services/api";
import { 
  Trash2, 
  Edit, 
  PlusCircle, 
  List, 
  Package, 
  X, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Tag,
  Image as ImageIcon
} from "lucide-react";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("add"); 
  const [loading, setLoading] = useState(false); // Global loading for forms
  const [deletingId, setDeletingId] = useState(null); // Local loading for specific delete buttons
  const [message, setMessage] = useState({ text: "", type: "" }); 

  // Data States
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  // Form States
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [categoryForm, setCategoryForm] = useState({ name: "", image: "", active: true });
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: [],
    image: "",
    gallery: "",
    videoUrl: "",
    tags: ""
  });

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
      ]);
      setCategories(catRes.data.data || catRes.data || []);
      setAllCategories([{ name: "TRENDING" }, ...catRes.data.data || []]); 
      setProducts(prodRes.data.data || prodRes.data || []);
    } catch (err) {
      showStatus("Failed to load data from server", "error");
    }
  };

  const showStatus = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  // --- Category Handlers ---
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.editCategory(categoryForm);
      showStatus("Category updated successfully!", "success");
      setCategoryForm({ name: "", image: "", active: true });
      fetchData();
    } catch (err) {
      showStatus("Error saving category", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (name) => {
    if (!window.confirm(`Delete category "${name}"? This may affect products.`)) return;
    setDeletingId(name);
    try {
      await api.deleteCategory(name);
      showStatus("Category deleted", "success");
      fetchData();
    } catch (err) {
      showStatus("Could not delete category", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // --- Product Handlers ---
  const startEditProduct = (prod) => {
    setIsEditing(true);
    setEditId(prod.productId);
    setActiveTab("add");
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      category: prod.category || [],
      image: prod.image,
      gallery: prod.gallery?.join(", ") || "",
      videoUrl: prod.videoUrl || "",
      tags: prod.tags?.join(", ") || ""
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setProductForm({ name: "", description: "", price: "", category: [], image: "", gallery: "", videoUrl: "", tags: ""});
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...productForm,
      price: parseFloat(productForm.price),
      gallery: productForm.gallery.split(",").map((g) => g.trim()).filter(g => g !== ""),
      tags: productForm.tags.split(",").map(t => t.trim()).filter(t => t !== ""),
      productId: isEditing ? editId : undefined
    };

    try {
      await api.postProduct(payload);
      showStatus(isEditing ? "Updated!" : "Launched!", "success");
      cancelEdit();
      fetchData();
    } catch (err) {
      showStatus("Operation failed. Check your data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Permanent delete this product?")) return;
    setDeletingId(id);
    try {
      await api.deleteProduct(id);
      showStatus("Product removed", "success");
      fetchData();
    } catch (err) {
      showStatus("Error deleting product", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Shield size={24} color="#ff3366" />
          <h2>Euphoria Admin</h2>
        </div>
        <nav className="admin-nav">
          <button className={activeTab === "add" ? "active" : ""} onClick={() => setActiveTab("add")}>
            <PlusCircle size={20} /> {isEditing ? "Editing Item" : "Add New"}
          </button>
          <button className={activeTab === "view-cats" ? "active" : ""} onClick={() => setActiveTab("view-cats")}>
            <List size={20} /> Manage Categories
          </button>
          <button className={activeTab === "view-prods" ? "active" : ""} onClick={() => setActiveTab("view-prods")}>
            <Package size={20} /> Manage Products
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        {message.text && (
          <div className={`status-toast ${message.type}`}>
            {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        {activeTab === "add" && (
          <div className="admin-forms-container anim-fade-in">
            <header className="content-header">
              <h1>{isEditing ? "Modify Product" : "Inventory Management"}</h1>
              <p>Create and update your store collection</p>
            </header>

            <div className="forms-grid">
              {!isEditing && (
                <section className="form-card">
                  <h3><PlusCircle size={18} /> New Category</h3>
                  <form onSubmit={handleCategorySubmit} className="admin-form">
                    <div className="field">
                      <label>Category Name</label>
                      <input type="text" placeholder="e.g. Birthday" value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} required />
                    </div>
                    <div className="field">
                      <label>Image URL</label>
                      <input type="text" placeholder="https://..." value={categoryForm.image} onChange={(e) => setCategoryForm({...categoryForm, image: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? (
                        <div className="btn-content">
                          <span className="btn-loader"></span>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        "Create Category"
                      )}
                    </button>
                  </form>
                </section>
              )}

              <section className="form-card product-card-form">
                <h3><Package size={18} /> {isEditing ? "Edit Details" : "Launch Product"}</h3>
                <form onSubmit={handleProductSubmit} className="admin-form">
                  <div className="input-row">
                    <div className="field">
                      <label>Product Title</label>
                      <input type="text" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} required />
                    </div>
                    <div className="field">
                      <label>Price (₹)</label>
                      <input type="number" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} required />
                    </div>
                  </div>

                  <div className="field">
                    <label>Target Categories</label>
                    <div className="category-checkbox-grid">
                      {allCategories.map((c) => (
                        <label key={c.name} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={productForm.category.includes(c.name)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              const currentCats = [...productForm.category];
                              if (checked) {
                                setProductForm({ ...productForm, category: [...currentCats, c.name] });
                              } else {
                                setProductForm({ ...productForm, category: currentCats.filter((name) => name !== c.name) });
                              }
                            }}
                          />
                          <span>{c.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label>Primary Image URL</label>
                    <input type="text" value={productForm.image} onChange={(e) => setProductForm({...productForm, image: e.target.value})} required />
                  </div>

                  <div className="field">
                    <label>Full Description</label>
                    <textarea value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} />
                  </div>

                  <div className="field">
                    <label><Tag size={14}/> Tags (Comma Separated)</label>
                    <input 
                      type="text" 
                      value={productForm.tags} 
                      onChange={(e) => setProductForm({...productForm, tags: e.target.value})} 
                      placeholder="BestSeller, NewArrival..." 
                    />
                  </div>

                  <div className="field">
                    <label>Gallery Images (comma separated)</label>
                    <input type="text" value={productForm.gallery} onChange={(e) => setProductForm({...productForm, gallery: e.target.value})} />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? (
                        <div className="btn-content">
                          <span className="btn-loader"></span>
                          <span>{isEditing ? "Updating..." : "Saving..."}</span>
                        </div>
                      ) : (
                        <>{isEditing ? "Update Product" : "Add to Store"}</>
                      )}
                    </button>
                    {isEditing && (
                      <button type="button" className="btn-secondary" onClick={cancelEdit} disabled={loading}>
                        <X size={16} /> Cancel
                      </button>
                    )}
                  </div>
                </form>
              </section>
            </div>
          </div>
        )}

        {activeTab === "view-cats" && (
          <div className="table-view anim-fade-in">
            <header className="content-header">
              <h1>Category List</h1>
              <p>View and remove product categories</p>
            </header>
            <div className="card-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.name}>
                      <td><div className="img-box"><img src={cat.image} alt="" /></div></td>
                      <td className="bold">{cat.name}</td>
                      <td>
                        <button 
                          className={`icon-btn delete ${deletingId === cat.name ? 'loading' : ''}`} 
                          onClick={() => deleteCategory(cat.name)}
                          disabled={deletingId !== null}
                        >
                          {deletingId === cat.name ? (
                            <span className="btn-loader small"></span>
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "view-prods" && (
          <div className="table-view anim-fade-in">
             <header className="content-header">
              <h1>Product Catalog</h1>
              <p>Manage existing items and pricing</p>
            </header>
            <div className="card-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(prod => (
                    <tr key={prod.productId}>
                      <td><div className="img-box"><img src={prod.image} alt="" /></div></td>
                      <td>
                        <div className="prod-name-cell">
                          <span className="bold">{prod.name}</span>
                          <span className="sub-text">{prod.productId?.substring(0, 8)}...</span>
                        </div>
                      </td>
                      <td className="bold">₹{prod.price}</td>
                      <td><span className="cat-pill">{prod.category?.[0]}</span></td>
                      <td>
                        <div className="action-cell">
                          <button className="icon-btn edit" onClick={() => startEditProduct(prod)} disabled={deletingId !== null}>
                            <Edit size={18} />
                          </button>
                          <button 
                            className={`icon-btn delete ${deletingId === prod.productId ? 'loading' : ''}`} 
                            onClick={() => deleteProduct(prod.productId)}
                            disabled={deletingId !== null}
                          >
                            {deletingId === prod.productId ? (
                              <span className="btn-loader small"></span>
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPanel;