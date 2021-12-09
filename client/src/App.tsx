import { useEffect, useState } from "react";
import "./App.css";
import JoinRoom from "./components/joinRoom/joinRoom";
import GameContext, { IGameContextProps } from "./gameContext";
import socketService from "./services/socketService";

function App() {
  const [isInRoom, setIsInRoom] = useState(false);

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

  const gameConextValue: IGameContextProps = {
    isInRoom,
    setIsInRoom,
  };

  return (
    <GameContext.Provider value={gameConextValue}>
      <div className="App">
        <header></header>
        <main className="App-header">
          <h1>Hello Agile Penny 👋</h1>
          <JoinRoom />
        </main>
      </div>
    </GameContext.Provider>
  );
}

export default App;
