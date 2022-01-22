import { useState } from "react";
import Button from "../components/button/button";
import styles from "./coins.module.scss";

function Coins() {
  const [amountOfCoins, setAmountOfCoins] = useState(20);

  const [isFliping, setIsFlipping] = useState(false);
  const [flipped, setFlipped] = useState(0);

  const flipHandler = () => {
    setAmountOfCoins(amountOfCoins - 1);
    setIsFlipping(true);
    setTimeout(() => {
      setFlipped(flipped + 1);
      setIsFlipping(false);
    }, 1700);
  };

  const Coin = ({ flip, flipped }: any) => (
    <span
      className={`${styles.coin} ${flip ? styles.flip : ""} ${
        flipped ? styles.flipped : ""
      }`}
    ></span>
  );

  return (
    <>
      <h1>Hello Coins</h1>
      <div className={styles.wrapper}>
        <div className={styles.box}>
          {Array(amountOfCoins)
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
      {amountOfCoins > 0 ? (
        <Button
          type="button"
          onClick={flipHandler}
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
