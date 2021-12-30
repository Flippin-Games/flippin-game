import { useEffect, useState } from "react";

import Game from "../components/game/game";
import JoinRoom from "../components/joinRoom/joinRoom";
import Header from "../components/header/header";
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
  const [settings, setSettings] = useState({}); // TODO do i need it in context?

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
    settings,
    setSettings,
  };

  const handleGameUpdate = () => {
    if (socketService.socket) {
      gameService.onGameUpdate(socketService.socket, updateContext);
    }
  };

  // TODO fix any
  const updateContext = (state: any) => {
    setUsers(state.users);
    setCounter(state.counter);
    setSettings(state.settings);
  };

  useEffect(() => {
    handleGameUpdate();
    // TODO return () => {
    //   cleanup
    // }
  }, []);

  useEffect(() => {
    console.log(gameContextValue);
    // TODO return () => {
    //   cleanup
    // }
  }, [gameContextValue]);

  useEffect(() => {
    const currentUserIndex = gameContextValue.users.findIndex(
      (user) => user.username === gameContextValue.username
    );

    const isFirst = currentUserIndex === 0;

    if (!isFirst) {
      const previousUser = gameContextValue.users[currentUserIndex - 1];
      setPerviousUser(previousUser);
    }
  }, [gameContextValue]);

  return (
    <GameContext.Provider value={gameContextValue}>
      <div className="App">
        <Header />
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
