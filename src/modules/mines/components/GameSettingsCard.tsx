import { cx } from "../../../utils/classNames";
import { Input } from "../../../shared/components/Input";
import type { GameSettingsCardProps } from "../types";
import styles from "./GameSettingsCard.module.scss";

export const GameSettingsCard = ({
  betAmount,
  setBetAmount,
  minesCount,
  setMinesCount,
  canInteract,
  isPlaying,
  currentValue,
  revealedCount,
  onMainButtonClick,
}: GameSettingsCardProps) => {
  return (
    <>
      <p className={styles.cardTitle}>Game Settings</p>
      <div className={styles.card}>
        <div className={styles.controlGroup}>
          <Input
            label="Bet Amount"
            classNameLabel={styles.label}
            classNameInput={styles.input}
            value={betAmount}
            type="number"
            min={0.1}
            max={500}
            step={0.1}
            disabled={!canInteract}
            onChange={(e) => setBetAmount(Number(e.target.value))}
          />
          <div className={styles.quickBets}>
            {[10, 50, 100, 500].map((amount) => (
              <button
                key={amount}
                className={styles.betOption}
                disabled={!canInteract}
                onClick={() => setBetAmount(amount)}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <p className={styles.label}>Mines: {minesCount}</p>
          <div className={styles.minesOptions}>
            {[1, 3, 5, 10, 15, 24].map((count) => (
              <button
                key={count}
                className={cx(
                  styles.mineOption,
                  minesCount === count && styles.active,
                )}
                disabled={!canInteract}
                onClick={() => setMinesCount(count)}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <button
          className={cx(styles.startGameBtn, {
            [styles.playing]: isPlaying,
          })}
          onClick={onMainButtonClick}
          disabled={isPlaying && revealedCount === 0}
        >
          {isPlaying ? (
            <>
              <span className={styles.btnIcon}>💰</span> Cash Out $
              {currentValue.toFixed(2)}
            </>
          ) : (
            <>
              <span className={styles.btnIcon}>$</span> Start Game
            </>
          )}
        </button>
      </div>
    </>
  );
};

