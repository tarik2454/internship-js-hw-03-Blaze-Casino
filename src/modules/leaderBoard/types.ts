import type { User } from "../../../config/authApi";

export interface LeaderboardUser extends User {
  rank: number;
  winRate: string;
}

