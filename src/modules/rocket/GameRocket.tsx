import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./GameRocket.module.scss";
import { useUserStats } from "../../hooks/useUserStats";
import { GameResultPopup } from "../../shared/components/GameResultPopup";
import { cx } from "../../utils/classNames";

type GameState = "IDLE" | "BETTING" | "FLYING" | "CRASHED" | "CASHOUT";

export const GameRocket = () => {
  const { balance, updateBalance } = useUserStats();
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [lastWin, setLastWin] = useState(0);
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [gameResult, setGameResult] = useState<number | null>(null);

  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const startGame = () => {
    if (balance < betAmount) return toast.warning("Insufficient balance!");

    setGameResult(null); // Сбрасываем предыдущий результат

    const crashPoint = 1 + Math.pow(Math.random(), 2) * 9;
    updateBalance(-betAmount, {
      totalWagered: betAmount,
      gamesPlayed: 1,
    });

    setGameState("FLYING");
    setMultiplier(1);
    setLastWin(0);
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const currentMultiplier = 1 + Math.pow(elapsed, 2) * 0.1;

      if (currentMultiplier >= crashPoint) {
        setGameState("CRASHED");
        setMultiplier(crashPoint);
        // Проигрыш = отрицательная ставка
        setGameResult(-betAmount);
        return;
      }

      setMultiplier(currentMultiplier);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  const handleCashOut = (finalMultiplier: number) => {
    cancelAnimationFrame(requestRef.current);
    const winAmount = betAmount * finalMultiplier;
    updateBalance(winAmount, {
      totalWon: winAmount,
    });
    const profit = winAmount - betAmount;
    setLastWin(winAmount);
    setMultiplier(finalMultiplier);
    setGameState("CASHOUT");
    setGameResult(profit);
  };

  const cashOut = () => {
    if (gameState === "FLYING") handleCashOut(multiplier);
  };

  useEffect(() => () => cancelAnimationFrame(requestRef.current), []);

  const isGameActive = gameState === "FLYING";

  // TODO: enum

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
