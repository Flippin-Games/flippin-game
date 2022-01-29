import { memo } from "react";

import Button from "../button/button";
import styles from "./coins.module.scss";
import Coin from "./coin";

// TODO
function Coins({ toFlip, flipped, clickHandler, isFliping }: any) {
  console.log("rerenfer coind ====");
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.box}>
          {Array(toFlip)
            .fill(0)
            .map(() => (
              <Coin />
            ))}
        </div>
        <div className={styles.box}>
          {Array(flipped)
            .fill(0)
            .map(() => (
              <Coin flipped={true} />
            ))}
        </div>
        {isFliping ? (
          <div className={styles.flippingBox}>
            <Coin flip={true} />
          </div>
        ) : null}
      </div>
      {toFlip > 0 ? (
        <Button
          type="button"
          onClick={clickHandler}
          text="Flip"
          disabled={isFliping}
          disabledText="Flipping..."
          className="btn-primary"
        />
      ) : null}
    </>
  );
}

export default memo(Coins);
