import { useEffect, useReducer, useMemo, useState } from "react";

import GameContext, { defaultState } from "../gameContext";
import DispatchContext from "../dispatchContext";
import mainReducer from "../helpers/mainReducer";
import gameService from "../services/gameService";
import socketService from "../services/socketService";

import JoinRoom from "../components/joinRoom/joinRoom";
import Header from "../components/header/header";
import Game from "../components/game/game";
import GameInfo from "../components/gameInfo/gameInfo";
import Footer from "../components/footer/footer";

import { BackendState } from "../helpers/types";

const DefaultBackendState = {
  isInRoom: false,
  counter: 0,
  localCounter: 0,
  username: "",
  users: [],
  settings: {
    autoMoveCoins: false,
    amountOfBatches: 4,
    batchSize: 5,
    startAmount: 20,
  },
  time: {
    currentTime: 0,
    timestampBatch: 0,
    timestampFive: 0,
  },
};

function Main() {
  const [backendState, setBackendState] =
    useState<BackendState>(DefaultBackendState);
  console.log("Main RERENDER");
  const [state, dispatch] = useReducer(mainReducer, defaultState);

  const contextValue = useMemo(() => {
    return { state };
  }, [state]);

  const dispatchValue = useMemo(() => {
    return { dispatch };
  }, [dispatch]);

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
      gameService.onGameUpdate(socketService.socket, setBackendState as any);
    }
  };

  useEffect(() => {
    updateContext();
  }, [backendState]);

  // TODO fix any
  const updateContext = () => {
    console.log(
      JSON.stringify(backendState.users),
      JSON.stringify(state.users)
    );
    if (
      backendState.users &&
      JSON.stringify(backendState.users) !== JSON.stringify(state.users)
    ) {
      dispatch({
        type: "users",
        data: backendState.users,
      });
    }
    if (
      backendState.settings &&
      JSON.stringify(backendState.settings) !== JSON.stringify(state.settings)
    ) {
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
    if (
      backendState?.time.timestampFive &&
      backendState.time.timestampFive !== state.timestampFive
    ) {
      dispatch({
        type: "timestampFive",
        data: backendState.time.timestampFive,
      });
    }

    console.log(state);
  };

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
      <DispatchContext.Provider value={dispatchValue}>
        <div className="App">
          {!state.isInRoom ? <Header /> : <GameInfo />}
          <main className="main">
            {!state.isInRoom ? (
              <JoinRoom />
            ) : (
              <Game
                users={state.users}
                counter={state.counter}
                previousUser={state.previousUser}
                username={state.username}
              />
            )}
          </main>
          <Footer />
        </div>
      </DispatchContext.Provider>
    </GameContext.Provider>
  );
}

export default Main;
