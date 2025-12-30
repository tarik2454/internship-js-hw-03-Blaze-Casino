import { BASE_MULTIPLIERS } from "../constants";
import type { RiskLevel } from "../types";

export function getMultipliers(risk: RiskLevel, lines: number) {
  const base = BASE_MULTIPLIERS[risk];
  const requiredSlots = lines + 1;
  const totalSlots = base.length;

  if (requiredSlots >= totalSlots) {
    return base;
  }

  const diff = totalSlots - requiredSlots;
  const offset = Math.floor(diff / 2);

  return base.slice(offset, offset + requiredSlots);
}
