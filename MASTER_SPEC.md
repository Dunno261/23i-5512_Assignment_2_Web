# MASTER SPEC — Dynamic Financial Product Discovery Platform
## React SPA | Web Programming Assignment | FAST FinTech

> This document is the single source of truth for all logic, structure, and architecture.
> Copilot must not deviate from any logic defined here. Do not invent financial mappings,
> do not change folder structure, do not substitute UI libraries.

---

## 1. Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── ProductList.jsx
│   ├── FilterPanel.jsx
│   ├── RiskBadge.jsx
│   ├── ReturnDisplay.jsx
│   ├── PortfolioSummary.jsx
│   ├── PortfolioItem.jsx
│   ├── ProfileForm.jsx
│   ├── RecommendationList.jsx
│   └── LoadingSpinner.jsx
├── context/
│   ├── PortfolioContext.jsx
│   └── UserProfileContext.jsx
├── pages/
│   ├── Home.jsx
│   ├── ProductListing.jsx
│   ├── ProductDetail.jsx
│   ├── UserProfile.jsx
│   ├── Portfolio.jsx
│   ├── Recommendations.jsx
│   └── NotFound.jsx
├── utils/
│   ├── transformData.js
│   ├── recommendationEngine.js
│   └── portfolioCalculations.js
├── styles/
│   ├── global.css
│   ├── Navbar.css
│   ├── ProductCard.css
│   ├── FilterPanel.css
│   ├── ProductDetail.css
│   ├── Portfolio.css
│   ├── Profile.css
│   ├── Home.css
│   └── Recommendations.css
├── App.jsx
└── main.jsx
```

---

## 2. Routes

| Path | Component | Notes |
|---|---|---|
| `/` | Home | Landing page |
| `/products` | ProductListing | All products + filters |
| `/product/:id` | ProductDetail | Dynamic route |
| `/profile` | UserProfile | Profile form |
| `/portfolio` | Portfolio | Portfolio management |
| `/recommendations` | Recommendations | Requires profile |
| `*` | NotFound | 404 fallback |

---

## 3. Data Model

Every product object MUST have exactly these fields:

```js
{
  id: Number,
  name: String,
  category: 'savings' | 'investment' | 'insurance' | 'crypto',
  description: String,
  expectedReturn: Number,       // Annual %, e.g. 5.5
  riskLevel: 'low' | 'medium' | 'high',
  liquidity: 'easy' | 'moderate' | 'locked',
  timeHorizon: 'short' | 'medium' | 'long',
  minInvestment: Number,        // PKR amount
  image: String                 // URL from API
}
```

**Data consistency rules (enforced by transformation, not random):**
- `savings` → riskLevel: `low`, return: 3–7%, liquidity: `easy`, timeHorizon: `short`
- `investment` → riskLevel: `medium`, return: 7–12%, liquidity: `moderate`, timeHorizon: `long`
- `insurance` → riskLevel: `low`, return: 4–8%, liquidity: `locked`, timeHorizon: `long`
- `crypto` → riskLevel: `high`, return: 12–27%, liquidity: `easy`, timeHorizon: `long`

---

## 4. API Transformation — `src/utils/transformData.js`

Use Fake Store API: `https://fakestoreapi.com/products`

```js
// EXACT logic — do not randomize on each render
// Use product.id % seed for deterministic "random" values

const categoryMapping = {
  "electronics": "investment",
  "jewelery": "savings",
  "men's clothing": "insurance",
  "women's clothing": "crypto"
};

const riskMapping = {
  investment: "medium",
  savings: "low",
  insurance: "low",
  crypto: "high"
};

const liquidityMapping = {
  savings: "easy",
  investment: "moderate",
  insurance: "locked",
  crypto: "easy"
};

const timeHorizonMapping = {
  savings: "short",
  investment: "long",
  insurance: "long",
  crypto: "long"
};

// Deterministic return ranges by risk (uses product.id as seed, NOT Math.random())
function deterministicReturn(riskLevel, id) {
  const seed = id % 10; // 0–9
  if (riskLevel === "low")    return parseFloat((3 + (seed / 10) * 4).toFixed(2));   // 3–7%
  if (riskLevel === "medium") return parseFloat((7 + (seed / 10) * 5).toFixed(2));   // 7–12%
  if (riskLevel === "high")   return parseFloat((12 + (seed / 10) * 15).toFixed(2)); // 12–27%
}

export function transformToFinancialProduct(apiProduct) {
  const category = categoryMapping[apiProduct.category] || "investment";
  const riskLevel = riskMapping[category];
  const expectedReturn = deterministicReturn(riskLevel, apiProduct.id);
  const minInvestment = Math.round(apiProduct.price * 1000);

  return {
    id: apiProduct.id,
    name: apiProduct.title,
    category,
    description: apiProduct.description,
    expectedReturn,
    riskLevel,
    liquidity: liquidityMapping[category],
    timeHorizon: timeHorizonMapping[category],
    minInvestment,
    image: apiProduct.image
  };
}

export async function fetchProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("API fetch failed");
  const data = await res.json();
  return data.map(transformToFinancialProduct);
}
```

---

## 5. Recommendation Engine — `src/utils/recommendationEngine.js`

```js
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

  const filtered = products.filter(p =>
    p.minInvestment <= userProfile.monthlyCapacity &&
    allowedRisk.includes(p.riskLevel) &&
    allowedHorizon.includes(p.timeHorizon) &&
    allowedLiquidity.includes(p.liquidity)
  );

  // Sort: conservative → lowest risk first (then lowest return); aggressive → highest return first
  if (userProfile.riskTolerance === "conservative") {
    return filtered.sort((a, b) => a.expectedReturn - b.expectedReturn);
  } else {
    return filtered.sort((a, b) => b.expectedReturn - a.expectedReturn);
  }
}
```

---

## 6. Portfolio Calculations — `src/utils/portfolioCalculations.js`

```js
export function calculatePortfolioStats(items) {
  const totalInvested = items.reduce((sum, item) => sum + item.allocatedAmount, 0);

  const weightedReturn = totalInvested === 0
    ? 0
    : items.reduce((sum, item) =>
        sum + (item.allocatedAmount / totalInvested) * item.expectedReturn, 0
      );

  const riskDistribution = { low: 0, medium: 0, high: 0 };
  items.forEach(item => {
    riskDistribution[item.riskLevel] += item.allocatedAmount;
  });

  const riskPercent = {
    low: totalInvested ? (riskDistribution.low / totalInvested) * 100 : 0,
    medium: totalInvested ? (riskDistribution.medium / totalInvested) * 100 : 0,
    high: totalInvested ? (riskDistribution.high / totalInvested) * 100 : 0
  };

  const categoryDistribution = {};
  items.forEach(item => {
    categoryDistribution[item.category] = (categoryDistribution[item.category] || 0) + item.allocatedAmount;
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
```

---

## 7. Portfolio Context — `src/context/PortfolioContext.jsx`

```jsx
import { createContext, useContext, useState } from "react";
import { calculatePortfolioStats } from "../utils/portfolioCalculations";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToPortfolio = (product, amount = product.minInvestment) => {
    setItems(prev => {
      if (prev.find(i => i.id === product.id)) return prev;
      return [...prev, { ...product, allocatedAmount: amount }];
    });
  };

  const removeFromPortfolio = (productId) => {
    setItems(prev => prev.filter(i => i.id !== productId));
  };

  const updateAllocation = (productId, newAmount) => {
    setItems(prev =>
      prev.map(i => i.id === productId ? { ...i, allocatedAmount: Number(newAmount) } : i)
    );
  };

  const stats = calculatePortfolioStats(items);

  return (
    <PortfolioContext.Provider value={{
      items,
      addToPortfolio,
      removeFromPortfolio,
      updateAllocation,
      stats,
      count: items.length
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
```

---

## 8. User Profile Context — `src/context/UserProfileContext.jsx`

```jsx
import { createContext, useContext, useState } from "react";
import { getRecommendations } from "../utils/recommendationEngine";

const UserProfileContext = createContext();

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);

  const updateProfile = (newProfile) => setProfile(newProfile);

  const isProfileComplete = () =>
    profile &&
    profile.riskTolerance &&
    profile.investmentHorizon &&
    profile.monthlyCapacity > 0 &&
    profile.liquidityPreference &&
    profile.investmentGoal;

  const getProductRecommendations = (products) =>
    getRecommendations(products, profile);

  return (
    <UserProfileContext.Provider value={{
      profile,
      updateProfile,
      isProfileComplete,
      getProductRecommendations
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}
```

---

## 9. Filter Logic (Product Listing)

Filters combine with AND logic. A product passes only if ALL active filters match.

```js
function applyFilters(products, filters) {
  return products.filter(product => {
    const riskPass = filters.riskLevels.length === 0 || filters.riskLevels.includes(product.riskLevel);
    const returnPass = product.expectedReturn >= filters.minReturn && product.expectedReturn <= filters.maxReturn;
    const categoryPass = filters.categories.length === 0 || filters.categories.includes(product.category);
    const liquidityPass = filters.liquidity === "all" || product.liquidity === filters.liquidity;
    const horizonPass = filters.timeHorizon === "all" || product.timeHorizon === filters.timeHorizon;
    const budgetPass = product.minInvestment <= filters.maxInvestment;
    return riskPass && returnPass && categoryPass && liquidityPass && horizonPass && budgetPass;
  });
}

// Default filter state
const defaultFilters = {
  riskLevels: [],          // multi-select: [], ['low'], ['low','medium'], etc.
  minReturn: 0,
  maxReturn: 30,
  categories: [],          // multi-select
  liquidity: "all",        // 'all' | 'easy' | 'moderate' | 'locked'
  timeHorizon: "all",      // 'all' | 'short' | 'medium' | 'long'
  maxInvestment: 1000000   // user's budget ceiling
};
```

---

## 10. Decision Insight Generator

Used in ProductDetail page. Must be dynamic — not hardcoded strings.

```js
export function generateDecisionInsight(product) {
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
    insights.push("Suitable for near-term goals within 1–2 years.");

  if (product.category === "crypto")
    insights.push("High volatility means returns can vary significantly year to year.");

  if (product.category === "insurance")
    insights.push("Provides financial protection in addition to investment returns.");

  return insights.join(" ");
}
```

---

## 11. Return Projection Calculator (ProductDetail)

```js
// Compound interest: A = P * (1 + r/100)^t
function projectReturn(principal, annualReturnPercent, years) {
  return principal * Math.pow(1 + annualReturnPercent / 100, years);
}
// Show projections for 1, 3, 5, 10 years
```

---

## 12. CSS Variables (global.css)

```css
:root {
  --color-primary: #1a56db;
  --color-primary-dark: #1e429f;
  --color-bg: #f9fafb;
  --color-surface: #ffffff;
  --color-border: #e5e7eb;
  --color-text: #111827;
  --color-text-muted: #6b7280;

  --color-risk-low: #16a34a;
  --color-risk-medium: #d97706;
  --color-risk-high: #dc2626;

  --radius: 8px;
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
  --transition: 0.3s ease;
}
```

---

## 13. Required Animations (CSS only — no libraries)

```css
/* 1. Product card hover reveal */
.product-card .details-overlay {
  opacity: 0;
  transition: opacity var(--transition);
}
.product-card:hover .details-overlay {
  opacity: 1;
}

/* 2. Add to portfolio button state */
.btn-add { background: var(--color-primary); transition: background var(--transition); }
.btn-add.added { background: var(--color-risk-low); }

/* 3. Filter result animation */
.product-grid { transition: opacity 0.2s ease; }
.product-grid.filtering { opacity: 0.5; }

/* 4. Page fade-in */
.page-enter {
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 14. User Profile Form Fields

```js
// Profile state shape
{
  riskTolerance: '',        // 'conservative' | 'moderate' | 'aggressive'
  investmentHorizon: '',    // 'short' | 'medium' | 'long'
  monthlyCapacity: 0,       // number, min 1000
  liquidityPreference: '',  // 'easy' | 'moderate' | 'locked'
  investmentGoal: ''        // 'wealth' | 'retirement' | 'emergency' | 'purchase'
}
```

All fields required. Show validation errors. Show live count of matching products as user fills form.

---

## 15. Component Prop Interfaces

```js
// ProductCard
{ product, onAddToPortfolio, isInPortfolio }

// ProductList
{ products, filters, onFilterChange }

// FilterPanel
{ filters, onFilterChange, productCount }

// RiskBadge
{ riskLevel, size }   // size: 'sm' | 'md'

// ReturnDisplay
{ value, showTrend }  // showTrend: bool

// PortfolioSummary
{ stats }             // from calculatePortfolioStats()

// PortfolioItem
{ item, onRemove, onUpdateAmount }

// ProfileForm
{ profile, onSubmit, onChange }

// RecommendationList
{ recommendations, profile }

// Navbar
{ portfolioCount, currentRoute }
```

---

## 16. Featured Products Logic (Home Page)

Do NOT hardcode. Select dynamically:

```js
// Pick 1 from each category with highest expectedReturn
function getFeaturedProducts(products) {
  const categories = ['savings', 'investment', 'insurance', 'crypto'];
  return categories
    .map(cat => {
      const inCat = products.filter(p => p.category === cat);
      return inCat.sort((a, b) => b.expectedReturn - a.expectedReturn)[0];
    })
    .filter(Boolean);
}
```

---

## 17. Important Constraints

- NO Bootstrap, Material-UI, Tailwind, Ant Design, Chakra, or any component library
- All CSS written manually in `.css` files using the variables defined in §12
- Use React Router v6 (`createBrowserRouter` or `<BrowserRouter>`)
- Use `useParams()` for dynamic product ID in ProductDetail
- Use `useNavigate()` for programmatic navigation
- API fetch in `useEffect` with loading + error state
- localStorage persistence for profile and portfolio is a bonus — implement it
