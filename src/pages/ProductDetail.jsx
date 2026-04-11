import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import RiskBadge from "../components/RiskBadge";
import ReturnDisplay from "../components/ReturnDisplay";
import { usePortfolio } from "../context/PortfolioContext";
import { fetchProducts } from "../utils/transformData";
import "../styles/ProductDetail.css";

function generateDecisionInsight(product) {
  const insights = [];

  if (product.riskLevel === "low")
    insights.push("Suitable for conservative investors prioritizing capital preservation.");
  else if (product.riskLevel === "medium")
    insights.push("Balanced option for moderate investors seeking growth with managed risk.");
  else if (product.riskLevel === "high")
    insights.push("Best for aggressive investors comfortable with significant volatility.");

  if (product.liquidity === "locked")
    insights.push("Requires commitment; early withdrawal may incur penalties.");
  else if (product.liquidity === "easy")
    insights.push("Funds are accessible at any time with no penalty.");

  if (product.timeHorizon === "long")
    insights.push("Optimal when held for 5+ years to maximize returns.");
  else if (product.timeHorizon === "short")
    insights.push("Suitable for near-term goals within 1-2 years.");

  if (product.category === "crypto")
    insights.push("High volatility means returns can vary significantly year to year.");

  if (product.category === "insurance")
    insights.push("Provides financial protection in addition to investment returns.");

  return insights.join(" ");
}

function projectReturn(principal, annualReturnPercent, years) {
  return principal * Math.pow(1 + annualReturnPercent / 100, years);
}

function formatCurrency(value) {
  return `PKR ${new Intl.NumberFormat("en-PK").format(Math.round(value))}`;
}

const projectionYears = [1, 3, 5, 10];

export default function ProductDetail() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [principal, setPrincipal] = useState(0);
  const [compareId, setCompareId] = useState("");
  const [compareOpen, setCompareOpen] = useState(false);
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
        if (active) setError(err?.message || "Failed to load product details.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const product = useMemo(
    () => products.find((entry) => String(entry.id) === String(id)),
    [products, id]
  );

  useEffect(() => {
    if (product) {
      setPrincipal(product.minInvestment);
    }
  }, [product]);

  const compareProduct = useMemo(
    () => products.find((entry) => String(entry.id) === String(compareId)),
    [products, compareId]
  );

  const riskPercent = product
    ? { low: 33, medium: 66, high: 100 }[product.riskLevel] || 0
    : 0;

  const projections = useMemo(() => {
    if (!product) return [];
    return projectionYears.map((year) => ({
      year,
      value: projectReturn(Number(principal || 0), product.expectedReturn, year)
    }));
  }, [product, principal]);

  const inPortfolio = product ? items.some((item) => item.id === product.id) : false;

  if (loading) return <LoadingSpinner message="Loading product details..." />;
  if (error) return <p className="page-error">{error}</p>;
  if (!product) {
    return (
      <div className="product-detail-page page-enter">
        <div className="not-found-card">Product not found</div>
      </div>
    );
  }

  return (
    <div className="product-detail-page page-enter">
      <section className="detail-top">
        <img src={product.image} alt={product.name} className="detail-image" />
        <div className="detail-main">
          <h1>{product.name}</h1>
          <p className="detail-description">{product.description}</p>
          <div className="detail-highlights">
            <RiskBadge riskLevel={product.riskLevel} size="md" />
            <ReturnDisplay value={product.expectedReturn} showTrend={true} />
          </div>
          <button
            type="button"
            className={`btn-add ${inPortfolio ? "added" : ""}`}
            onClick={() => addToPortfolio(product)}
            disabled={inPortfolio}
          >
            {inPortfolio ? "Added ✓" : "Add to Portfolio"}
          </button>
        </div>
      </section>

      <section className="detail-grid">
        <div className="detail-card">
          <h2>Product Details</h2>
          <ul>
            <li>ID: {product.id}</li>
            <li>Name: {product.name}</li>
            <li>Category: {product.category}</li>
            <li>Description: {product.description}</li>
            <li>Expected Return: {product.expectedReturn}%</li>
            <li>Risk Level: {product.riskLevel}</li>
            <li>Liquidity: {product.liquidity}</li>
            <li>Time Horizon: {product.timeHorizon}</li>
            <li>Min Investment: {formatCurrency(product.minInvestment)}</li>
            <li>Image URL: {product.image}</li>
          </ul>
        </div>

        <div className="detail-card">
          <h2>Decision Insight</h2>
          <p>{generateDecisionInsight(product)}</p>

          <h3>Risk Visualization</h3>
          <div className="risk-track" aria-label="Risk level bar">
            <div
              className={`risk-fill risk-${product.riskLevel}`}
              style={{ width: `${riskPercent}%` }}
            />
          </div>
        </div>
      </section>

      <section className="detail-card">
        <h2>Return Projection Calculator</h2>
        <label className="principal-input">
          Principal (PKR)
          <input
            type="number"
            min="0"
            value={principal}
            onChange={(event) => setPrincipal(Number(event.target.value))}
          />
        </label>

        <table className="projection-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Projected Value</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>{formatCurrency(row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="detail-card">
        <h2>Comparison</h2>
        <button
          type="button"
          className="compare-btn"
          onClick={() => setCompareOpen((prev) => !prev)}
        >
          {compareOpen ? "Hide Compare" : "Compare"}
        </button>

        {compareOpen && (
          <label className="compare-select-wrap">
            Compare with another product
            <select value={compareId} onChange={(event) => setCompareId(event.target.value)}>
              <option value="">Select product</option>
              {products
                .filter((entry) => entry.id !== product.id)
                .map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
                  </option>
                ))}
            </select>
          </label>
        )}

        {compareOpen && compareProduct && (
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>{product.name}</th>
                <th>{compareProduct.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Category</td>
                <td>{product.category}</td>
                <td>{compareProduct.category}</td>
              </tr>
              <tr>
                <td>Expected Return</td>
                <td>{product.expectedReturn}%</td>
                <td>{compareProduct.expectedReturn}%</td>
              </tr>
              <tr>
                <td>Risk Level</td>
                <td>{product.riskLevel}</td>
                <td>{compareProduct.riskLevel}</td>
              </tr>
              <tr>
                <td>Liquidity</td>
                <td>{product.liquidity}</td>
                <td>{compareProduct.liquidity}</td>
              </tr>
              <tr>
                <td>Time Horizon</td>
                <td>{product.timeHorizon}</td>
                <td>{compareProduct.timeHorizon}</td>
              </tr>
              <tr>
                <td>Min Investment</td>
                <td>{formatCurrency(product.minInvestment)}</td>
                <td>{formatCurrency(compareProduct.minInvestment)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
