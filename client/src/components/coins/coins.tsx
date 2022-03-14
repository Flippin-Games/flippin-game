import { memo } from "react";

import Button from "../button/button";
import styles from "./coins.module.scss";
import Coin from "./coin";

// TODO
function Coins({
  toFlip,
  flipped,
  clickHandler,
  isFliping,
  isActiveUser,
}: any) {
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
      {isActiveUser &&
        (toFlip !== 0 ? (
          <Button
            type="button"
            onClick={clickHandler}
            text="Flip"
            disabled={isFliping}
            disabledText="Flipping..."
            className="btn-primary btn-s"
          />
        ) : (
          <Button
            type="button"
            onClick={() => {}}
            text="Flip"
            disabled={true}
            disabledText="Nothing to flip"
            className="btn-primary btn-s"
          />
        ))}
    </>
  );
}

export default memo(Coins);
