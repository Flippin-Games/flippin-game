import Button from "../button/button";
import styles from "./coins.module.scss";

// TODO
function Coins({ toFlip, flipped, clickHandler, isFliping }: any) {
  const Coin = ({ flip, flipped }: any) => (
    <span
      className={`${styles.coin} ${flip ? styles.flip : ""} ${
        flipped ? styles.flipped : ""
      }`}
    ></span>
  );

  console.log("Coins Rerender");

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

export default Coins;
