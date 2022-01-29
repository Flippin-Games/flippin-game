import styles from "./coins.module.scss";

import { memo } from "react";

// TODO
function Coin({ flip, flipped }: any) {
  return (
    <span
      className={`${styles.coin} ${flip ? styles.flip : ""} ${
        flipped ? styles.flipped : ""
      }`}
    ></span>
  );
}

export default memo(Coin);
