import { MouseEvent, useContext } from "react";
import gameContext from "../../gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";
import styles from "./game.module.scss";

interface IGame {
  name?: any;
  activeUser: boolean;
  localCounter: number;
  counter: number;
  flipped: number;
  previousUser: any; // TODO fix
}

function Game(props: IGame) {
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

  return (
    <div className={styles.wrapper}>
      <h1>{props.name || username}</h1>

      {/* TODO take this out, it looks like a mess */}
      {props.previousUser?.username && props.activeUser && (
        <>
          {props.previousUser?.flipped >= settings.batchSize &&
            !settings.autoMoveCoins && (
              <button onClick={handleTakeCoins} className="btn btn-primary">
                Take coins from {props.previousUser.username}
              </button>
            )}
        </>
      )}
      <hr />
      <div>
        <p>
          To flip: {props.localCounter} | Flipped: {props.flipped}
        </p>
        {props.activeUser && props.localCounter ? (
          <button onClick={handleLocalCounter} className="btn btn-primary">
            Flip Coin
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Game;
