import { memo } from "react";
import { LeaderBoard } from "../../shared/icons/leaderboard";
import styles from "./Leaderboard.module.scss";
import { Place1 } from "../../shared/icons/place1";
import { Place2 } from "../../shared/icons/place2";
import { Place3 } from "../../shared/icons/place3";
import { useLeaderboard } from "./hooks/useLeaderboard";
import { cx } from "../../utils/classNames";

export const Leaderboard = memo(() => {
  const { leaders, currentUsername } = useLeaderboard();

  return (
    <section className={styles.leaderboardSection}>
      <div className={styles.leaderboardHeader}>
        <LeaderBoard />
        <div>
          <h2 className={styles.title}>Leaderboard</h2>
          <h3 className={styles.subtitle}>Top players</h3>
        </div>
      </div>

      <ul className={styles.listContainer}>
        {leaders.map((player) => (
          <li
            key={player._id}
            className={cx(
              player.rank <= 3 && styles.topRank,
              player.username === currentUsername && styles.currentUser,
            )}
          >
            <div className={styles.rank}>
              {player.rank === 1 ? (
                <Place1 />
              ) : player.rank === 2 ? (
                <Place2 />
              ) : player.rank === 3 ? (
                <Place3 />
              ) : (
                `#${player.rank}`
              )}
            </div>

            <div className={styles.playerInfo}>
              <div>
                <div className={styles.username}>{player.username}</div>
                <div className={styles.gamesPlayed}>
                  {player.gamesPlayed ?? 0} games
                </div>
              </div>
              <div>
                <div className={styles.win}>
                  ${(player.balance ?? 0).toFixed(0)}
                </div>
                <div className={styles.winRate}>{player.winRate} win</div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {currentUsername && (
        <div className={styles.ownRank}>
          Your rank: #
          {leaders.find((player) => player.username === currentUsername)
            ?.rank || "?"}
        </div>
      )}
    </section>
  );
});
