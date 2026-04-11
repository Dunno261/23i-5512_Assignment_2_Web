import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterPanel, { defaultFilters } from "../components/FilterPanel";
import ProductList, { applyFilters } from "../components/ProductList";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchProducts } from "../utils/transformData";
import "../styles/FilterPanel.css";

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const [filters, setFilters] = useState(() => {
    if (
      selectedCategory &&
      ["savings", "investment", "insurance", "crypto"].includes(selectedCategory)
    ) {
      return { ...defaultFilters, categories: [selectedCategory] };
    }
    return defaultFilters;
  });

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

  useEffect(() => {
    if (
      selectedCategory &&
      ["savings", "investment", "insurance", "crypto"].includes(selectedCategory)
    ) {
      setFilters((prev) => ({ ...prev, categories: [selectedCategory] }));
    }
  }, [selectedCategory]);

  const filteredCount = useMemo(() => applyFilters(products, filters).length, [products, filters]);

  return (
    <div className="product-listing-page page-enter">
      <header className="product-listing-header">
        <h1>Explore Financial Products</h1>
        <p className="product-count">{filteredCount} products</p>
      </header>

      {loading && <LoadingSpinner message="Loading products..." />}
      {error && <p className="page-error">{error}</p>}

      {!loading && !error && (
        <div className="product-listing-layout">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            productCount={filteredCount}
          />
          <section className="product-listing-main">
            <ProductList
              products={products}
              filters={filters}
              onFilterChange={setFilters}
            />
          </section>
        </div>
      )}
    </div>
  );
}
