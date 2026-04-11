import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { usePortfolio } from "../context/PortfolioContext";

export function applyFilters(products, filters) {
  return products.filter((product) => {
    const riskPass =
      filters.riskLevels.length === 0 || filters.riskLevels.includes(product.riskLevel);
    const returnPass =
      product.expectedReturn >= filters.minReturn &&
      product.expectedReturn <= filters.maxReturn;
    const categoryPass =
      filters.categories.length === 0 || filters.categories.includes(product.category);
    const liquidityPass =
      filters.liquidity === "all" || product.liquidity === filters.liquidity;
    const horizonPass =
      filters.timeHorizon === "all" || product.timeHorizon === filters.timeHorizon;
    const budgetPass = product.minInvestment <= filters.maxInvestment;

    return (
      riskPass &&
      returnPass &&
      categoryPass &&
      liquidityPass &&
      horizonPass &&
      budgetPass
    );
  });
}

export default function ProductList({ products, filters, onFilterChange }) {
  const [isFiltering, setIsFiltering] = useState(false);
  const { items, addToPortfolio } = usePortfolio();

  void onFilterChange;

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 200);
    return () => clearTimeout(timer);
  }, [filters]);

  const filteredProducts = useMemo(() => applyFilters(products, filters), [products, filters]);

  if (filteredProducts.length === 0) {
    return <p className="no-products">No products match your filters</p>;
  }

  return (
    <div className={`product-grid ${isFiltering ? "filtering" : ""}`}>
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToPortfolio={addToPortfolio}
          isInPortfolio={items.some((item) => item.id === product.id)}
        />
      ))}
    </div>
  );
}
