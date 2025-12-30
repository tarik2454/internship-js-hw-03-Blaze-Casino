import { OpenAnimal } from "../../shared/icons/open-animal";
import styles from "./GameCases.module.scss";
import { useCasesGame } from "./hooks/useCasesGame";
import { GameResultPopup } from "../../shared/components/GameResultPopup";
import { cx } from "../../utils/classNames";

export const GameCases = () => {
  const {
    isAnimating,
    selectedCase,
    gameResult,
    gameAreaRef,
    setSelectedCase,
    handleStartAnimation,
    getCurrentContents,
    getItemClassName,
    calculateItemValue,
    setGameResult,
  } = useCasesGame();

  const getCaseButtonClassName = (
    caseType: "animal" | "space" | "food" | "sports",
  ) => {
    return `${styles.betBtn} ${styles[`${caseType}Case`]} ${
      selectedCase === caseType ? styles.active : ""
    }`;
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
