export type GameState = "IDLE" | "BETTING" | "FLYING" | "CRASHED" | "CASHOUT";

export interface UseRocketGameReturn {
  betAmount: number;
  multiplier: number;
  lastWin: number;
  gameState: GameState;
  gameResult: number | null;
  isGameActive: boolean;
  setBetAmount: (amount: number) => void;
  startGame: () => void;
  cashOut: () => void;
  setGameResult: (result: number | null) => void;
}

