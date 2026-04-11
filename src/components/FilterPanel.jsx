import "../styles/FilterPanel.css";

export const defaultFilters = {
  riskLevels: [],
  minReturn: 0,
  maxReturn: 30,
  categories: [],
  liquidity: "all",
  timeHorizon: "all",
  maxInvestment: 1000000
};

function toggleValue(currentValues, value) {
  if (currentValues.includes(value)) {
    return currentValues.filter((item) => item !== value);
  }
  return [...currentValues, value];
}

export default function FilterPanel({ filters, onFilterChange, productCount }) {
  const setField = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <aside className="filter-panel">
      <div className="filter-header">
        <h2>Filters</h2>
        <p>{productCount} products found</p>
      </div>

      <section className="filter-group">
        <h3>Risk Level</h3>
        {[
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" }
        ].map((risk) => (
          <label key={risk.value} className="control-row">
            <input
              type="checkbox"
              checked={filters.riskLevels.includes(risk.value)}
              onChange={() => setField("riskLevels", toggleValue(filters.riskLevels, risk.value))}
            />
            <span>{risk.label}</span>
          </label>
        ))}
      </section>

      <section className="filter-group">
        <h3>Return Range (%)</h3>
        <div className="range-inputs">
          <input
            type="number"
            min="0"
            max="30"
            value={filters.minReturn}
            onChange={(e) => setField("minReturn", Number(e.target.value))}
            placeholder="Min"
          />
          <input
            type="number"
            min="0"
            max="30"
            value={filters.maxReturn}
            onChange={(e) => setField("maxReturn", Number(e.target.value))}
            placeholder="Max"
          />
        </div>
      </section>

      <section className="filter-group">
        <h3>Category</h3>
        {[
          { value: "savings", label: "Savings" },
          { value: "investment", label: "Investment" },
          { value: "insurance", label: "Insurance" },
          { value: "crypto", label: "Crypto" }
        ].map((category) => (
          <label key={category.value} className="control-row">
            <input
              type="checkbox"
              checked={filters.categories.includes(category.value)}
              onChange={() => setField("categories", toggleValue(filters.categories, category.value))}
            />
            <span>{category.label}</span>
          </label>
        ))}
      </section>

      <section className="filter-group">
        <h3>Liquidity</h3>
        <select
          value={filters.liquidity}
          onChange={(e) => setField("liquidity", e.target.value)}
        >
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="locked">Locked</option>
        </select>
      </section>

      <section className="filter-group">
        <h3>Time Horizon</h3>
        <select
          value={filters.timeHorizon}
          onChange={(e) => setField("timeHorizon", e.target.value)}
        >
          <option value="all">All</option>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </section>

      <section className="filter-group">
        <h3>Max Investment (PKR)</h3>
        <input
          type="number"
          min="0"
          value={filters.maxInvestment}
          onChange={(e) => setField("maxInvestment", Number(e.target.value))}
          placeholder="Budget ceiling"
        />
      </section>

      <button type="button" className="reset-btn" onClick={() => onFilterChange(defaultFilters)}>
        Reset Filters
      </button>
    </aside>
  );
}
