export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface PlinkoSettings {
  risk: RiskLevel;
  balls: number;
  lines: number;
  soundEnabled: boolean;
}

export interface DropResult {
  multiplier: number;
  payout: number;
  slotIndex: number;
}

export interface PlinkoHistoryItem {
  id: string;
  timestamp: string;
  bet: number;
  balls: number;
  risk: RiskLevel;
  lines: number;
  results: DropResult[];
}

export interface Ball {
  path: number[];
  currentStep: number;
  progress: number;
  row: number;
  col: number;
  multiplier: number;
  payout: number;
  slotIndex: number;
  finished: boolean;
  highlightSlot: boolean;
  finishTime?: number;
  betAmount: number;
  speed: number;
  bounceStrength?: number;
}

export interface UsePlinkoCanvasProps {
  lines: number;
  multipliers: number[];
  onBallFinish?: (ball: Ball) => void;
}

export interface UsePlinkoGameReturn {
  settings: PlinkoSettings;
  history: PlinkoHistoryItem[];
  lastResult: {
    profit: number;
    totalPayout: number;
    timestamp: number;
  } | null;
  totalCost: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  changeRisk: (direction: -1 | 1) => void;
  selectBalls: (quantity: number) => void;
  selectLines: (lines: number) => void;
  dropBalls: () => void;
  setLastResult: (result: {
    profit: number;
    totalPayout: number;
    timestamp: number;
  } | null) => void;
  isPlaying: boolean;
}
