export interface User {
  _id: string;
  username: string;
  gamesPlayed: number | null;
  balance: number | null;
  totalWagered: number | null;
  totalWon: number | null;
}

export interface AuthResponse {
  token: string;
}
