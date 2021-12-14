import { MouseEvent, useState, useEffect, useContext } from "react";
import gameContext from "../../gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";
import styles from "./game.module.css";

interface IGame {
  name?: any;
}

function Game(props: IGame) {
  const [isActive, setIsActive] = useState<boolean>(true);
  const { counter, setCounter, username, setUsers } = useContext(gameContext);
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setCounter(counter + 1);
    console.log("=== in handle click ===", counter);

    if (socketService.socket) {
      gameService.updateGame(socketService.socket, counter + 1);
    }
  };

  const handleGameUpdate = () => {
    console.log("=== in handle game update ===");
    if (socketService.socket) {
      gameService.onGameUpdate(socketService.socket, updateContext);
    }
  };

  // TODO: change that "any"
  const updateContext = (newCounterValue: number, users: []) => {
    console.log("setting counter to: ", newCounterValue);
    console.log("users: ", users);
    setUsers(users);
    setCounter(newCounterValue);
  };

  useEffect(() => {
    handleGameUpdate();
    // TODO return () => {
    //   cleanup
    // }
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1>Hello {props.name || username}</h1>
      <p>{counter}</p>
      <button onClick={handleClick} disabled={!isActive}>
        Click on me
      </button>
    </div>
  );
}

export default Game;
