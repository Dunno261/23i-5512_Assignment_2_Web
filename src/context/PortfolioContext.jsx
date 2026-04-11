import { createContext, useContext, useEffect, useState } from "react";
import { calculatePortfolioStats } from "../utils/portfolioCalculations";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fintech_portfolio")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("fintech_portfolio", JSON.stringify(items));
  }, [items]);

  const addToPortfolio = (product, amount = product.minInvestment) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === product.id)) return prev;
      return [...prev, { ...product, allocatedAmount: amount }];
    });
  };

  const removeFromPortfolio = (productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const updateAllocation = (productId, newAmount) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === productId ? { ...i, allocatedAmount: Number(newAmount) } : i
      )
    );
  };

  const stats = calculatePortfolioStats(items);

  return (
    <PortfolioContext.Provider
      value={{
        items,
        addToPortfolio,
        removeFromPortfolio,
        updateAllocation,
        stats,
        count: items.length
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
