import { useEffect } from "react";
import styles from "./GameRocket.module.scss";
import { useRocketGame } from "./hooks/useRocketGame";
import { GameResultPopup } from "../../shared/components/GameResultPopup";
import { cx } from "../../utils/classNames";
import { useUserStats } from "../../context/useUserStats";

export const GameRocket = () => {
  const { registerGameActivity, unregisterGameActivity } = useUserStats();
  const {
    betAmount,
    multiplier,
    lastWin,
    gameState,
    gameResult,
    isGameActive,
    setBetAmount,
    startGame,
    cashOut,
    setGameResult,
  } = useRocketGame();

  useEffect(() => {
    registerGameActivity("rocket", isGameActive);
    return () => {
      unregisterGameActivity("rocket");
    };
  }, [isGameActive, registerGameActivity, unregisterGameActivity]);

  return (
    <section>
      {gameResult !== null && (
        <GameResultPopup
          profit={gameResult}
          onClose={() => setGameResult(null)}
        />
      )}
      <div className={styles.gameArea}>
        <div className={styles.multiplierContainer}>
          <span
            className={cx(
              styles.multiplier,
              gameState === "CRASHED" && styles.crashed,
              gameState === "CASHOUT" && styles.success,
            )}
          >
            {multiplier.toFixed(2)}x
          </span>
          {gameState === "CRASHED" && (
            <div className={styles.crashedText}>CRASHED</div>
          )}
          {gameState === "CASHOUT" && (
            <div className={styles.winText}>YOU WON ${lastWin.toFixed(2)}</div>
          )}
        </div>

        <div className={styles.rocket} data-state={gameState}>
          🚀
        </div>
      </div>

      <div>
        <p className={styles.label}>Bet Amount</p>
        <div className={styles.controlGroup}>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              disabled={isGameActive}
            />
          </div>

          <div>
            {gameState === "IDLE" ||
            gameState === "CRASHED" ||
            gameState === "CASHOUT" ? (
              <button onClick={startGame} className={styles.startBtn}>
                {gameState === "IDLE" ? "Start" : "Start Again"}
              </button>
            ) : (
              <button onClick={cashOut} className={styles.cashoutBtn}>
                Cash Out
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.quickBets}>
        {[10, 50, 100, 500].map((amount) => (
          <button
            key={amount}
            onClick={() => setBetAmount(amount)}
            disabled={isGameActive}
          >
            ${amount}
          </button>
        ))}
      </div>
    </section>
  );
};
