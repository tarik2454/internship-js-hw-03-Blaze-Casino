export interface LeaderboardUser {
  _id: string;
  username: string;
  gamesPlayed: number | null;
  balance: number | null;
  totalWagered: number | null;
  totalWon: number | null;
  rank: number;
  winRate: string;
}
