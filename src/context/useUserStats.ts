import { useContext } from "react";
import { UserStatsContext } from "./types";

export const useUserStats = () => {
  const context = useContext(UserStatsContext);

  if (context === undefined) {
    throw new Error("useUserStats must be used within a UserStatsProvider");
  }

  return context;
};

