import { useEffect, useState } from "react";
import gameService from "../services/gameService";
import socketService from "../services/socketService";
import { io, Socket } from "socket.io-client";

function Admin() {
  const [code, setCode] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);

  const connectSocket = async () => {
    await socketService
      .connect(`${process.env.REACT_APP_PUBLIC_URL}:9000`)
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const handleGenerateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const socket = socketService.socket;
    if (!socket) return;

    // TODO: handle errors
    const room = await gameService.createRoom(socket);
    setCode(room);
  };

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault();
    const socket = socketService.socket;
    if (!socket) return;

    const hasStarted = await gameService
      .startGame(socket, code)
      .catch((error) => alert(error));

    if (hasStarted) {
      setStarted(hasStarted);
    }
  };

  const handleGameUpdate = () => {
    if (socketService.socket) {
      gameService.onGameUpdate(socketService.socket, updateContext);
    }
  };

  const handleRemove = () => {
    console.log("Remove user");
  };

  // TODO fix any
  const updateContext = (state: any) => {
    setUsers(state.users);
  };

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    handleGameUpdate();
  }, []);

  return (
    <div className="App">
      <nav>
        <h1>Hello Admin!</h1>
      </nav>
      <main className="App-header">
        <div>
          <button
            type="submit"
            onClick={handleGenerateRoom}
            disabled={code.length > 0}
          >
            Generate Room
          </button>
          <h2>{code}</h2>
          {code && (
            <button type="submit" onClick={handleStartGame} disabled={started}>
              Start Game
            </button>
          )}
          {users && (
            <ol>
              {users.map((user) => (
                <li>
                  {user.username} <button onClick={handleRemove}>Remove</button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
    </div>
  );
}

export default Admin;
