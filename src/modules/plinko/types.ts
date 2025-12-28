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
