import { useState, useRef } from "react";
import { toast } from "react-toastify";
import type { CaseType, Rarity, UseCasesGameReturn } from "../types";
import {
  animalContents,
  foodContents,
  spaceContents,
  sportsContents,
} from "../data/icon-contents";
import { useUserStats } from "../../../context/useUserStats";
import styles from "../GameCases.module.scss";

const CASE_PRICES = {
  animal: 50,
  space: 75,
  food: 40,
  sports: 60,
} as const;

export const useCasesGame = (): UseCasesGameReturn => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastResult, setLastResult] = useState<{
    index: number;
    offset: number;
  } | null>(null);
  const [gameResult, setGameResult] = useState<number | null>(null);
  const { balance, updateStats } = useUserStats();
  const [selectedCase, setSelectedCase] = useState<CaseType>("animal");

  const gameAreaRef = useRef<HTMLDivElement>(null);

  const calculateItemValue = (caseType: CaseType, rarity: Rarity): number => {
    const price = CASE_PRICES[caseType];
    let multiplier = 0;

    switch (rarity) {
      case "common":
        multiplier = -0.4;
        break;
      case "uncommon":
        multiplier = 0;
        break;
      case "rare":
        multiplier = 0.2;
        break;
      case "epic":
        multiplier = 1.0;
        break;
      case "legendary":
        multiplier = 2.0;
        break;
      case "gold":
        multiplier = 5.0;
        break;
      default:
        multiplier = 0;
    }

    const value = price * (1 + multiplier);
    return Math.ceil(value);
  };

  const getCurrentContents = () => {
    switch (selectedCase) {
      case "animal":
        return animalContents;
      case "space":
        return spaceContents;
      case "food":
        return foodContents;
      case "sports":
        return sportsContents;
      default:
        return animalContents;
    }
  };

  const getItemClassName = (index: number): Rarity => {
    if (index < 5) return "common";
    if (index < 8) return "uncommon";
    if (index < 10) return "rare";
    if (index < 12) return "epic";
    if (index < 13) return "legendary";
    return "gold";
  };

  const validateCaseType = (caseType: CaseType): void => {
    if (!Object.keys(CASE_PRICES).includes(caseType)) {
      throw new Error(`Invalid case type: ${caseType}`);
    }
  };

  const validateCasePrice = (price: number, balance: number): void => {
    if (price < 0) {
      throw new Error("Case price cannot be negative");
    }
    if (!Number.isFinite(price)) {
      throw new Error("Invalid case price");
    }
    if (price > balance) {
      throw new Error("Insufficient balance");
    }
  };

  const handleStartAnimation = () => {
    if (isAnimating) return;

    try {
      validateCaseType(selectedCase);
    } catch (error) {
      if (error instanceof Error) {
        toast.warning(error.message);
      }
      return;
    }

    const casePrice = CASE_PRICES[selectedCase];
    try {
      validateCasePrice(casePrice, balance);
    } catch (error) {
      if (error instanceof Error) {
        toast.warning(error.message);
      }
      return;
    }

    setGameResult(null);

    updateStats(-casePrice, {
      totalWagered: casePrice,
      gamesPlayed: 1,
    });

    const rarityProbabilities = [
      { rarity: "common" as Rarity, chance: 55, indices: [0, 1, 2, 3, 4] },
      { rarity: "uncommon" as Rarity, chance: 25, indices: [5, 6, 7] },
      { rarity: "rare" as Rarity, chance: 12, indices: [8, 9] },
      { rarity: "epic" as Rarity, chance: 5, indices: [10, 11] },
      { rarity: "legendary" as Rarity, chance: 2.5, indices: [12] },
      { rarity: "gold" as Rarity, chance: 0.5, indices: [13] },
    ];

    const selectCardByProbability = () => {
      const random = Math.random() * 100;
      let cumulative = 0;

      for (const { indices, chance } of rarityProbabilities) {
        cumulative += chance;
        if (random <= cumulative) {
          return indices[Math.floor(Math.random() * indices.length)];
        }
      }
      return 0;
    };

    const targetIndex = selectCardByProbability();
    const randomOffset = Math.random() * 100 - 50;

    if (gameAreaRef.current) {
      const area = gameAreaRef.current;

      if (lastResult) {
        const resetShift =
          (70 - (5 * 14 + lastResult.index)) * 146 - 73 + lastResult.offset;

        area.classList.remove(styles.transitionActive);
        area.style.transform = `translate(calc(-50% + ${resetShift}px), -50%)`;

        void area.offsetWidth;
      }

      const targetSet = 8;
      const endShift =
        (70 - (targetSet * 14 + targetIndex)) * 146 - 73 + randomOffset;

      area.classList.add(styles.transitionActive);
      area.style.transform = `translate(calc(-50% + ${endShift}px), -50%)`;

      setIsAnimating(true);
      setLastResult({ index: targetIndex, offset: randomOffset });

      setTimeout(() => {
        setIsAnimating(false);

        const rarity = getItemClassName(targetIndex);
        const itemValue = calculateItemValue(selectedCase, rarity);
        const casePrice = CASE_PRICES[selectedCase];

        updateStats(itemValue, {
          totalWon: itemValue,
        });

        const profit = itemValue - casePrice;
        setGameResult(profit);
      }, 1500);
    }
  };

  return {
    isAnimating,
    selectedCase,
    gameResult,
    lastResult,
    gameAreaRef,
    setSelectedCase,
    handleStartAnimation,
    getCurrentContents,
    getItemClassName,
    calculateItemValue,
    setGameResult,
  };
};
