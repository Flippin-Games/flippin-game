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
  const [previousUser, setPerviousUser] = useState({}); // TODO do i need it in context?

  const connectSocket = async () => {
    console.log(process.env.REACT_APP_PUBLIC_URL);
    const socket = await socketService
      .connect(`${process.env.REACT_APP_PUBLIC_URL}:9000`)
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
    setUsers(state.users);
    setCounter(state.counter);
  };

  useEffect(() => {
    handleGameUpdate();
    // TODO return () => {
    //   cleanup
    // }
  }, []);

  useEffect(() => {
    const currentUserIndex = gameContextValue.users.findIndex(
      (user) => user.username === gameContextValue.username
    );

    const isFirst = currentUserIndex === 0;

    if (!isFirst) {
      const previousUser = gameContextValue.users[currentUserIndex - 1];
      setPerviousUser(previousUser);
    }

    console.log(gameContextValue.users);
  }, [gameContextValue]);

  return (
    <GameContext.Provider value={gameContextValue}>
      <div className="App">
        <header>
          <h1>Hello Agile Penny 👋</h1>
        </header>
        <main className="App-header">
          {/* TODO something feels wrong here with passing whole context here*/}
          {!isInRoom ? (
            <JoinRoom />
          ) : (
            gameContextValue.users?.map((user) => (
              <Game
                key={user.username}
                counter={gameContextValue.counter}
                localCounter={user.localCounter}
                flipped={user.flipped}
                name={user.username}
                activeUser={user.username === gameContextValue.username}
                previousUser={previousUser}
              />
            ))
          )}
        </main>
      </div>
    </GameContext.Provider>
  );
}

export default Main;
