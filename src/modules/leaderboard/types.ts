import type { User } from "../../types/index";

export interface LeaderboardUser extends User {
  rank: number;
  winRate: string;
}
