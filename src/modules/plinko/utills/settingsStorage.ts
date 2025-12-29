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
  const sliced = history.slice(0, 100);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(sliced));
};

export const loadHistory = (): PlinkoHistoryItem[] => {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};
