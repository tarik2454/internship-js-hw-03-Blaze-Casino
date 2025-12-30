// Types for Cases module

export type CaseType = "animal" | "space" | "food" | "sports";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "gold";

export interface UseCasesGameReturn {
  isAnimating: boolean;
  selectedCase: CaseType;
  gameResult: number | null;
  lastResult: {
    index: number;
    offset: number;
  } | null;
  gameAreaRef: React.RefObject<HTMLDivElement | null>;
  setSelectedCase: (caseType: CaseType) => void;
  handleStartAnimation: () => void;
  getCurrentContents: () => Array<{ id: number; emoji: string }>;
  getItemClassName: (index: number) => Rarity;
  calculateItemValue: (caseType: CaseType, rarity: Rarity) => number;
  setGameResult: (result: number | null) => void;
}

