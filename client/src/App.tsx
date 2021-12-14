import { useEffect, useState } from "react";
import "./App.css";
import Game from "./components/game/game";
import JoinRoom from "./components/joinRoom/joinRoom";
import GameContext, { IGameContextProps } from "./gameContext";
import socketService from "./services/socketService";

function App() {
  const [isInRoom, setIsInRoom] = useState(false);
  const [counter, setCounter] = useState<number>(0);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);

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
  };

  // useEffect(() => {
  //   console.log(gameContextValue);
  //   console.log(gameContextValue.users);
  // }, [gameContextValue]);

  return (
    <GameContext.Provider value={gameContextValue}>
      <div className="App">
        <header></header>
        <main className="App-header">
          <h1>Hello Agile Penny 👋</h1>
          {!isInRoom ? (
            <JoinRoom />
          ) : (
            gameContextValue.users?.map((user) => (
              <div>
                <p>{user}</p>
                <Game
                  name={user}
                  activeUser={user === gameContextValue.username}
                />
              </div>
            ))
          )}
        </main>
      </div>
    </GameContext.Provider>
  );
}

export default App;
