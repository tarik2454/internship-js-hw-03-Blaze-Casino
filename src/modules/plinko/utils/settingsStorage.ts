import type { PlinkoSettings, PlinkoHistoryItem } from "../types";
import { safeParseJSON } from "../../../utils/storage";
import {
  PlinkoSettingsSchema,
  PlinkoHistoryArraySchema,
} from "../../../utils/schemas";
import { DEFAULT_SETTINGS } from "../constants/constants";

const SETTINGS_KEY = "plinko_settings";
const HISTORY_KEY = "plinko_history";

export const saveSettings = (s: PlinkoSettings) =>
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));

export const loadSettings = (): PlinkoSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return safeParseJSON(data, PlinkoSettingsSchema, DEFAULT_SETTINGS);
};

export const saveHistory = (history: PlinkoHistoryItem[]) => {
  const sliced = history.slice(0, 100); // Согласно ТЗ: максимум 100 записей
  localStorage.setItem(HISTORY_KEY, JSON.stringify(sliced));
};

export const loadHistory = (): PlinkoHistoryItem[] => {
  const data = localStorage.getItem(HISTORY_KEY);
  return safeParseJSON(data, PlinkoHistoryArraySchema, []);
};
