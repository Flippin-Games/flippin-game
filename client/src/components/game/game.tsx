import { MouseEvent, useState, useContext } from "react";
import gameContext from "../../gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";
import styles from "./game.module.css";

interface IGame {
  name?: any;
  activeUser: boolean;
  localCounter: number;
  counter: number;
  flipped: number;
  previousUser: any; // TODO fix
}

function Game(props: IGame) {
  // const [isActive, setIsActive] = useState<boolean>(true);
  const { username } = useContext(gameContext);
  // const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
  //   // setCounter(counter + 1);
  //   console.log("=== in handle click ===");

  //   if (socketService.socket) {
  //     gameService.updateGame(socketService.socket);
  //   }
  // };

  const handleLocalCounter = (e: MouseEvent<HTMLButtonElement>) => {
    if (socketService.socket) {
      gameService.updateLocalCounter(socketService.socket, username);
    }
  };

  const handleTakeCoins = (e: MouseEvent<HTMLButtonElement>) => {
    // if (socketService.socket) {
    //   gameService.updateLocalCounter(socketService.socket, username);
    // }
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
      {/* <p>{props.counter}</p>
      {props.activeUser && (
        <button onClick={handleClick}>global counter +</button>
      )} */}
      {/* TODO take this out */}
      {props.previousUser?.username && props.activeUser && (
        <>
          {/* <div>
            User in front of me: {props.previousUser.username} has{" "}
            {props.previousUser?.flipped} flipped coins
          </div> */}
          {props.previousUser?.flipped >= 5 && (
            <button onClick={handleTakeCoins}>
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
          <button onClick={handleLocalCounter}>Flip Coin</button>
        ) : null}
      </div>
    </div>
  );
}

export default Game;
