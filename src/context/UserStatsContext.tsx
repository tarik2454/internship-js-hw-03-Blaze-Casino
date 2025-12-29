import { useEffect, useState, useRef, type ReactNode } from "react";
import { getCurrentUser } from "../config/auth-api";
import { type UserStats, UserStatsContext } from "./UserStatsContextDefinition";

export const UserStatsProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem("blaze_casino_user_data");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      username: "",
      balance: 0,
      totalWagered: 0,
      gamesPlayed: 0,
      totalWon: 0,
    };
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
        const hasSavedData =
          saved && JSON.parse(saved).username === user.username;

        if (hasSavedData && !forceRefresh) {
          return JSON.parse(saved);
        }

        const userData = {
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
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const updateBalance = async (
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
        updateBalance,
        refreshStats,
      }}
    >
      {children}
    </UserStatsContext.Provider>
  );
};
