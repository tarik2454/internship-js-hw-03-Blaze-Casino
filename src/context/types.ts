import { createContext } from "react";

export interface UserStats {
  username: string;
  balance: number;
  totalWagered: number;
  gamesPlayed: number;
  totalWon: number;
}

export interface UserStatsContextType extends UserStats {
  isLoading: boolean;
  updateStats: (
    amount: number,
    extraStats?: Partial<Omit<UserStats, "balance" | "username">>,
  ) => Promise<void>;
  refreshStats: () => Promise<void>;
}

export const UserStatsContext = createContext<UserStatsContextType | undefined>(
  undefined,
);
