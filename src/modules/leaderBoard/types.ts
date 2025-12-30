import type { User } from "../../../types";

export interface LeaderboardUser extends User {
  rank: number;
  winRate: string;
}
