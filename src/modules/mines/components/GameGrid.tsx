import { cx } from "../../../utils/classNames";
import { BombIcon } from "../../../shared/icons/bomb";
import { DiamondIcon } from "../../../shared/icons/diamond";
import type { GameGridProps } from "../types";
import styles from "./GameGrid.module.scss";

export const GameGrid = ({
  className,
  cells,
  onCellClick,
  disabled,
  hidden,
}: GameGridProps) => {
  return (
    <div className={cx(styles.grid, className)}>
      {cells.map((status, i) => (
        <div
          key={i}
          className={cx(styles.cell, {
            [styles.cellSuccess]: status === "gem",
            [styles.cellFail]: status === "mine",
          })}
          onClick={() => !disabled && onCellClick(i)}
          style={{
            opacity: status === "hidden" && hidden ? 0 : 1,
            pointerEvents: disabled ? "none" : "auto",
          }}
        >
          {status === "gem" && <DiamondIcon />}
          {status === "mine" && <BombIcon />}
        </div>
      ))}
    </div>
  );
};
