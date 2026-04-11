import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Recommendations from "./pages/Recommendations";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import Portfolio from "./pages/Portfolio";

function Layout({ children }) {
  return (
    <>
      <Navbar portfolioCount={0} currentRoute="" />
      {children}
    </>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <UserProfileProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </UserProfileProvider>
    </PortfolioProvider>
  );
}
