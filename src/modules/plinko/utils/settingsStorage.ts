import type { PlinkoSettings, PlinkoHistoryItem } from "../types";
import { storage } from "../../../utils/storage";
import {
  PlinkoSettingsSchema,
  PlinkoHistoryArraySchema,
} from "../../../utils/schemas";
import { DEFAULT_SETTINGS } from "../constants";

const SETTINGS_KEY = "plinko_settings";
const HISTORY_KEY = "plinko_history";

export const saveSettings = (s: PlinkoSettings) => {
  storage.set(SETTINGS_KEY, s);
};

export const loadSettings = (): PlinkoSettings => {
  return storage.get(SETTINGS_KEY, PlinkoSettingsSchema, DEFAULT_SETTINGS);
};

export const saveHistory = (history: PlinkoHistoryItem[]) => {
  const sliced = history.slice(0, 100);
  storage.set(HISTORY_KEY, sliced);
};

export const loadHistory = (): PlinkoHistoryItem[] => {
  return storage.get(HISTORY_KEY, PlinkoHistoryArraySchema, []);
};
