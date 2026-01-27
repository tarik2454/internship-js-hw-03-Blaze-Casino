export type GameStatus = "IDLE" | "PLAYING" | "WON" | "LOST";

export type CellStatus = "hidden" | "gem" | "mine";

export interface UseMinesGameReturn {
  gameState: GameStatus;
  cells: CellStatus[];
  betAmount: number;
  setBetAmount: (amount: number) => void;
  minesCount: number;
  setMinesCount: (count: number) => void;
  startGame: () => void;
  revealTile: (index: number) => void;
  cashOut: () => void;
  resetGame: () => void;
  currentMultiplier: number;
  nextMultiplier: number;
  currentValue: number;
  revealedCount: number;
}

export interface GameSettingsCardProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  minesCount: number;
  setMinesCount: (count: number) => void;
  canInteract: boolean;
  isPlaying: boolean;
  currentValue: number;
  revealedCount: number;
  onMainButtonClick: () => void;
}

export interface GameOverlayProps {
  gameState: GameStatus;
  currentValue: number;
}

export interface CurrentGameCardProps {
  betAmount: number;
  currentValue: number;
  nextMultiplier: number;
  minesCount: number;
  revealedCount: number;
}

export interface GameGridProps {
  className?: string;
  cells: CellStatus[];
  onCellClick: (index: number) => void;
  disabled?: boolean;
  hidden?: boolean;
}
