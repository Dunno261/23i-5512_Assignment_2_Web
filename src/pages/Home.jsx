import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import { usePortfolio } from "../context/PortfolioContext";
import { fetchProducts } from "../utils/transformData";
import "../styles/Home.css";

function getFeaturedProducts(products) {
  const categories = ["savings", "investment", "insurance", "crypto"];
  return categories
    .map((cat) => {
      const inCat = products.filter((p) => p.category === cat);
      return inCat.sort((a, b) => b.expectedReturn - a.expectedReturn)[0];
    })
    .filter(Boolean);
}

const categories = [
  { key: "savings", title: "Savings" },
  { key: "investment", title: "Investment" },
  { key: "insurance", title: "Insurance" },
  { key: "crypto", title: "Crypto" }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { addToPortfolio, items } = usePortfolio();

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const fetched = await fetchProducts();
        if (active) setProducts(fetched);
      } catch (err) {
        if (active) setError(err?.message || "Failed to load products.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const featuredProducts = useMemo(() => getFeaturedProducts(products), [products]);

  return (
    <div className="home-page page-enter">
      <section className="home-hero">
        <h1>Dynamic Financial Product Discovery Platform</h1>
        <p>Discover opportunities aligned with your risk appetite, goals, and budget.</p>
        <button type="button" className="hero-cta" onClick={() => navigate("/profile")}>
          Create Your Profile
        </button>
      </section>

      <section className="quick-stats" aria-label="Platform stats">
        <span>20 Products</span>
        <span>4 Categories</span>
        <span>Personalized Recommendations</span>
      </section>

      <section className="home-categories">
        <h2>Browse by Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <button
              key={category.key}
              type="button"
              className="category-card"
              onClick={() => navigate(`/products?category=${category.key}`)}
            >
              {category.title}
            </button>
          ))}
        </div>
      </section>

      <section className="home-featured">
        <h2>Featured Products</h2>
        {loading && <LoadingSpinner message="Loading featured products..." />}
        {error && <p className="page-error">{error}</p>}
        {!loading && !error && (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToPortfolio={addToPortfolio}
                isInPortfolio={items.some((item) => item.id === product.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
