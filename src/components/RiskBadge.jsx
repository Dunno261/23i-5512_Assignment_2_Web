import "../styles/RiskBadge.css";

const labelMap = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk"
};

export default function RiskBadge({ riskLevel, size = "md" }) {
  const normalizedRisk = riskLevel || "low";
  const label = labelMap[normalizedRisk] || "Low Risk";

  return (
    <span className={`risk-badge risk-${normalizedRisk} risk-size-${size}`}>
      {label}
    </span>
  );
}
