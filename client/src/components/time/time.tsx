import { useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import formatTime from "../../utils/formatTime";

import styles from "./time.module.scss";

// TODO
// first batch doesnt work if only one batch is used

function Time() {
  const { currentTime, timestampBatch } = useAppSelector((state) => state.time);
  const { gamesPlayed } = useAppSelector((state) => state.games);

  console.log(gamesPlayed);
  useEffect(() => {
    console.log(gamesPlayed);
  }, [gamesPlayed]);

  return (
    <div>
      <h4>This Game:</h4>
      <ul className={styles.wrapper}>
        <li>Time since game started: {currentTime}</li>
        {timestampBatch !== 0 && (
          <li>Time first batch got delivered: {timestampBatch}</li>
        )}
      </ul>

      {/* // todo fix any */}
      <h4>Previous Games:</h4>
      {gamesPlayed.map(
        (game: { timeAllCompleted: number; timeBatchCompleted: number }) => {
          return (
            <>
              <hr />
              <ul className={styles.wrapper}>
                <li>Time all completed: {formatTime(game.timeAllCompleted)}</li>
                <li>
                  Time first batch got delivered:{" "}
                  {formatTime(game.timeBatchCompleted)}
                </li>
              </ul>
            </>
          );
        }
      )}
    </div>
  );
}

export default Time;
