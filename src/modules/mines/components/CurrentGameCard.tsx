import { cx } from "../../../utils/classNames";
import type { CurrentGameCardProps } from "../types";
import styles from "./CurrentGameCard.module.scss";

export const CurrentGameCard = ({
  betAmount,
  currentValue,
  nextMultiplier,
  minesCount,
  revealedCount,
}: CurrentGameCardProps) => {
  return (
    <div className={styles.card}>
      <p className={cx(styles.cardTitle, styles.cardTitleCurrentGame)}>
        Current Game
      </p>
      <div className={styles.statsWrapper}>
        <div className={styles.statsRow}>
          <span className={styles.statsLabel}>Bet Amount:</span>
          <span className={styles.statsValue}>${betAmount.toFixed(2)}</span>
        </div>
        <div className={styles.statsRow}>
          <span className={styles.statsLabel}>Current Value:</span>
          <span className={styles.statsValueSuccess}>
            ${currentValue.toFixed(2)}
          </span>
        </div>
        <div className={styles.statsRow}>
          <span className={styles.statsLabel}>Next Tile:</span>
          <span className={styles.statsValueNextTile}>
            {nextMultiplier.toFixed(2)}x
          </span>
        </div>
      </div>

      <div className={cx(styles.statsRow, styles.statsRowSafeTilesLeft)}>
        <span className={styles.statsLabel}>Safe Tiles Left:</span>
        <span className={styles.statsValueAccent}>
          {25 - minesCount - revealedCount}
        </span>
      </div>
    </div>
  );
};

