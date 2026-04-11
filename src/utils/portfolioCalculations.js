export function calculatePortfolioStats(items) {
  const totalInvested = items.reduce((sum, item) => sum + item.allocatedAmount, 0);

  const weightedReturn =
    totalInvested === 0
      ? 0
      : items.reduce(
          (sum, item) => sum + (item.allocatedAmount / totalInvested) * item.expectedReturn,
          0
        );

  const riskDistribution = { low: 0, medium: 0, high: 0 };
  items.forEach((item) => {
    riskDistribution[item.riskLevel] += item.allocatedAmount;
  });

  const riskPercent = {
    low: totalInvested ? (riskDistribution.low / totalInvested) * 100 : 0,
    medium: totalInvested ? (riskDistribution.medium / totalInvested) * 100 : 0,
    high: totalInvested ? (riskDistribution.high / totalInvested) * 100 : 0
  };

  const categoryDistribution = {};
  items.forEach((item) => {
    categoryDistribution[item.category] =
      (categoryDistribution[item.category] || 0) + item.allocatedAmount;
  });

  const highRiskWarning = riskPercent.high > 70;

  return {
    totalInvested,
    weightedReturn: parseFloat(weightedReturn.toFixed(2)),
    riskPercent,
    categoryDistribution,
    highRiskWarning
  };
}
