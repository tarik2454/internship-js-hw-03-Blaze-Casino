import { useEffect, useState, useRef, type ReactNode } from "react";
import { getCurrentUser } from "../config/authApi";
import { type UserStats, UserStatsContext } from "./types";
import { safeParseJSON } from "../utils/storage";
import { UserStatsSchema } from "../utils/schemas";
import { logger } from "../utils/logger";

export const UserStatsProvider = ({ children }: { children: ReactNode }) => {
  const defaultStats: UserStats = {
    username: "",
    balance: 0,
    totalWagered: 0,
    gamesPlayed: 0,
    totalWon: 0,
  };

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem("blaze_casino_user_data");
    return safeParseJSON(saved, UserStatsSchema, defaultStats);
  });
  const [isLoading, setIsLoading] = useState(true);

  const statsRef = useRef(stats);

  useEffect(() => {
    statsRef.current = stats;
    localStorage.setItem("blaze_casino_user_data", JSON.stringify(stats));
  }, [stats]);

  const fetchUserData = async (forceRefresh = false) => {
    try {
      const user = await getCurrentUser();

      setStats(() => {
        const saved = localStorage.getItem("blaze_casino_user_data");
        const savedStats = safeParseJSON(saved, UserStatsSchema, defaultStats);
        const hasSavedData = savedStats.username === user.username;

        if (hasSavedData && !forceRefresh) {
          return savedStats;
        }

        const userData: UserStats = {
          username: user.username,
          balance: user.balance ?? 100,
          totalWagered: user.totalWagered ?? 0,
          gamesPlayed: user.gamesPlayed ?? 0,
          totalWon: user.totalWon ?? 0,
        };

        localStorage.setItem(
          "blaze_casino_user_data",
          JSON.stringify(userData),
        );
        return userData;
      });
    } catch (error) {
      logger.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const updateStats = async (
    amount: number,
    extraStats?: Partial<Omit<UserStats, "balance" | "username">>,
  ) => {
    const currentStats = statsRef.current;

    const newStats = {
      ...currentStats,
      balance: currentStats.balance + amount,
      totalWagered: currentStats.totalWagered + (extraStats?.totalWagered || 0),
      gamesPlayed: currentStats.gamesPlayed + (extraStats?.gamesPlayed || 0),
      totalWon: currentStats.totalWon + (extraStats?.totalWon || 0),
    };

    setStats(newStats);
  };

  const refreshStats = () => fetchUserData(true);

  return (
    <UserStatsContext.Provider
      value={{
        ...stats,
        isLoading,
        updateStats,
        refreshStats,
      }}
    >
      {children}
    </UserStatsContext.Provider>
  );
};
