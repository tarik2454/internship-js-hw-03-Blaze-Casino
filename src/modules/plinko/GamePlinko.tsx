import { memo } from "react";
import styles from "./GamePlinko.module.scss";
import { cx } from "../../utils/classNames";
import { BALS, LINES } from "./constants/constants";
import { getMultiplierColor } from "./utils/getMultiplierColor";
import { usePlinkoGame } from "./hooks/usePlinkoGame";
import { GameResultPopup } from "../../shared/components/GameResultPopup";

export const GamePlinko = memo(() => {
  const {
    settings,
    history,
    lastResult,
    totalCost,
    canvasRef,
    changeRisk,
    selectBalls,
    selectLines,
    dropBalls,
    setLastResult,
  } = usePlinkoGame();

  return (
    <div className={styles.gamePlinko}>
      {lastResult && (
        <GameResultPopup
          profit={lastResult.profit}
          onClose={() => setLastResult(null)}
        />
      )}
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
                  history.slice(0, 20).map((item) => {
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
});
