import { useEffect, useState, useMemo } from "react";
import { getAllUsers, type User } from "../../../config/authApi";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import type { LeaderboardUser } from "../types";
import { useUserStats } from "../../../hooks/useUserStats";

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
    return cached ? JSON.parse(cached) : [];
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();

        setApiUsers(users);
        localStorage.setItem("leaderboard_users", JSON.stringify(users));
      } catch (err: unknown) {
        console.error("Failed to fetch users:", err);
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

        const userBalance = isCurrent ? balance : user.balance;
        const userGames = isCurrent ? gamesPlayed : user.gamesPlayed;
        const userTotalWon = isCurrent ? totalWon : (user.totalWon ?? 0);
        const userTotalWagered = isCurrent
          ? totalWagered
          : (user.totalWagered ?? 0);

        const winRate =
          userTotalWagered > 0
            ? Math.floor((userTotalWon / userTotalWagered) * 100)
            : 0;

        return {
          ...user,
          balance: userBalance,
          gamesPlayed: userGames,
          rank: 0,
          winRate: `${winRate}%`,
        };
      })
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 8)
      .map((user, index) => ({ ...user, rank: index + 1 }));
  }, [apiUsers, currentUsername, balance, gamesPlayed, totalWon, totalWagered]);

  return { leaders, currentUsername };
};
