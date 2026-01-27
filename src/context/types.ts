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
  deductBetAndUpdateStats: (betAmount: number) => void;
  refreshStats: () => Promise<void>;
  isAnyGameActive: boolean;
  registerGameActivity: (gameId: string, isActive: boolean) => void;
  unregisterGameActivity: (gameId: string) => void;
}

export const UserStatsContext = createContext<UserStatsContextType | undefined>(
  undefined,
);
