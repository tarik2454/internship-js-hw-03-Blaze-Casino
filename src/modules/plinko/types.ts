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
  multiplier: number;
  payout: number;
  risk: RiskLevel;
  lines: number;
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
}

export interface UsePlinkoCanvasProps {
  lines: number;
  multipliers: number[];
  onBallFinish?: (ball: Ball) => void;
}
