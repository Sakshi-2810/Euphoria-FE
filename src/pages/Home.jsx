import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import { useNavigate } from "react-router-dom";
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
        const categoriesRes = await getCategories();
        setCategories(categoriesRes.data.data || []);

        const trendingRes = await getTrendingProducts(6);
        setTrendingHampers(trendingRes.data || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Curated Hampers for <br /><span>Memorable Moments</span></h1>
          <p>Handpicked gifts delivered to your doorstep.</p>
          <button className="shop-now-btn" onClick={() => navigate('/category/all')}>
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
              key={cat.id}
              category={cat}
              onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;