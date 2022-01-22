import { MouseEvent, useContext, useState, memo } from "react";

import { useAppSelector } from "../../store/hooks";

// import gameContext from "../../gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";
import Button from "../button/button";
import Coins from "../coins/coins";

import styles from "./playerCard.module.scss";

type TGame = {
  name?: any;
  activeUser: boolean;
  localCounter: number;
  counter: number;
  flipped: number;
  previousUser: any; // TODO fix
};

function PlayerCard(props: TGame) {
  const { settings } = useAppSelector((state) => state.settings);
  const { username } = useAppSelector((state) => state.local);
  const [isFliping, setIsFlipping] = useState(false);

  const handleLocalCounter = (e: MouseEvent<HTMLButtonElement>) => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipping(false);
    }, 1700);
    if (socketService.socket) {
      gameService.updateLocalCounter(socketService.socket, username);
    }
  };

  const handleTakeCoins = (e: MouseEvent<HTMLButtonElement>) => {
    if (socketService.socket) {
      gameService.takeCoins(
        socketService.socket,
        props.previousUser.username,
        username
      );
    }
  };

  const isPreviousUserAvailable = !!props.previousUser?.username.length;
  const shouldDisplayButton =
    props.activeUser &&
    isPreviousUserAvailable &&
    props.previousUser?.flipped >= settings.batchSize &&
    !settings.autoMoveCoins;

  return (
    <div className={styles.wrapper}>
      <h1>{props.name || username}</h1>

      {/* TODO take this out, it looks like a mess */}
      {shouldDisplayButton ? (
        <Button
          type="button"
          onClick={handleTakeCoins}
          className="btn-primary btn-s"
          text="Take Coins"
        />
      ) : (
        <div className={styles.placeholder} />
      )}
      <div>
        {props.activeUser ? (
          <Coins
            toFlip={props.localCounter}
            flipped={props.flipped}
            clickHandler={handleLocalCounter}
            isFliping={isFliping}
          />
        ) : null}
        <p>
          To flip: {props.localCounter} | Flipped: {props.flipped}
        </p>
        {/* {props.activeUser && props.localCounter ? (
          <Button
            type="button"
            onClick={handleLocalCounter}
            className="btn btn-primary btn-s"
            text="Flip Coin"
          />
        ) : (
          <div className={styles.placeholder} />
        )} */}
      </div>
    </div>
  );
}

export default memo(PlayerCard);
