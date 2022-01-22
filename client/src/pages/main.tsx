import { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import gameService from "../services/gameService";
import socketService from "../services/socketService";

import JoinRoom from "../components/joinRoom/joinRoom";
import Header from "../components/header/header";
import Game from "../components/game/game";
import GameInfo from "../components/gameInfo/gameInfo";
import Footer from "../components/footer/footer";

import { BackendState } from "../helpers/types";
import {
  setCurrentTime,
  setTimestampBatch,
  setTimestampFive,
} from "../store/features/time-slice";
import { setUsers } from "../store/features/users-slice";
import { setSettings } from "../store/features/settings-slice";
import { setCounter, setPreviousUser } from "../store/features/local-slice";

function Main() {
  console.log("Main rerender");
  const dispatchRedux = useAppDispatch();
  const { settings } = useAppSelector((state) => state.settings);
  const { counter, isInRoom, username, previousUser } = useAppSelector(
    (state) => state.local
  );
  const { users } = useAppSelector((state) => state.users);
  const stateRef = useRef();
  stateRef.current = users;
  const settingsRef = useRef();
  settingsRef.current = settings;

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
    const users = stateRef.current;
    const settings = settingsRef.current;

    if (
      backendState.users &&
      JSON.stringify(backendState.users) !== JSON.stringify(users)
    ) {
      console.log(1);
      dispatchRedux(setUsers(backendState.users));
    }
    if (
      backendState.settings &&
      JSON.stringify(backendState.settings) !== JSON.stringify(settings)
    ) {
      console.log(2);
      dispatchRedux(setSettings(backendState.settings));
    }
    if (backendState.counter && backendState.counter !== counter) {
      console.log(3);
      dispatchRedux(setCounter(backendState.counter));
    }
    if (backendState.time.currentTime) {
      console.log(4);
      dispatchRedux(setCurrentTime(backendState.time.currentTime));
    }
    if (backendState?.time.timestampBatch) {
      console.log(5);
      dispatchRedux(setTimestampBatch(backendState.time.timestampBatch));
    }
    if (backendState?.time.timestampFive) {
      console.log(6);
      dispatchRedux(setTimestampFive(backendState.time.timestampFive));
    }
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
      console.log(previousUser);
    }
  }, [users, username]);

  return (
    <div className="App">
      {!isInRoom ? <Header /> : <GameInfo />}
      <main className="main">
        {!isInRoom ? (
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
