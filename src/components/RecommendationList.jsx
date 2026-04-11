import { usePortfolio } from "../context/PortfolioContext";
import ProductCard from "./ProductCard";

export default function RecommendationList({ recommendations, profile }) {
  const { items, addToPortfolio } = usePortfolio();

  if (!profile) {
    return <p>Complete your financial profile to get personalized recommendations.</p>;
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <p>
        No products match your current profile. Try adjusting your risk tolerance or budget.
      </p>
    );
  }

  return (
    <div className="product-grid">
      {recommendations.map((product) => (
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
