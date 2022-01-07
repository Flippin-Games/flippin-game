import { useEffect, useReducer, useMemo } from "react";

import GameContext, { defaultState } from "../gameContext";
import mainReducer from "../helpers/mainReducer";
import gameService from "../services/gameService";
import socketService from "../services/socketService";

import JoinRoom from "../components/joinRoom/joinRoom";
import Header from "../components/header/header";
import Game from "../components/game/game";
import Time from "../components/time/time";

function Main() {
  const [state, dispatch] = useReducer(mainReducer, defaultState);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  const connectSocket = async () => {
    await socketService
      .connect(`${process.env.REACT_APP_PUBLIC_URL}:9000`)
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  useEffect(() => {
    connectSocket();
  }, []);

  const handleGameUpdate = () => {
    if (socketService.socket) {
      gameService.onGameUpdate(socketService.socket, updateContext);
    }
  };

  // TODO fix any
  const updateContext = (backendState: any) => {
    console.log(backendState);
    if (backendState.users) {
      dispatch({
        type: "users",
        data: backendState.users,
      });
    }
    if (backendState.settings) {
      dispatch({
        type: "settings",
        data: backendState.settings,
      });
    }
    if (backendState.counter && backendState.counter !== state.counter) {
      dispatch({
        type: "counter",
        data: backendState.counter,
      });
    }
    if (
      backendState.time.currentTime &&
      backendState.time.currentTime !== state.currentTime
    ) {
      console.log(backendState.time.currentTime, state.currentTime);
      dispatch({
        type: "currentTime",
        data: backendState.time.currentTime,
      });
    }
    if (
      backendState?.time.timestampBatch &&
      backendState.time.timestampBatch !== state.timestampBatch
    ) {
      dispatch({
        type: "timestampBatch",
        data: backendState.time.timestampBatch,
      });
    }

    console.log(state);
  };

  useEffect(() => {
    handleGameUpdate();
  }, []);

  useEffect(() => {
    if (!state.users?.length) return;
    const currentUserIndex = state.users.findIndex(
      (user: any) => user.username === state.username
    );

    const isFirst = currentUserIndex === 0;

    if (!isFirst) {
      const previousUser = state.users[currentUserIndex - 1];
      dispatch({
        type: "previousUser",
        data: previousUser,
      });
    }
  }, [state.users, state.username]);

  return (
    <GameContext.Provider value={contextValue}>
      <div className="App">
        <Header />
        {state?.currentTime ? <Time /> : null}
        <main className="App-header">
          {!state.isInRoom ? <JoinRoom /> : <Game />}
        </main>
      </div>
    </GameContext.Provider>
  );
}

export default Main;
