import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import "../styles/Navbar.css";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Profile", to: "/profile" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Recommendations", to: "/recommendations" }
];

function isRouteActive(pathname, route) {
  if (route === "/") return pathname === "/";
  if (route === "/products") return pathname === "/products" || pathname.startsWith("/product/");
  return pathname === route;
}

export default function Navbar({ portfolioCount, currentRoute }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { count } = usePortfolio();

  const pathname = location?.pathname || currentRoute || "/";
  const resolvedCount = typeof count === "number" ? count : portfolioCount || 0;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          FAST FinTech
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navItems.map((item) => {
            const active = isRouteActive(pathname, item.to);
            const isPortfolio = item.to === "/portfolio";

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link ${active ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                {isPortfolio && <span className="portfolio-badge">{resolvedCount}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
