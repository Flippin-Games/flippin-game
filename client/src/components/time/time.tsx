import { useContext } from "react";
import gameContext from "../../gameContext";

import styles from "./time.module.scss";

function Time() {
  const { state } = useContext(gameContext);

  return (
    <ul className={styles.wrapper}>
      <li>Time since game started: {state.currentTime}</li>
      {state.timestampBatch !== 0 && (
        <li>Time first batch got delivered: {state.timestampBatch}</li>
      )}
      {state.timestampFive !== 0 && (
        <li>Time first 5 got delivered: {state.timestampFive}</li>
      )}
    </ul>
  );
}

export default Time;
