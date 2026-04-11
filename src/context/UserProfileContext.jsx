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

  const getProductRecommendations = (products) => getRecommendations(products, profile);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        updateProfile,
        isProfileComplete,
        getProductRecommendations
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}
