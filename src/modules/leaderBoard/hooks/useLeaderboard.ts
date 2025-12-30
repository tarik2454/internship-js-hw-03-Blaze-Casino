import { useEffect, useState, useMemo } from "react";
import { getAllUsers } from "../../../config/authApi";
import type { User } from "../../../types";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import type { LeaderboardUser } from "../types";
import { useUserStats } from "../../../context/useUserStats";
import { safeParseJSON } from "../../../utils/storage";
import { UserArraySchema } from "../../../utils/schemas";
import { logger } from "../../../utils/logger";

export const useLeaderboard = () => {
  const {
    balance,
    gamesPlayed,
    totalWon,
    totalWagered,
    username: currentUsername,
  } = useUserStats();

  const [apiUsers, setApiUsers] = useState<User[]>(() => {
    const cached = localStorage.getItem("leaderboard_users");
    return safeParseJSON(cached, UserArraySchema, []);
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();

        setApiUsers(users);
        localStorage.setItem("leaderboard_users", JSON.stringify(users));
      } catch (err: unknown) {
        logger.error("Failed to fetch users:", err);
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data?.message || "Failed to load leaderboard data",
          );
        } else {
          toast.error("Failed to load leaderboard data");
        }
      }
    };

    fetchUsers();
  }, [currentUsername]);

  const leaders: LeaderboardUser[] = useMemo(() => {
    return apiUsers
      .map((user) => {
        const isCurrent = user.username === currentUsername;

        const userBalance = isCurrent ? balance : (user.balance ?? 0);
        const userGames = isCurrent ? gamesPlayed : (user.gamesPlayed ?? 0);
        const userTotalWon = isCurrent ? totalWon : (user.totalWon ?? 0);
        const userTotalWagered = isCurrent
          ? totalWagered
          : (user.totalWagered ?? 0);

        const winRate =
          userTotalWagered > 0
            ? Math.floor((userTotalWon / userTotalWagered) * 100)
            : 0;

        const leaderboardUser: LeaderboardUser = {
          _id: user._id,
          username: user.username,
          balance: userBalance,
          gamesPlayed: userGames,
          totalWagered: userTotalWagered,
          totalWon: userTotalWon,
          rank: 0,
          winRate: `${winRate}%`,
        };
        return leaderboardUser;
      })
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 8)
      .map((user, index): LeaderboardUser => ({ ...user, rank: index + 1 }));
  }, [apiUsers, currentUsername, balance, gamesPlayed, totalWon, totalWagered]);

  return { leaders, currentUsername };
};
