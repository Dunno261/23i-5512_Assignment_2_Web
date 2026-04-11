import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { usePortfolio } from "../context/PortfolioContext";
import { useUserProfile } from "../context/UserProfileContext";
import { getRecommendations } from "../utils/recommendationEngine";
import { fetchProducts } from "../utils/transformData";
import "../styles/Profile.css";

export default function UserProfile() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const { profile, updateProfile } = useUserProfile();
  const { items } = usePortfolio();

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const fetched = await fetchProducts();
        if (active) setProducts(fetched);
      } catch (err) {
        if (active) setError(err?.message || "Failed to load products.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fintech_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        updateProfile(parsed);
      }
    } catch {
      // Ignore invalid localStorage payloads.
    }
  }, [updateProfile]);

  const matchingCount = useMemo(() => {
    if (!profile) return 0;
    return getRecommendations(products, profile).length;
  }, [products, profile]);

  const handleProfileSubmit = (newProfile) => {
    updateProfile(newProfile);
    localStorage.setItem("fintech_profile", JSON.stringify(newProfile));
    setSuccessMessage("Profile saved successfully.");
  };

  return (
    <div className="profile-page page-enter">
      <header className="profile-header">
        <h1>Build Your Investor Profile</h1>
        <p>Tell us your preferences to personalize your product discovery journey.</p>
      </header>

      {loading && <LoadingSpinner message="Loading profile data..." />}
      {error && <p className="page-error">{error}</p>}

      <ProfileForm profile={profile} onSubmit={handleProfileSubmit} onChange={() => {}} />

      {successMessage && (
        <div className="profile-success">
          <p>{successMessage}</p>
          <button type="button" className="profile-action-btn" onClick={() => navigate("/recommendations")}>
            View Recommendations
          </button>
        </div>
      )}

      {profile && (
        <section className="profile-summary-card">
          <h2>Profile Summary</h2>
          <ul>
            <li>Risk Tolerance: {profile.riskTolerance}</li>
            <li>Investment Horizon: {profile.investmentHorizon}</li>
            <li>Monthly Capacity: PKR {Number(profile.monthlyCapacity).toLocaleString("en-PK")}</li>
            <li>Liquidity Preference: {profile.liquidityPreference}</li>
            <li>Investment Goal: {profile.investmentGoal}</li>
            <li>Portfolio Items: {items.length}</li>
          </ul>
          <p className="matching-products">{matchingCount} products match your profile</p>
        </section>
      )}
    </div>
  );
}
