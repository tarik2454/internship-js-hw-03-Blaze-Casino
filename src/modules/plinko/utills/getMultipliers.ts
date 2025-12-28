import { BASE_MULTIPLIERS } from "../data/date-plinko";
import type { RiskLevel } from "../types";

export function getMultipliers(risk: RiskLevel, lines: number) {
  const base = BASE_MULTIPLIERS[risk];
  const requiredSlots = lines + 1;
  const totalSlots = base.length; // Usually 17 for 16 lines

  if (requiredSlots >= totalSlots) {
    return base;
  }

  // Calculate the center index of the base array
  // logic: we want to take the 'middle' chunk of the base array.
  // 16 lines (17 slots): take all.
  // 8 lines (9 slots): take 9 slots centered in the 17-slot array.

  const diff = totalSlots - requiredSlots;
  const offset = Math.floor(diff / 2);

  return base.slice(offset, offset + requiredSlots);
}
