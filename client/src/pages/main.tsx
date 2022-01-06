import { useEffect, useReducer, useMemo } from "react";

import GameContext, { defaultState } from "../gameContext";
import mainReducer from "../helpers/mainReducer";
import gameService from "../services/gameService";
import socketService from "../services/socketService";

import Game from "../components/game/game";
import JoinRoom from "../components/joinRoom/joinRoom";
import Header from "../components/header/header";

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
    if (backendState.time && backendState.time !== state.time) {
      console.log(backendState.time, state.time);
      dispatch({
        type: "time",
        data: backendState.time,
      });
    }
    if (backendState?.timestamp && backendState.timestamp !== state.timestamp) {
      dispatch({
        type: "timestamp",
        data: backendState.timestamp,
      });
    }
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
        {state?.time ? (
          <>
            <h2>Time since game started: {state?.time}</h2>
            <h2>Time first batch got delivered: {state?.timestamp}</h2>
          </>
        ) : null}
        <main className="App-header">
          {/* TODO something feels wrong here with passing whole context here*/}
          {!state.isInRoom ? (
            <JoinRoom />
          ) : (
            state.users?.map((user: any) => (
              <Game
                key={user.username}
                counter={state.counter}
                localCounter={user.localCounter}
                flipped={user.flipped}
                name={user.username}
                activeUser={user.username === state.username}
                previousUser={state.previousUser}
              />
            ))
          )}
        </main>
      </div>
    </GameContext.Provider>
  );
}

export default Main;
