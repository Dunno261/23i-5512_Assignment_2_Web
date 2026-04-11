import "../styles/ReturnDisplay.css";

export default function ReturnDisplay({ value, showTrend = false }) {
  const formattedValue = `${Number(value || 0).toFixed(2)}% p.a.`;

  return (
    <div className="return-display">
      <span className="return-value">{formattedValue}</span>
      {showTrend && <span className="return-trend">▲</span>}
    </div>
  );
}
