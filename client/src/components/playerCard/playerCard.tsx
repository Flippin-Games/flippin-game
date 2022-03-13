import { MouseEvent, useState, memo } from "react";

import { useAppSelector } from "../../store/hooks";

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
  areUsersBeforeMeFlipping: boolean;
};

function PlayerCard(props: TGame) {
  const { settings } = useAppSelector((state) => state.settings);
  const { username } = useAppSelector((state) => state.local);
  const [isFliping, setIsFlipping] = useState(false);

  const handleLocalCounter = (e: MouseEvent<HTMLButtonElement>) => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipping(false);
      if (socketService.socket) {
        gameService.updateLocalCounter(socketService.socket, username);
      }
    }, 1700);
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
    !settings.autoMoveCoins &&
    props.previousUser?.flipped >= settings.batchSize;

  return (
    <div className={styles.wrapper}>
      <h1>{props.name || username}</h1>

      {props.activeUser &&
        isPreviousUserAvailable &&
        props.areUsersBeforeMeFlipping && (
          <Button
            type="button"
            onClick={handleTakeCoins}
            className="btn-primary btn-s"
            text="Take Coins"
            disabledText={`Wait for ${props.previousUser?.username}`}
            disabled={!shouldDisplayButton}
          />
        )}
      <div>
        <Coins
          toFlip={props.localCounter}
          flipped={props.flipped}
          clickHandler={handleLocalCounter}
          isFliping={isFliping}
          isActiveUser={props.activeUser}
        />
        <p>
          To flip: {props.localCounter} | Flipped: {props.flipped}
        </p>
      </div>
    </div>
  );
}

export default memo(PlayerCard);
