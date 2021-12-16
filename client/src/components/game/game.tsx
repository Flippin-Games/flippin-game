import { MouseEvent, useState, useEffect, useContext } from "react";
import gameContext from "../../gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";
import styles from "./game.module.css";

interface IGame {
  name?: any;
  activeUser: boolean;
}

function Game(props: IGame) {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [localCounter, setLocalCounter] = useState<number>(0);
  const { counter, setCounter, username, setUsers } = useContext(gameContext);
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setCounter(counter + 1);
    console.log("=== in handle click ===", counter);

    if (socketService.socket) {
      gameService.updateGame(socketService.socket, counter + 1);
    }
  };

  const handleLocalCounter = (e: MouseEvent<HTMLButtonElement>) => {
    setLocalCounter(localCounter + 1);
  };

  const handleGameUpdate = () => {
    console.log("=== in handle game update ===");
    if (socketService.socket) {
      gameService.onGameUpdate(socketService.socket, updateContext);
    }
  };

  const updateContext = (newCounter: number, users: []) => {
    console.log("setting counter to: ", newCounter);
    console.log("users: ", users);
    setUsers(users);
    setCounter(newCounter);
  };

  useEffect(() => {
    handleGameUpdate();
    // TODO return () => {
    //   cleanup
    // }
  }, []);

  useEffect(() => {
    if (localCounter >= 20) {
      if (socketService.socket) {
        gameService.updateLocalCounter(
          socketService.socket,
          localCounter,
          username
        );
      }
    }
  }, [localCounter, username]);

  return (
    <div className={styles.wrapper}>
      <h1>Hello {props.name || username}</h1>
      <p>{counter}</p>
      {props.activeUser && (
        <button onClick={handleClick} disabled={!isActive}>
          global counter +
        </button>
      )}
      <div>
        <p>Local Counter: {localCounter}</p>
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
