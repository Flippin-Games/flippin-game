import { MouseEvent, useState, useEffect, useContext } from "react";
import gameContext from "../../gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";
import styles from "./game.module.css";

interface IGame {
  name?: any;
  activeUser: boolean;
  localCounter: number;
  counter: number;
}

function Game(props: IGame) {
  const [isActive, setIsActive] = useState<boolean>(true);
  const { username } = useContext(gameContext);
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // setCounter(counter + 1);
    console.log("=== in handle click ===");

    if (socketService.socket) {
      gameService.updateGame(socketService.socket);
    }
  };

  const handleLocalCounter = (e: MouseEvent<HTMLButtonElement>) => {
    if (socketService.socket) {
      gameService.updateLocalCounter(socketService.socket, username);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1>Hello {props.name || username}</h1>
      <p>{props.counter}</p>
      {props.activeUser && (
        <button onClick={handleClick} disabled={!isActive}>
          global counter +
        </button>
      )}
      <div>
        <p>Local Counter: {props.localCounter}</p>
        {props.activeUser && (
          <button onClick={handleLocalCounter} disabled={!isActive}>
            Local Counter
          </button>
        )}
      </div>
    </div>
  );
}

export default Game;
