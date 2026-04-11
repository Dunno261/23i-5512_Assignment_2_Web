import { useEffect, useState } from "react";
import "../styles/Profile.css";

const initialForm = {
  riskTolerance: "",
  investmentHorizon: "",
  monthlyCapacity: "",
  liquidityPreference: "",
  investmentGoal: ""
};

export default function ProfileForm({ profile, onSubmit, onChange }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        riskTolerance: profile.riskTolerance || "",
        investmentHorizon: profile.investmentHorizon || "",
        monthlyCapacity: profile.monthlyCapacity || "",
        liquidityPreference: profile.liquidityPreference || "",
        investmentGoal: profile.investmentGoal || ""
      });
    }
  }, [profile]);

  const updateField = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.riskTolerance) nextErrors.riskTolerance = "Risk tolerance is required.";
    if (!formData.investmentHorizon) nextErrors.investmentHorizon = "Investment horizon is required.";

    if (!formData.monthlyCapacity) {
      nextErrors.monthlyCapacity = "Monthly investment capacity is required.";
    } else if (Number(formData.monthlyCapacity) < 1000) {
      nextErrors.monthlyCapacity = "Monthly investment capacity must be at least PKR 1000.";
    }

    if (!formData.liquidityPreference) {
      nextErrors.liquidityPreference = "Liquidity preference is required.";
    }

    if (!formData.investmentGoal) {
      nextErrors.investmentGoal = "Investment goal is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      monthlyCapacity: Number(formData.monthlyCapacity)
    });
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <section className="profile-form-group">
        <h3>Risk Tolerance</h3>
        <label>
          <input
            type="radio"
            name="riskTolerance"
            value="conservative"
            checked={formData.riskTolerance === "conservative"}
            onChange={(e) => updateField("riskTolerance", e.target.value)}
          />
          Conservative
        </label>
        <label>
          <input
            type="radio"
            name="riskTolerance"
            value="moderate"
            checked={formData.riskTolerance === "moderate"}
            onChange={(e) => updateField("riskTolerance", e.target.value)}
          />
          Moderate
        </label>
        <label>
          <input
            type="radio"
            name="riskTolerance"
            value="aggressive"
            checked={formData.riskTolerance === "aggressive"}
            onChange={(e) => updateField("riskTolerance", e.target.value)}
          />
          Aggressive
        </label>
        {errors.riskTolerance && <p className="field-error">{errors.riskTolerance}</p>}
      </section>

      <section className="profile-form-group">
        <h3>Investment Horizon</h3>
        <label>
          <input
            type="radio"
            name="investmentHorizon"
            value="short"
            checked={formData.investmentHorizon === "short"}
            onChange={(e) => updateField("investmentHorizon", e.target.value)}
          />
          Short (1-2 years)
        </label>
        <label>
          <input
            type="radio"
            name="investmentHorizon"
            value="medium"
            checked={formData.investmentHorizon === "medium"}
            onChange={(e) => updateField("investmentHorizon", e.target.value)}
          />
          Medium (3-5 years)
        </label>
        <label>
          <input
            type="radio"
            name="investmentHorizon"
            value="long"
            checked={formData.investmentHorizon === "long"}
            onChange={(e) => updateField("investmentHorizon", e.target.value)}
          />
          Long (5+ years)
        </label>
        {errors.investmentHorizon && <p className="field-error">{errors.investmentHorizon}</p>}
      </section>

      <section className="profile-form-group">
        <h3>Monthly Investment Capacity (PKR)</h3>
        <input
          type="number"
          min="1000"
          value={formData.monthlyCapacity}
          onChange={(e) => updateField("monthlyCapacity", e.target.value)}
          placeholder="Enter amount in PKR"
        />
        {errors.monthlyCapacity && <p className="field-error">{errors.monthlyCapacity}</p>}
      </section>

      <section className="profile-form-group">
        <h3>Liquidity Preference</h3>
        <label>
          <input
            type="radio"
            name="liquidityPreference"
            value="easy"
            checked={formData.liquidityPreference === "easy"}
            onChange={(e) => updateField("liquidityPreference", e.target.value)}
          />
          Need quick access (easy)
        </label>
        <label>
          <input
            type="radio"
            name="liquidityPreference"
            value="moderate"
            checked={formData.liquidityPreference === "moderate"}
            onChange={(e) => updateField("liquidityPreference", e.target.value)}
          />
          Some flexibility (moderate)
        </label>
        <label>
          <input
            type="radio"
            name="liquidityPreference"
            value="locked"
            checked={formData.liquidityPreference === "locked"}
            onChange={(e) => updateField("liquidityPreference", e.target.value)}
          />
          Can lock funds (locked)
        </label>
        {errors.liquidityPreference && <p className="field-error">{errors.liquidityPreference}</p>}
      </section>

      <section className="profile-form-group">
        <h3>Investment Goal</h3>
        <select
          value={formData.investmentGoal}
          onChange={(e) => updateField("investmentGoal", e.target.value)}
        >
          <option value="">Select goal</option>
          <option value="wealth">Wealth Building</option>
          <option value="retirement">Retirement</option>
          <option value="emergency">Emergency Fund</option>
          <option value="purchase">Specific Purchase</option>
        </select>
        {errors.investmentGoal && <p className="field-error">{errors.investmentGoal}</p>}
      </section>

      <button type="submit" className="profile-save-btn">
        Save Profile
      </button>
    </form>
  );
}
