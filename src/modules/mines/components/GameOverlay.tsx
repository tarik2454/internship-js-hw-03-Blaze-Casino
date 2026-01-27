import { cx } from "../../../utils/classNames";
import type { GameOverlayProps } from "../types";
import styles from "./GameOverlay.module.scss";

export const GameOverlay = ({ gameState, currentValue }: GameOverlayProps) => {
  if (gameState === "LOST") {
    return (
      <div className={styles.gameOverlay}>
        <p className={styles.gameOverlayTitle}>
          <span>💣</span> You hit a mine!
        </p>
      </div>
    );
  }

  if (gameState === "WON") {
    return (
      <div className={cx(styles.gameOverlay, styles.won)}>
        <p className={cx(styles.gameOverlayTitle, styles.won)}>
          <span>🎉</span> Cashed out successfully!
        </p>
        <p className={styles.wonAmount}>Won: ${currentValue.toFixed(2)}</p>
      </div>
    );
  }

  return null;
};

