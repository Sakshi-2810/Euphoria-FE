import { useState, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { getProducts, getCategories } from "../services/api";
import ProductCard from "../components/ProductCard"; // ✅ Import your modular component
import { useLocation } from "react-router-dom";

function Products() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
const searchQuery = searchParams.get("search") || "";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("All");


  useEffect(() => {
  let updatedProducts = [...products];

  // ✅ 1. Handle Search
  if (searchQuery) {
    updatedProducts = updatedProducts.filter((product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // ✅ 2. Handle Category Filter
  if (selectedCategory !== "All") {
    updatedProducts = updatedProducts.filter(
      (product) => product.category?.name === selectedCategory
    );
  }

  // ✅ 3. Handle Sorting
  if (sortBy === "price-low") {
    updatedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    updatedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "newest") {
    updatedProducts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  setFilteredProducts(updatedProducts);
}, [products, searchQuery, selectedCategory, sortBy]);

useEffect(() => {
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      const prodData = prodRes?.data?.data || prodRes?.data || [];
      const catData = catRes?.data?.data || catRes?.data || [];

      setProducts(Array.isArray(prodData) ? prodData : []);
      setCategories(Array.isArray(catData) ? catData : []);
      setFilteredProducts(Array.isArray(prodData) ? prodData : []);

    } catch (err) {
      console.error("Error loading data", err);
    } finally {
      setLoading(false);
    }
  };

  loadInitialData();
}, []); 

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="products-count">
          Showing <strong>{filteredProducts.length}</strong> items
        </div>
        
        {/* Sort Dropdown */}
        <div className="sort-container">
          <div className="sort-selection">
            Sort by: <strong>{sortBy === "newest" ? "Newest" : sortBy === "price-low" ? "Price: Low to High" : "Price: High to Low"}</strong>
            <ChevronDown size={16} />
            <div className="sort-dropdown">
              <p onClick={() => setSortBy("newest")}>Newest</p>
              <p onClick={() => setSortBy("price-low")}>Price: Low to High</p>
              <p onClick={() => setSortBy("price-high")}>Price: High to Low</p>
            </div>
          </div>
        </div>
      </div>

      <div className="products-layout">
        <aside className="filter-sidebar">
          <div className="filter-section">
            <h4>FILTERS</h4>
            <div className="filter-group">
              <h5>Categories</h5>
              
              <label className="filter-label">
                <input 
                  type="radio" 
                  name="category" 
                  checked={selectedCategory === "All"}
                  onChange={() => setSelectedCategory("All")} 
                />
                All
              </label>

              {categories.map((cat) => (
                <label key={cat.name} className="filter-label">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === cat.name}
                    onChange={() => setSelectedCategory(cat.name)} 
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className="products-main">
          <div className="product-grid">
            {/* ✅ Using ProductCard component here */}
            {filteredProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Products;