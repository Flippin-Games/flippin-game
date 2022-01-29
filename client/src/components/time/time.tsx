import { useAppSelector } from "../../store/hooks";

import styles from "./time.module.scss";

function Time() {
  const { currentTime, timestampBatch, timestampFive } = useAppSelector(
    (state) => state.time
  );

  return (
    <ul className={styles.wrapper}>
      <li>Time since game started: {currentTime}</li>
      {timestampBatch !== 0 && (
        <li>Time first batch got delivered: {timestampBatch}</li>
      )}
      {timestampFive !== 0 && (
        <li>Time first 5 got delivered: {timestampFive}</li>
      )}
    </ul>
  );
}

export default Time;
