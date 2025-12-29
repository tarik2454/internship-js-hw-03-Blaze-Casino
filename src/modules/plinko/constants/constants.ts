import { type RiskLevel } from "../types";

const RISK_ORDER: RiskLevel[] = ["LOW", "MEDIUM", "HIGH"];

const BALS = [
  {
    id: 1,
    quantity: 1,
    cost: 2,
  },
  {
    id: 2,
    quantity: 2,
    cost: 4,
  },
  {
    id: 3,
    quantity: 5,
    cost: 10,
  },
  {
    id: 4,
    quantity: 10,
    cost: 20,
  },
];

const LINES = [
  {
    id: 1,
    value: 8,
  },
  {
    id: 2,
    value: 9,
  },
  {
    id: 3,
    value: 10,
  },
  {
    id: 4,
    value: 11,
  },
  {
    id: 5,
    value: 12,
  },
  {
    id: 6,
    value: 13,
  },
  {
    id: 7,
    value: 14,
  },
  {
    id: 8,
    value: 15,
  },
  {
    id: 9,
    value: 16,
  },
];

export const BASE_MULTIPLIERS: Record<RiskLevel, number[]> = {
  LOW: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
  MEDIUM: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
  HIGH: [
    1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000,
  ],
};

export const MULTIPLIER_THEME = {
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#eab308",
  green: "#22c55e",
};

export { RISK_ORDER, BALS, LINES };
