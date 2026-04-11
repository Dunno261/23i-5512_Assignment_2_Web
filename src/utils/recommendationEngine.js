export function getRecommendations(products, userProfile) {
  if (!userProfile || !userProfile.riskTolerance) return [];

  const riskMapping = {
    conservative: ["low"],
    moderate: ["low", "medium"],
    aggressive: ["low", "medium", "high"]
  };

  const horizonMapping = {
    short: ["short"],
    medium: ["short", "medium"],
    long: ["short", "medium", "long"]
  };

  const liquidityMapping = {
    easy: ["easy"],
    moderate: ["easy", "moderate"],
    locked: ["easy", "moderate", "locked"]
  };

  const allowedRisk = riskMapping[userProfile.riskTolerance] || ["low"];
  const allowedHorizon = horizonMapping[userProfile.investmentHorizon] || ["short"];
  const allowedLiquidity = liquidityMapping[userProfile.liquidityPreference] || ["easy"];

  const filtered = products.filter(
    (p) =>
      p.minInvestment <= userProfile.monthlyCapacity &&
      allowedRisk.includes(p.riskLevel) &&
      allowedHorizon.includes(p.timeHorizon) &&
      allowedLiquidity.includes(p.liquidity)
  );

  if (userProfile.riskTolerance === "conservative") {
    return filtered.sort((a, b) => a.expectedReturn - b.expectedReturn);
  }

  return filtered.sort((a, b) => b.expectedReturn - a.expectedReturn);
}
