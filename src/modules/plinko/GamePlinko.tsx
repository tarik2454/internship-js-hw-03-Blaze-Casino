import { useEffect, useState, useRef } from "react";
import styles from "./GamePlinko.module.scss";
import { cx } from "../../utils/classNames";
import { RISK_ORDER, BALS, LINES } from "./constants/constants";
import type { PlinkoSettings, PlinkoHistoryItem, DropResult } from "./types";
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
  const BALL_PRICE = 2;

  const multipliers = getMultipliers(settings.risk, settings.lines);

  const currentDropResultsRef = useRef<DropResult[]>([]);

  const { canvasRef, addBall } = usePlinkoCanvas({
    lines: settings.lines,
    multipliers,
    onBallFinish: (ball) => {
      const result: DropResult = {
        multiplier: ball.multiplier,
        payout: ball.payout,
        slotIndex: ball.slotIndex,
      };

      currentDropResultsRef.current = [
        ...currentDropResultsRef.current,
        result,
      ];

      if (currentDropResultsRef.current.length === settings.balls) {
        const historyItem: PlinkoHistoryItem = {
          id: `drop_${Date.now()}`,
          timestamp: new Date().toISOString(),
          bet: BALL_PRICE,
          balls: settings.balls,
          risk: settings.risk,
          lines: settings.lines,
          results: [...currentDropResultsRef.current],
        };

        setHistory((prevHistory) => {
          const newHistory = [historyItem, ...prevHistory];
          return newHistory.slice(0, 20);
        });

        currentDropResultsRef.current = [];
      }
    },
  });

  const dropBalls = () => {
    currentDropResultsRef.current = [];

    for (let i = 0; i < settings.balls; i++) {
      setTimeout(() => {
        addBall(BALL_PRICE);
      }, i * 300);
    }
  };

  return (
    <div className={styles.gamePlinko}>
      <div className={styles.gameInner}>
        <div className={styles.leftColumn}>
          <div className={styles.gameAreaWrapper}>
            <div className={styles.gameArea}>
              <canvas
                ref={canvasRef}
                className={styles.plinkoCanvas}
                width={1000}
                height={1000}
              />
            </div>
          </div>

          <div className={styles.historySection}>
            <p className={styles.groupTitle}>RECENT DROPS</p>
            <div className={styles.card}>
              <div className={styles.cardDropsList}>
                {history.length === 0 ? (
                  <div className={styles.cardDropsEmpty}>No drops yet</div>
                ) : (
                  history.map((item) => {
                    console.log(item);
                    const firstResult = item.results[0];
                    if (!firstResult) return null;

                    const totalPayout = item.results.reduce(
                      (sum, r) => sum + r.payout,
                      0,
                    );

                    return (
                      <div key={item.id} className={styles.dropItem}>
                        <div className={styles.dropMain}>
                          <div
                            className={styles.dropMultiplier}
                            style={{
                              color: getMultiplierColor(firstResult.multiplier),
                            }}
                          >
                            {firstResult.multiplier}x
                          </div>
                          <div className={styles.dropMeta}>
                            <span className={styles.dropMetaItem}>
                              Bet: ${item.bet.toFixed(2)}
                            </span>
                            <span className={styles.dropMetaItem}>
                              Balls: {item.balls}
                            </span>
                            <span className={styles.dropMetaItem}>
                              Risk: {item.risk}
                            </span>
                            <span className={styles.dropMetaItem}>
                              Lines: {item.lines}
                            </span>
                          </div>
                        </div>
                        <div className={styles.dropInfo}>
                          <span className={styles.dropPayout}>
                            ${totalPayout.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.settingsPanel}>
          <h1 className={styles.groupTitle}>PLINKO+</h1>
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

          <button className={styles.startBtn} onClick={dropBalls}>
            Drop {settings.balls} {settings.balls === 1 ? "Ball" : "Balls"} ($
            {totalCost.toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
};
