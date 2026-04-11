import "../styles/Portfolio.css";

function formatCurrency(value) {
  return `PKR ${new Intl.NumberFormat("en-PK").format(Math.round(value || 0))}`;
}

export default function PortfolioSummary({ stats }) {
  return (
    <section className="portfolio-summary-card">
      <h2>Portfolio Summary</h2>
      <p>Total Invested: {formatCurrency(stats.totalInvested)}</p>
      <p>Weighted Expected Return: {stats.weightedReturn.toFixed(2)}%</p>

      <div className="risk-bars">
        <div className="risk-row">
          <span>Low ({stats.riskPercent.low.toFixed(1)}%)</span>
          <div className="risk-track">
            <div className="risk-fill risk-low" style={{ width: `${stats.riskPercent.low}%` }} />
          </div>
        </div>
        <div className="risk-row">
          <span>Medium ({stats.riskPercent.medium.toFixed(1)}%)</span>
          <div className="risk-track">
            <div
              className="risk-fill risk-medium"
              style={{ width: `${stats.riskPercent.medium}%` }}
            />
          </div>
        </div>
        <div className="risk-row">
          <span>High ({stats.riskPercent.high.toFixed(1)}%)</span>
          <div className="risk-track">
            <div className="risk-fill risk-high" style={{ width: `${stats.riskPercent.high}%` }} />
          </div>
        </div>
      </div>

      {stats.highRiskWarning && (
        <div className="risk-warning">
          ⚠ Over 70% of your portfolio is in high-risk products. Consider diversifying.
        </div>
      )}
    </section>
  );
}
