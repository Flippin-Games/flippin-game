import { useEffect, useState } from "react";
import gameService from "../services/gameService";
import socketService from "../services/socketService";

function Admin() {
  const [code, setCode] = useState("");
  const connectSocket = async () => {
    const socket = await socketService
      .connect("http://localhost:9000/admin")
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();
    const socket = socketService.socket;
    if (!socket) return;

    const room = await gameService.createRoom(socket);
    setCode(room);
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
            onClick={handleClick}
            disabled={code.length > 0}
          >
            Generate Room
          </button>
          <h2>{code}</h2>
        </div>
      </main>
    </div>
  );
}

export default Admin;
