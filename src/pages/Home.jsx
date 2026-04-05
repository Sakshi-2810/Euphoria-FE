import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import { ArrowRight } from "lucide-react";
import { getCategories, getTrendingProducts } from "../services/api";

function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [trendingHampers, setTrendingHampers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, trendingRes] = await Promise.all([
          getCategories(),
          getTrendingProducts(6)
        ]);

        setCategories(categoriesRes.data.data || categoriesRes.data || []);
        setTrendingHampers(trendingRes.data.data || trendingRes.data || []);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // --- LOADING STATE (Skeleton Screen) ---
  if (loading) {
    return (
      <div className="home-wrapper anim-fade-in">
        {/* Hero Skeleton */}
        <div className="hero-skeleton shimmer"></div>

        {/* Categories Skeleton */}
        <section className="home-section">
          <div className="text-skeleton title shimmer" style={{ margin: '0 auto 30px' }}></div>
          <div className="categories-container">
            {Array(6).fill().map((_, i) => (
              <div key={i} className="category-card-skeleton">
                <div className="category-circle-skeleton shimmer"></div>
                <div className="text-skeleton small shimmer"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Products Skeleton */}
        <section className="home-section bg-light">
          <div className="text-skeleton title shimmer" style={{ marginBottom: '30px' }}></div>
          <div className="product-grid">
            {Array(6).fill().map((_, i) => (
              <div key={i} className="product-card-skeleton">
                <div className="image-skeleton shimmer"></div>
                <div className="text-skeleton title shimmer"></div>
                <div className="text-skeleton price shimmer"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // --- ACTUAL CONTENT ---
  return (
    <div className="home-wrapper anim-fade-in">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Curated Hampers for <br /><span>Memorable Moments</span></h1>
          <p>Handpicked gifts delivered to your doorstep.</p>
          <button className="shop-now-btn" onClick={() => navigate('/category/ALL')}>
            Explore Collection <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="home-section">
        <h2 className="section-title">Shop by Occasion</h2>
        <div className="categories-container">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.name}
              category={cat}
              onClick={() => navigate(`/category/${cat.name}`)}
            />
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="home-section bg-light">
        <div className="section-header">
          <h2 className="section-title">Trending This Week</h2>
          <button className="view-all" onClick={() => navigate('/products')}>
            View All
          </button>
        </div>
        <div className="product-grid">
          {trendingHampers.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;