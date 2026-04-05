import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import * as api from "../services/api";

function CategoryPage() {
  const { name } = useParams(); // category name from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let res;
        // Logic to handle "ALL" or specific category names
        if (name === "ALL" || !name) {
          res = await api.getProducts();
        } else {
          res = await api.getProductsByCategory(name);
        }
        
        // Handle different API response structures
        const data = res.data.data || res.data || [];
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]); // Clear products on error
      } finally {
        // Adding a slight delay can prevent "flicker" on super-fast connections
        setLoading(false);
      }
    }

    fetchProducts();
  }, [name]);

  // --- LOADING STATE (Skeleton Screen) ---
  if (loading) {
    return (
      <div className="products-page anim-fade-in">
        <header className="content-header" style={{ padding: "0 20px" }}>
          <h1 style={{ textTransform: "capitalize" }}>{name.toLowerCase()} Hampers</h1>
          <div className="text-skeleton small shimmer"></div>
        </header>

        <div className="product-grid" style={{ padding: "20px" }}>
          {Array(8).fill().map((_, i) => (
            <div key={i} className="product-card-skeleton">
              <div className="image-skeleton shimmer"></div>
              <div className="text-skeleton title shimmer"></div>
              <div className="text-skeleton price shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- DATA RENDER ---
  return (
    <div className="products-page anim-fade-in">
      <header className="content-header" style={{ padding: "0 20px" }}>
        <h1 style={{ textTransform: "capitalize" }}>{name.toLowerCase()} Hampers</h1>
        <p className="products-count">{products.length} Items found</p>
      </header>

      <div style={{ padding: "20px" }}>
        {products.length === 0 ? (
          <div className="empty-state">
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;