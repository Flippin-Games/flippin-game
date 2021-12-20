import { useEffect, useState } from "react";

import Game from "../components/game/game";
import JoinRoom from "../components/joinRoom/joinRoom";
import GameContext, { IGameContextProps } from "../gameContext";
import gameService from "../services/gameService";
import socketService from "../services/socketService";

function Main() {
  const [isInRoom, setIsInRoom] = useState(false);
  const [counter, setCounter] = useState<number>(0);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [localCounter, setLocalCounter] = useState<number>(0);

  const connectSocket = async () => {
    const socket = await socketService
      .connect("http://localhost:9000")
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  useEffect(() => {
    connectSocket();
  }, []);

  // TODO: useMemo
  const gameContextValue: IGameContextProps = {
    isInRoom,
    setIsInRoom,
    counter,
    setCounter,
    username,
    setUsername,
    users,
    setUsers,
    localCounter,
    setLocalCounter,
  };

  const handleGameUpdate = () => {
    console.log("=== in handle game update ===");
    if (socketService.socket) {
      gameService.onGameUpdate(socketService.socket, updateContext);
    }
  };

  // TODO fix any
  const updateContext = (state: any) => {
    console.log(state);
    setUsers(state.users);
    setCounter(state.counter);
  };

  useEffect(() => {
    handleGameUpdate();
    // TODO return () => {
    //   cleanup
    // }
  }, []);

  // useEffect(() => {
  //   console.log(gameContextValue);
  //   console.log(gameContextValue.users);
  // }, [gameContextValue]);

  return (
    <GameContext.Provider value={gameContextValue}>
      <div className="App">
        <header>
          <h1>Hello Agile Penny 👋</h1>
        </header>
        <main className="App-header">
          {!isInRoom ? (
            <JoinRoom />
          ) : (
            gameContextValue.users?.map((user) => (
              <Game
                counter={gameContextValue.counter}
                localCounter={user.localCounter}
                name={user.username}
                activeUser={user.username === gameContextValue.username}
              />
            ))
          )}
        </main>
      </div>
    </GameContext.Provider>
  );
}

export default Main;
