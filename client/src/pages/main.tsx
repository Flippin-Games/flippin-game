import { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import gameService from "../services/gameService";
import socketService from "../services/socketService";

import JoinRoom from "../components/joinRoom/joinRoom";
import Header from "../components/header/header";
import Game from "../components/game/game";
import GameInfo from "../components/gameInfo/gameInfo";
import Footer from "../components/footer/footer";

import {
  setCurrentTime,
  setTimestampBatch,
} from "../store/features/time-slice";
import { setUsers } from "../store/features/users-slice";
import { setSettings } from "../store/features/settings-slice";
import { setCounter, setPreviousUser } from "../store/features/local-slice";
import { setGamesPlayed } from "../store/features/games-slice";
// import { setIsPlaying } from "../store/features/admin-slice";
import formatTime from "../utils/formatTime";
// import Snackbar from "../components/snackbar/snackbar";

function Main({ isAdmin = false }) {
  const dispatchRedux = useAppDispatch();
  const { settings } = useAppSelector((state) => state.settings);
  // const { isPlaying } = useAppSelector((state) => state.admin);
  const { counter, isInRoom, username, previousUser } = useAppSelector(
    (state) => state.local
  );
  const { users } = useAppSelector((state) => state.users);
  const { gamesPlayed } = useAppSelector((state) => state.games);
  const stateRef = useRef();
  stateRef.current = users;
  const settingsRef = useRef();
  settingsRef.current = settings;
  const gamesPlayedRef = useRef();
  gamesPlayedRef.current = gamesPlayed;
  // const isPlayingRef = useRef();
  // isPlayingRef.current = gamesPlayed;

  const connectSocket = async () => {
    await socketService
      .connect(`${process.env.REACT_APP_PUBLIC_URL}`)
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  useEffect(() => {
    connectSocket();
    handleGameUpdate();
  }, []);

  const handleGameUpdate = () => {
    if (socketService.socket) {
      gameService.onGameUpdate(socketService.socket, updateContext);
    }
  };

  // TODO fix any
  function updateContext(backendState: any) {
    // usign ref to make sure it always checks current value, not init one
    // const users = stateRef.current;
    const settings = settingsRef.current;
    const { time } = backendState;
    const gamesPlayed = gamesPlayedRef.current;

    // TODO snackbar
    // if (backendState.isPlaying !== isPlaying) {
    //   dispatchRedux(setIsPlaying(backendState.isPlaying));
    // }

    // todo I removed check and now it's updating more often
    if (backendState.users) {
      dispatchRedux(setUsers(backendState.users));
    }
    if (
      backendState.settings &&
      JSON.stringify(backendState.settings) !== JSON.stringify(settings)
    ) {
      dispatchRedux(setSettings(backendState.settings));
    }
    if (backendState.counter && backendState.counter !== counter) {
      dispatchRedux(setCounter(backendState.counter));
    }

    if (
      backendState.gamesPlayed &&
      JSON.stringify(backendState.gamesPlayed) !== JSON.stringify(gamesPlayed)
    ) {
      dispatchRedux(setGamesPlayed(backendState.gamesPlayed));
    }

    // TODO add check to update time only if it's different than current time
    dispatchRedux(setCurrentTime(formatTime(time.currentTime)));

    dispatchRedux(setTimestampBatch(formatTime(time.timestampBatch)));
  }

  useEffect(() => {
    if (!users?.length) return;

    const currentUserIndex = users.findIndex(
      (user: any) => user.username === username
    );

    const isFirst = currentUserIndex === 0;

    if (!isFirst) {
      const previousUser = users[currentUserIndex - 1];

      dispatchRedux(setPreviousUser(previousUser));
    }
  }, [users, username]);

  return (
    <div className="App">
      {!isInRoom && !isAdmin ? <Header /> : <GameInfo />}
      {/* TODO get proper message from backend, display when it changes */}
      {/* {isPlaying ? (
        <Snackbar message="Coins given to the first user!" />
      ) : (
        <Snackbar message="Game ended!" />
      )} */}
      <main className="main">
        {!isInRoom && !isAdmin ? (
          <JoinRoom />
        ) : (
          <Game
            users={users}
            counter={counter}
            previousUser={previousUser}
            username={username}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Main;
