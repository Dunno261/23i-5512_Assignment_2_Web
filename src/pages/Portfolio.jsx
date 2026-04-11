import { useNavigate } from "react-router-dom";
import PortfolioItem from "../components/PortfolioItem";
import PortfolioSummary from "../components/PortfolioSummary";
import { usePortfolio } from "../context/PortfolioContext";
import "../styles/Portfolio.css";

export default function Portfolio() {
  const navigate = useNavigate();
  const { items, stats, removeFromPortfolio, updateAllocation } = usePortfolio();

  if (items.length === 0) {
    return (
      <div className="portfolio-page page-enter">
        <div className="portfolio-empty">
          <p>Your portfolio is empty. Browse products to get started.</p>
          <button type="button" className="portfolio-cta" onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-page page-enter">
      <PortfolioSummary stats={stats} />
      <section className="portfolio-list">
        {items.map((item) => (
          <PortfolioItem
            key={item.id}
            item={item}
            onRemove={removeFromPortfolio}
            onUpdateAmount={updateAllocation}
          />
        ))}
      </section>
    </div>
  );
}
