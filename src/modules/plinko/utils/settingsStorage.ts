import type { PlinkoSettings, PlinkoHistoryItem } from "../types";

const SETTINGS_KEY = "plinko_settings";
const HISTORY_KEY = "plinko_history";

export const saveSettings = (s: PlinkoSettings) =>
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));

export const loadSettings = (): PlinkoSettings | null => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveHistory = (history: PlinkoHistoryItem[]) => {
  const sliced = history.slice(0, 100); // Согласно ТЗ: максимум 100 записей
  localStorage.setItem(HISTORY_KEY, JSON.stringify(sliced));
};

export const loadHistory = (): PlinkoHistoryItem[] => {
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) return [];

  try {
    const parsed = JSON.parse(data);
    // Фильтруем только валидные записи с обязательными полями
    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is PlinkoHistoryItem =>
            item &&
            typeof item === "object" &&
            typeof item.id === "string" &&
            typeof item.bet === "number" &&
            typeof item.balls === "number" &&
            Array.isArray(item.results) &&
            item.results.length > 0,
        )
      : [];
  } catch {
    return [];
  }
};
