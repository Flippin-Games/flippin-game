import { MouseEvent, useContext } from "react";

import gameContext from "../../gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";

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
  const { state } = useContext(gameContext);
  const { username, settings } = state;

  const handleLocalCounter = (e: MouseEvent<HTMLButtonElement>) => {
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
        <button onClick={handleTakeCoins} className="btn btn-primary btn-s">
          Take Coins
        </button>
      ) : (
        <div className={styles.placeholder} />
      )}
      <hr />
      <div>
        <p>
          To flip: {props.localCounter} | Flipped: {props.flipped}
        </p>
        {props.activeUser && props.localCounter ? (
          <button
            onClick={handleLocalCounter}
            className="btn btn-primary btn-s"
          >
            Flip Coin
          </button>
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>
    </div>
  );
}

export default PlayerCard;
