import { MULTIPLIER_THEME } from "../data/date-plinko";

/**
 * Получает цвет слота на основе отношения к максимальному множителю
 * Используется для CSS стилей
 */
export const getMultiplierColor = (
  multiplier: number,
  maxMultiplier?: number,
): string => {
  // Если передан максимальный множитель, используем отношение
  if (maxMultiplier && maxMultiplier > 0) {
    const ratio = multiplier / maxMultiplier;
    if (ratio >= 0.8) return "red";
    if (ratio >= 0.5) return "orange";
    if (ratio >= 0.3) return "yellow";
    if (ratio >= 0.15) return "yellow";
    return "green";
  }

  // Fallback на абсолютные значения
  if (multiplier >= 41) {
    return MULTIPLIER_THEME.red;
  }
  if (multiplier >= 10) {
    return MULTIPLIER_THEME.orange;
  }
  if (multiplier >= 3) {
    // Changed 2 to 3 to match TZ "Yellow: 5x, 3x"
    return MULTIPLIER_THEME.yellow;
  }
  return MULTIPLIER_THEME.green;
};
