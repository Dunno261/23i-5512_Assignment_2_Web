# Dynamic Financial Product Discovery Platform

React SPA for financial product discovery, filtering, portfolio simulation, and profile-based recommendations.


## Tech Stack

- React 19
- React Router v6
- Vite
- Plain CSS (no UI component library)

## Features Implemented

- Deterministic transformation of Fake Store API data into financial products
- Product listing with advanced filters (risk, return range, category, liquidity, horizon, budget)
- Product detail page with:
	- Decision insights
	- Risk visualization
	- Return projection calculator
	- Product comparison table
- Profile-driven recommendations
- Portfolio management with allocation editing and summary analytics
- Local storage persistence for:
	- Profile: fintech_profile
	- Portfolio: fintech_portfolio
- API failure fallback data path (so app still runs when Fake Store API is unavailable)

## Routes

- / -> Home
- /products -> Product Listing
- /product/:id -> Product Detail
- /profile -> User Profile
- /portfolio -> Portfolio
- /recommendations -> Recommendations
- * -> Not Found

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Project Structure

Core folders:

- src/components -> reusable UI components
- src/pages -> route-level pages
- src/context -> portfolio and profile global state
- src/utils -> transformation, recommendation, and portfolio calculation logic
- src/styles -> all CSS files

## Notes

- The app first tries to fetch from https://fakestoreapi.com/products.
- If that API is unreachable in your environment, it automatically uses fallback sample products.
- Financial mapping and return generation remain deterministic and aligned with the master spec.
