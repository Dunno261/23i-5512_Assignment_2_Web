import { useState } from "react";
import RiskBadge from "./RiskBadge";
import ReturnDisplay from "./ReturnDisplay";
import "../styles/Portfolio.css";

export default function PortfolioItem({ item, onRemove, onUpdateAmount }) {
  const [pendingRemove, setPendingRemove] = useState(false);

  const handleRemove = () => {
    if (pendingRemove) {
      onRemove(item.id);
      setPendingRemove(false);
      return;
    }

    const confirmed = window.confirm("Remove this item from portfolio?");
    if (confirmed) {
      onRemove(item.id);
    } else {
      setPendingRemove(true);
      setTimeout(() => setPendingRemove(false), 3000);
    }
  };

  return (
    <article className="portfolio-item">
      <div className="portfolio-item-main">
        <h3>{item.name}</h3>
        <p className="portfolio-category">{item.category}</p>
        <div className="portfolio-meta">
          <RiskBadge riskLevel={item.riskLevel} size="sm" />
          <ReturnDisplay value={item.expectedReturn} showTrend={true} />
        </div>
      </div>

      <div className="portfolio-item-actions">
        <label>
          Allocated Amount (PKR)
          <input
            type="number"
            min="0"
            value={item.allocatedAmount}
            onChange={(e) => onUpdateAmount(item.id, e.target.value)}
          />
        </label>
        <button type="button" className="remove-btn" onClick={handleRemove}>
          {pendingRemove ? "Click again to remove" : "Remove"}
        </button>
      </div>
    </article>
  );
}
