import { useEffect, useState } from "react";
import styles from "./GamePlinko.module.scss";
import { cx } from "../../utils/classNames";
import { RISK_ORDER, BALS, LINES } from "./data/date-plinko";
import type { PlinkoSettings, PlinkoHistoryItem } from "./types";
import {
  loadSettings,
  saveSettings,
  saveHistory,
  loadHistory,
} from "./utills/settingsStorage";
import { getMultipliers } from "./utills/getMultipliers";
import { getMultiplierColor } from "./utills/getMultiplierColor";
import { usePlinkoCanvas } from "./hooks/usePlinkoCanvas";

const DEFAULT_SETTINGS: PlinkoSettings = {
  risk: "LOW",
  balls: 1,
  lines: 8,
  soundEnabled: true,
};

export const GamePlinko = () => {
  const [settings, setSettings] = useState<PlinkoSettings>(() => {
    const saved = loadSettings();
    return saved || DEFAULT_SETTINGS;
  });

  const [history, setHistory] = useState<PlinkoHistoryItem[]>(() => {
    return loadHistory();
  });

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const changeRisk = (direction: -1 | 1) => {
    setSettings((current) => {
      const index = RISK_ORDER.indexOf(current.risk);
      const nextIndex =
        (index + direction + RISK_ORDER.length) % RISK_ORDER.length;
      return {
        ...current,
        risk: RISK_ORDER[nextIndex],
      };
    });
  };

  const selectBalls = (quantity: number) => {
    setSettings((current) => ({
      ...current,
      balls: quantity,
    }));
  };

  const selectLines = (lines: number) => {
    setSettings((current) => ({
      ...current,
      lines,
    }));
  };

  const selectedBall = BALS.find((ball) => ball.quantity === settings.balls);
  const totalCost = selectedBall ? selectedBall.cost : 0;
  const BALL_PRICE = 2; // Fixed price per ball as per TZ ($2.00)

  // Memoize multipliers to prevent unnecessary canvas updates happens via hook dependency
  const multipliers = getMultipliers(settings.risk, settings.lines);

  const { canvasRef, addBall } = usePlinkoCanvas({
    lines: settings.lines,
    multipliers,
    onBallFinish: (ball) => {
      const historyItem: PlinkoHistoryItem = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        timestamp: new Date().toISOString(),
        bet: ball.betAmount,
        multiplier: ball.multiplier,
        payout: ball.payout,
        risk: settings.risk,
        lines: settings.lines,
      };

      setHistory((prev) => {
        // Add new item to start, limit to 100
        const newHistory = [historyItem, ...prev];
        return newHistory.slice(0, 100);
      });
    },
  });

  const dropBalls = () => {
    for (let i = 0; i < settings.balls; i++) {
      setTimeout(() => {
        addBall(BALL_PRICE);
      }, i * 300);
    }
  };

  return (
    <div className={styles.gamePlinko}>
      <div className={styles.gameInner}>
        {/* Left Column: Game Area + History */}
        <div className={styles.leftColumn}>
          <div className={styles.gameAreaWrapper}>
            <div className={styles.gameArea}>
              <canvas
                ref={canvasRef}
                className={styles.plinkoCanvas}
                width={600}
                height={600}
              />
            </div>
          </div>

          <div className={styles.historySection}>
            <p className={styles.cardPlinkoTitle}>RECENT DROPS</p>
            <div className={styles.card}>
              <div className={styles.cardDropsList}>
                {history.length === 0 ? (
                  <div className={styles.cardDropsEmpty}>No drops yet</div>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className={styles.dropItem}>
                      <div
                        className={styles.dropMultiplier}
                        style={{ color: getMultiplierColor(item.multiplier) }}
                      >
                        {item.multiplier}x
                      </div>
                      <div className={styles.dropInfo}>
                        <span className={styles.dropPayout}>
                          ${item.payout.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Panel */}
        <div className={styles.settingsPanel}>
          <h1 className={styles.mainTitle}>PLINKO+</h1>
          <div className={styles.card}>
            <p className={styles.cardTitle}>RISK</p>
            <div className={styles.cardRisk}>
              <button
                className={styles.cardRiskButton}
                onClick={() => changeRisk(-1)}
              >
                -
              </button>
              <span className={styles.cardRiskValue}>
                {settings.risk.toUpperCase()}
              </span>
              <button
                className={styles.cardRiskButton}
                onClick={() => changeRisk(1)}
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <p className={styles.cardTitle}>LINES</p>
            <div className={styles.linesGroup}>
              {LINES.map((line) => (
                <button
                  key={line.id}
                  className={cx(
                    styles.ballBtn,
                    styles.lineBtn,
                    settings.lines === line.value && styles.active,
                  )}
                  onClick={() => selectLines(line.value)}
                >
                  <span className={styles.cardLinesValue}>{line.value}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <p className={styles.cardTitle}>BALLS</p>
            <div className={styles.ballsGroup}>
              {BALS.map((ball) => (
                <button
                  key={ball.id}
                  className={cx(
                    styles.ballBtn,
                    settings.balls === ball.quantity && styles.active,
                  )}
                  onClick={() => selectBalls(ball.quantity)}
                >
                  <span className={styles.ballQuantity}>{ball.quantity}</span>
                  <span className={styles.ballCost}>${ball.cost}.00</span>
                </button>
              ))}
            </div>
          </div>

          <button className={styles.startBtn} onClick={dropBalls}>
            Drop {settings.balls} {settings.balls === 1 ? "Ball" : "Balls"} ($
            {totalCost.toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
};
