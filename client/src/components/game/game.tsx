import { MouseEvent, useContext } from "react";
import gameContext from "../../gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";
import styles from "./game.module.scss";

// TODO
// restar game
// change options during the game
// add coins to user
interface IGame {
  name?: any;
  activeUser: boolean;
  localCounter: number;
  counter: number;
  flipped: number;
  previousUser: any; // TODO fix
}

function Game(props: IGame) {
  const { username, settings } = useContext(gameContext);

  const handleLocalCounter = (e: MouseEvent<HTMLButtonElement>) => {
    if (socketService.socket) {
      gameService.updateLocalCounter(socketService.socket, username);
    }
  };

  const handleTakeCoins = (e: MouseEvent<HTMLButtonElement>) => {
    console.log("take coins from", props.previousUser.username);

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
