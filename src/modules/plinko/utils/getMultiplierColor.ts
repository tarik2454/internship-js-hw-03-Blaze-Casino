import { MULTIPLIER_THEME } from "../constants";

export const getMultiplierColor = (
  multiplier: number,
  maxMultiplier?: number,
): string => {
  if (maxMultiplier && maxMultiplier > 0) {
    const ratio = multiplier / maxMultiplier;
    if (ratio >= 0.8) return "red";
    if (ratio >= 0.5) return "orange";
    if (ratio >= 0.3) return "yellow";
    if (ratio >= 0.15) return "yellow";
    return "green";
  }

  if (multiplier >= 41) {
    return MULTIPLIER_THEME.red;
  }
  if (multiplier >= 10) {
    return MULTIPLIER_THEME.orange;
  }
  if (multiplier >= 3) {
    return MULTIPLIER_THEME.yellow;
  }
  return MULTIPLIER_THEME.green;
};
