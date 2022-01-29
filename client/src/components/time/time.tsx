import { useAppSelector } from "../../store/hooks";

import styles from "./time.module.scss";

function Time() {
  const { currentTime, timestampBatch } = useAppSelector((state) => state.time);

  return (
    <ul className={styles.wrapper}>
      <li>Time since game started: {currentTime}</li>
      {timestampBatch !== 0 && (
        <li>Time first batch got delivered: {timestampBatch}</li>
      )}
    </ul>
  );
}

export default Time;
