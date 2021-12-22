import { useEffect, useState } from "react";
import gameService from "../services/gameService";
import socketService from "../services/socketService";

function Admin() {
  const [code, setCode] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);

  const connectSocket = async () => {
    await socketService
      .connect(`${process.env.REACT_APP_PUBLIC_URL}:9000/admin`)
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

  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <div className="App">
      <h1>Hello Admin!</h1>
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
        </div>
      </main>
    </div>
  );
}

export default Admin;
