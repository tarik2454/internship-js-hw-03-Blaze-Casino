import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { OpenAnimal } from "../../shared/icons/open-animal";
import styles from "./GameCases.module.scss";
import {
  animalContents,
  foodContents,
  spaceContents,
  sportsContents,
} from "./data/icon-contents";
import { useUserStats } from "../../hooks/useUserStats";
import { GameResultPopup } from "../../shared/components/GameResultPopup";
import { cx } from "../../utils/classNames";

export const GameCases = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastResult, setLastResult] = useState<{
    index: number;
    offset: number;
  } | null>(null);
  const [gameResult, setGameResult] = useState<number | null>(null);
  const { balance, updateBalance } = useUserStats();
  const [selectedCase, setSelectedCase] = useState<
    "animal" | "space" | "food" | "sports"
  >("animal");

  const gameAreaRef = useRef<HTMLDivElement>(null);

  const CASE_PRICES = {
    animal: 50,
    space: 75,
    food: 40,
    sports: 60,
  };

  const calculateItemValue = (
    caseType: "animal" | "space" | "food" | "sports",
    rarity: string,
  ) => {
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

  const getItemClassName = (index: number) => {
    if (index < 5) return "common";
    if (index < 8) return "uncommon";
    if (index < 10) return "rare";
    if (index < 12) return "epic";
    if (index < 13) return "legendary";
    return "gold";
  };

  const getCaseButtonClassName = (
    caseType: "animal" | "space" | "food" | "sports",
  ) => {
    return `${styles.betBtn} ${styles[`${caseType}Case`]} ${
      selectedCase === caseType ? styles.active : ""
    }`;
  };

  const handleStartAnimation = () => {
    if (isAnimating) return;

    const casePrice = CASE_PRICES[selectedCase];
    if (balance < casePrice) {
      return toast.warning("Insufficient balance!");
    }

    setGameResult(null); // Сбрасываем предыдущий результат

    updateBalance(-casePrice, {
      totalWagered: casePrice,
      gamesPlayed: 1,
    });

    const rarityProbabilities = [
      { rarity: "common", chance: 55, indices: [0, 1, 2, 3, 4] },
      { rarity: "uncommon", chance: 25, indices: [5, 6, 7] },
      { rarity: "rare", chance: 12, indices: [8, 9] },
      { rarity: "epic", chance: 5, indices: [10, 11] },
      { rarity: "legendary", chance: 2.5, indices: [12] },
      { rarity: "gold", chance: 0.5, indices: [13] },
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

        updateBalance(itemValue, {
          totalWon: itemValue,
        });

        const profit = itemValue - casePrice;
        setGameResult(profit);
        console.log(
          `Game Finished! Case: ${selectedCase} ($${casePrice}), Item Value: $${itemValue}, Result: ${
            profit >= 0 ? "+" : ""
          }${profit}`,
        );
      }, 1500);
    }
  };

  return (
    <section>
      {gameResult !== null && (
        <GameResultPopup
          profit={gameResult}
          onClose={() => setGameResult(null)}
        />
      )}
      <p className={styles.casesTitle}>Select a Case</p>

      <div className={styles.casesWrapper}>
        <button
          className={getCaseButtonClassName("animal")}
          onClick={() => setSelectedCase("animal")}
          disabled={isAnimating}
        >
          <span className={styles.icon}>🦁</span>
          <p className={styles.title}>Animal Case</p>
          <span className={styles.price}>$50</span>
        </button>
        <button
          className={getCaseButtonClassName("space")}
          onClick={() => setSelectedCase("space")}
          disabled={isAnimating}
        >
          <span className={styles.icon}>🚀</span>
          <p className={styles.title}>Space Case</p>
          <span className={styles.price}>$75</span>
        </button>
        <button
          className={getCaseButtonClassName("food")}
          onClick={() => setSelectedCase("food")}
          disabled={isAnimating}
        >
          <span className={styles.icon}>🍕</span>
          <p className={styles.title}>Food Case</p>
          <span className={styles.price}>40</span>
        </button>
        <button
          className={getCaseButtonClassName("sports")}
          onClick={() => setSelectedCase("sports")}
          disabled={isAnimating}
        >
          <span className={styles.icon}>⚽</span>
          <p className={styles.title}>Sports Case</p>
          <span className={styles.price}>$60</span>
        </button>
      </div>

      <div className={styles.gameArea}>
        <div className={styles.contentGameArea} ref={gameAreaRef}>
          {Array.from({ length: 10 }).flatMap((_, repeatIndex) =>
            getCurrentContents().map((item, index) => {
              const rarity = getItemClassName(index);
              const value = calculateItemValue(selectedCase, rarity);
              return (
                <div
                  className={cx(styles.contentItemGameArea, styles[rarity])}
                  key={`${item.id}-${repeatIndex}`}
                >
                  <div className={styles.contentIconGameArea}>{item.emoji}</div>
                  <div className={styles.itemValue}>+{value}</div>
                </div>
              );
            }),
          )}
        </div>
      </div>

      <button
        className={styles.startBtn}
        onClick={handleStartAnimation}
        disabled={isAnimating}
      >
        <span>
          <OpenAnimal />
        </span>
        {isAnimating ? (
          "Opening..."
        ) : (
          <>
            {selectedCase === "animal" && "Open Animal Case - $50"}
            {selectedCase === "space" && "Open Space Case - $75"}
            {selectedCase === "food" && "Open Food Case - 40"}
            {selectedCase === "sports" && "Open Sports Case - $60"}
          </>
        )}
      </button>

      <div className={styles.contentWrapper}>
        <p className={styles.contentTitle}>Case Contents</p>
        <div className={styles.contentInner}>
          {getCurrentContents().map((item, index) => {
            const rarity = getItemClassName(index);
            const value = calculateItemValue(selectedCase, rarity);
            return (
              <div className={cx(styles.contentItem, styles[rarity])} key={item.id}>
                <div className={styles.contentIcon}>{item.emoji}</div>
                <div className={styles.itemValueSmall}>+{value}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.rarityGuide}>
        <h3 className={styles.rarityTitle}>Rarity Guide</h3>
        <div className={styles.rarityList}>
          <div className={styles.rarityItem}>
            <span className={cx(styles.rarityСircle, styles.common)}></span>
            Common
            <span className={styles.rarityPercent}>(55%)</span>
          </div>
          <div className={styles.rarityItem}>
            <span className={cx(styles.rarityСircle, styles.uncommon)}></span>
            Uncommon
            <span className={styles.rarityPercent}>(25%)</span>
          </div>
          <div className={styles.rarityItem}>
            <span className={cx(styles.rarityСircle, styles.rare)}></span>
            Rare
            <span className={styles.rarityPercent}>(12%)</span>
          </div>
          <div className={styles.rarityItem}>
            <span className={cx(styles.rarityСircle, styles.epic)}></span>
            Epic
            <span className={styles.rarityPercent}>(5%)</span>
          </div>
          <div className={styles.rarityItem}>
            <span className={cx(styles.rarityСircle, styles.legendary)}></span>
            Legendary
            <span className={styles.rarityPercent}>(2.5%)</span>
          </div>
          <div className={styles.rarityItem}>
            <span className={cx(styles.rarityСircle, styles.gold)}></span>
            Gold
            <span className={styles.rarityPercent}>(0.5%)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
