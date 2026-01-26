import { useEffect, useState, useMemo } from "react";
import { getAllUsers } from "../../../api/user";
import { handleApiError } from "../../../api/auth";
import type { User } from "../../../types/index";
import type { LeaderboardUser } from "../types";
import { useUserStats } from "../../../context/useUserStats";
import { storage } from "../../../utils/storage";
import { UserArraySchema } from "../../../utils/schemas";
import { STORAGE_KEYS } from "../../../constants/storageKeys";

export const useLeaderboard = () => {
  const {
    balance,
    gamesPlayed,
    totalWon,
    totalWagered,
    username: currentUsername,
  } = useUserStats();

  const [apiUsers, setApiUsers] = useState<User[]>(() => {
    return storage.get(STORAGE_KEYS.LEADERBOARD_USERS, UserArraySchema, []);
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();

        setApiUsers(users);
        storage.set(STORAGE_KEYS.LEADERBOARD_USERS, users);
      } catch (err: unknown) {
        handleApiError(err, "Failed to load leaderboard data");
      }
    };

    fetchUsers();
  }, [currentUsername]);

  const leaders: LeaderboardUser[] = useMemo(() => {
    const transformed = apiUsers.map((user) => {
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

      return {
        _id: user._id,
        username: user.username,
        balance: userBalance,
        gamesPlayed: userGames,
        totalWagered: userTotalWagered,
        totalWon: userTotalWon,
        winRate: `${winRate}%`,
      };
    });

    const sorted = transformed.sort(
      (a, b) => (b.balance ?? 0) - (a.balance ?? 0),
    );
    const topUsers = sorted.slice(0, 8);

    return topUsers.map(
      (user, index): LeaderboardUser => ({
        ...user,
        rank: index + 1,
      }),
    );
  }, [apiUsers, currentUsername, balance, gamesPlayed, totalWon, totalWagered]);

  return { leaders, currentUsername };
};
