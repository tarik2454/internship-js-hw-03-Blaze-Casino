import { useEffect, useRef, useState, startTransition } from "react";
import { cx } from "../../utils/classNames";
import { GameGrid } from "./components/GameGrid";
import { GameSettingsCard } from "./components/GameSettingsCard";
import { CurrentGameCard } from "./components/CurrentGameCard";
import { GameOverlay } from "./components/GameOverlay";
import { useMinesGame } from "./hooks/useMinesGame";
import { useUserStats } from "../../context/useUserStats";
import { GameResultPopup } from "../../shared/components/GameResultPopup";
import styles from "./Mines.module.scss";

export const Mines = () => {
  const {
    updateStats,
    balance,
    deductBetAndUpdateStats,
    registerGameActivity,
    unregisterGameActivity,
  } = useUserStats();
  const {
    gameState,
    cells,
    betAmount,
    setBetAmount,
    minesCount,
    setMinesCount,
    startGame,
    revealTile,
    cashOut,
    resetGame,
    currentMultiplier,
    currentValue,
    revealedCount,
    nextMultiplier,
  } = useMinesGame();

  const [lastResult, setLastResult] = useState<number | null>(null);
  const prevGameStateRef = useRef(gameState);
  const betDeductedRef = useRef(false);

  useEffect(() => {
    const prevState = prevGameStateRef.current;

    if (prevState !== "PLAYING" && gameState === "PLAYING") {
      if (balance >= betAmount) {
        deductBetAndUpdateStats(betAmount);
        betDeductedRef.current = true;
      } else {
        resetGame();
      }
    }

    if (prevState === "PLAYING" && gameState === "WON") {
      const profit = currentValue - betAmount;
      updateStats(currentValue, {
        totalWon: profit > 0 ? profit : 0,
      });
      startTransition(() => setLastResult(profit));
      betDeductedRef.current = false;
    }

    if (prevState === "PLAYING" && gameState === "LOST") {
      const profit = -betAmount;
      startTransition(() => setLastResult(profit));
      betDeductedRef.current = false;
    }

    if (gameState === "IDLE" && prevState !== "IDLE") {
      betDeductedRef.current = false;
      startTransition(() => setLastResult(null));
    }

    prevGameStateRef.current = gameState;
  }, [gameState, betAmount, currentValue, updateStats, balance, resetGame]);

  const isPlaying = gameState === "PLAYING";

  useEffect(() => {
    registerGameActivity("mines", isPlaying);
    return () => {
      unregisterGameActivity("mines");
    };
  }, [isPlaying, registerGameActivity, unregisterGameActivity]);
  const isGameEnded = gameState === "WON" || gameState === "LOST";
  const canInteract = !isPlaying;

  const handleMainButtonClick = () => {
    if (isPlaying) {
      cashOut();
    } else {
      if (isGameEnded) {
        resetGame();
      }
      startGame();
    }
  };

  return (
    <section className={styles.mainSection}>
      {lastResult !== null && (
        <GameResultPopup
          profit={lastResult}
          onClose={() => setLastResult(null)}
        />
      )}
      <div className={styles.gameContainer}>
        <div className={styles.gameWrapper}>
          <div className={styles.gameHeader}>
            <h2 className={styles.gameTitle}>Mines</h2>
            <div className={styles.headerCounters}>
              <p className={styles.headerCounterItem}>
                Revealed:{" "}
                <span className={styles.headerCounterItemCount}>
                  {revealedCount}
                </span>
              </p>
              <p className={styles.headerCounterItem}>
                Multiplier:{" "}
                <span className={styles.headerCounterItemMultiplier}>
                  {currentMultiplier.toFixed(2)}x
                </span>
              </p>
            </div>
          </div>

          <div
            className={cx(styles.gameBoard, {
              [styles.playing]: isPlaying || isGameEnded,
            })}
          >
            <GameGrid
              cells={cells}
              onCellClick={revealTile}
              disabled={!isPlaying}
              hidden={gameState === "IDLE"}
            />
          </div>
        </div>

        <GameOverlay gameState={gameState} currentValue={currentValue} />
      </div>

      <div className={styles.sidebar}>
        <GameSettingsCard
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          minesCount={minesCount}
          setMinesCount={setMinesCount}
          canInteract={canInteract}
          isPlaying={isPlaying}
          currentValue={currentValue}
          revealedCount={revealedCount}
          onMainButtonClick={handleMainButtonClick}
        />

        <CurrentGameCard
          betAmount={betAmount}
          currentValue={currentValue}
          nextMultiplier={nextMultiplier}
          minesCount={minesCount}
          revealedCount={revealedCount}
        />

        <div className={cx(styles.card, styles.tipsCard)}>
          <p className={cx(styles.cardTitle, styles.cardTitleTips)}>
            <span className={styles.bulbIcon}>💡</span> Tips
          </p>
          <ul className={styles.tipsList}>
            <li>More mines = higher multiplier</li>
            <li>Cash out anytime to secure wins</li>
            <li>Each safe tile increases payout</li>
            <li>One mine ends the game</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
