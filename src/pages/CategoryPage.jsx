import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
        // Fetch all products filtered by category
        let res;
        if(name === "ALL") {
          res = await api.getProducts();
        } else {
          res = await api.getProductsByCategory(name);
        }
        setProducts(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [name]);

 if (loading) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>{name} Hampers</h2>

      <div className="product-grid">
        {Array(8).fill().map((_, i) => (
          <div key={i} className="product-skeleton shimmer"></div>
        ))}
      </div>
    </div>
  );
}

  return (
    <div style={{ padding: "20px" }}>
      <h2>{name} Hampers</h2>
      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;