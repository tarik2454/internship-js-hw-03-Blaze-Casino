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
  // Limit to 100 items (FIFO - keep newest at top/start, so we slice 0-100)
  // Assuming 'history' passed here is already the full new list.
  // BUT the TZ says "When exceeded - remove oldest (FIFO)".
  // Usually we prepend new items. So keeping the first 100 is correct if 0 is newest.
  const sliced = history.slice(0, 100);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(sliced));
};

export const loadHistory = (): PlinkoHistoryItem[] => {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};
