import { useNavigate } from "react-router-dom";
import RiskBadge from "./RiskBadge";
import ReturnDisplay from "./ReturnDisplay";
import "../styles/ProductCard.css";

function formatCurrency(value) {
  return `PKR ${new Intl.NumberFormat("en-PK").format(value)}`;
}

function categoryLabel(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function ProductCard({ product, onAddToPortfolio, isInPortfolio }) {
  const navigate = useNavigate();

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-content">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <span className="category-badge">{categoryLabel(product.category)}</span>
        </div>

        <div className="product-metrics">
          <RiskBadge riskLevel={product.riskLevel} size="sm" />
          <ReturnDisplay value={product.expectedReturn} showTrend={true} />
        </div>

        <p className="product-min-investment">Min Investment: {formatCurrency(product.minInvestment)}</p>

        <div className="product-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            View Details
          </button>
          <button
            type="button"
            className={`btn-add ${isInPortfolio ? "added" : ""}`}
            onClick={() => onAddToPortfolio(product)}
            disabled={isInPortfolio}
          >
            {isInPortfolio ? "Added ✓" : "Add to Portfolio"}
          </button>
        </div>
      </div>

      <div className="details-overlay">
        <p>Liquidity: {product.liquidity}</p>
        <p>Time Horizon: {product.timeHorizon}</p>
      </div>
    </article>
  );
}
