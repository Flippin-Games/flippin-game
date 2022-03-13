import { useAppSelector } from "../../store/hooks";
import formatTime from "../../utils/formatTime";

import styles from "./time.module.scss";
import { ReactComponent as TimeIcon } from "../../assets/svgs/time.svg";
import { ReactComponent as FirstTimeIcon } from "../../assets/svgs/time-first-batch.svg";

// TODO
// first batch doesnt work if only one batch is used

function Time() {
  const { currentTime, timestampBatch } = useAppSelector((state) => state.time);
  const { gamesPlayed } = useAppSelector((state) => state.games);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.time}>
        <li>
          <strong>Game stats</strong>
        </li>
        <li title="Total Time">
          <TimeIcon /> Total Time: {currentTime}
        </li>
        {timestampBatch !== 0 && (
          <li title="Time first batch got delivered">
            <FirstTimeIcon /> 1st batch: {timestampBatch}
          </li>
        )}
      </ul>
      {/* Todo this should be separate component */}
      {gamesPlayed.map(
        (
          game: { timeAllCompleted: number; timeBatchCompleted: number },
          index: number
        ) => {
          return (
            <>
              <ul className={styles.time}>
                <li title="Time all batches got delivered">
                  <strong>Game no. {index + 1}</strong>
                </li>
                <li title="Total Time">
                  <TimeIcon /> Total time: {formatTime(game.timeAllCompleted)}{" "}
                </li>
                <li title="Time first batch got delivered">
                  <FirstTimeIcon /> 1st batch:{" "}
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
