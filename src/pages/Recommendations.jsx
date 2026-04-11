import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import RecommendationList from "../components/RecommendationList";
import { useUserProfile } from "../context/UserProfileContext";
import { fetchProducts } from "../utils/transformData";
import "../styles/Recommendations.css";

export default function Recommendations() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { profile, isProfileComplete, getProductRecommendations } = useUserProfile();

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const fetched = await fetchProducts();
        if (active) setProducts(fetched);
      } catch (err) {
        if (active) setError(err?.message || "Failed to load recommendations.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const recommendations = useMemo(
    () => getProductRecommendations(products),
    [products, getProductRecommendations]
  );

  if (!isProfileComplete()) {
    return (
      <div className="recommendations-page page-enter">
        <div className="setup-card">
          <h2>You haven&#39;t set up your profile yet</h2>
          <p>Complete your financial profile to unlock personalized product matching.</p>
          <button type="button" className="setup-btn" onClick={() => navigate("/profile")}>
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page page-enter">
      <header className="recommendations-header">
        <h1>Personalized Recommendations</h1>
        {profile && (
          <div className="profile-summary">
            <span>Risk: {profile.riskTolerance}</span>
            <span>Horizon: {profile.investmentHorizon}</span>
            <span>Capacity: PKR {Number(profile.monthlyCapacity || 0).toLocaleString("en-PK")}</span>
          </div>
        )}
        <p className="match-count">{recommendations.length} products match your profile</p>
      </header>

      {loading && <LoadingSpinner message="Finding your recommendations..." />}
      {error && <p className="page-error">{error}</p>}

      {!loading && !error && (
        <RecommendationList recommendations={recommendations} profile={profile} />
      )}
    </div>
  );
}
