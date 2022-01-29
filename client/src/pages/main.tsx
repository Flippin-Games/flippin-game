import { useEffect, useRef } from "react";

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
  setTimestampFive,
} from "../store/features/time-slice";
import { setUsers } from "../store/features/users-slice";
import { setSettings } from "../store/features/settings-slice";
import { setCounter, setPreviousUser } from "../store/features/local-slice";

function Main() {
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
    // usign ref to make sure it always checks current value, not init one
    const users = stateRef.current;
    const settings = settingsRef.current;
    const { time } = backendState;

    if (
      backendState.users &&
      JSON.stringify(backendState.users) !== JSON.stringify(users)
    ) {
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
    if (time.currentTime) {
      dispatchRedux(
        setCurrentTime(new Date(time.currentTime).toISOString().substr(11, 8))
      );
    }
    if (time.timestampBatch) {
      dispatchRedux(
        setTimestampBatch(
          new Date(time.timestampBatch).toISOString().substr(11, 8)
        )
      );
    }
    if (time.timestampFive) {
      dispatchRedux(
        setTimestampFive(
          new Date(time.timestampBatch).toISOString().substr(11, 8)
        )
      );
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
