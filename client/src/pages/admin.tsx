import { useEffect, useState } from "react";
import gameService from "../services/gameService";
import socketService from "../services/socketService";

function Admin() {
  const [code, setCode] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [startAmount, setStartAmount] = useState<number>(20);
  const [batchSize, setBatchSize] = useState<number>(5);
  const [autoMoveCoins, setAutoMoveCoins] = useState<boolean>(false);

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
    const settings = { startAmount, autoMoveCoins, batchSize };
    if (!socket) return;

    const hasStarted = await gameService
      .startGame(socket, code, settings)
      .catch((error) => alert(error));

    if (hasStarted) {
      setStarted(hasStarted);
    }
  };

  const handleEndGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code && socketService.socket) {
      gameService.endGame(socketService.socket, code);
    }
  };

  const handleGameUpdate = () => {
    if (socketService.socket) {
      gameService.onGameUpdate(socketService.socket, updateContext);
    }
  };

  // using any as I couldn't access dataset
  const handleRemove = (e: any) => {
    e.preventDefault();
    if (socketService.socket) {
      gameService.removeUser(
        socketService.socket,
        code,
        e.target.dataset.username
      );
    }
  };

  // TODO fix any
  const updateContext = (state: any) => {
    setUsers(state.users);
  };

  const handleBatchSize = (e: any) => {
    setBatchSize(parseInt(e.target.value));
  };

  const handleStartAmount = (e: any) => {
    setStartAmount(parseInt(e.target.value));
  };

  const handleAutoMoveCoins = (e: any) => {
    setAutoMoveCoins(!autoMoveCoins);
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
          {!code && code.length === 0 && (
            <button
              type="submit"
              onClick={handleGenerateRoom}
              disabled={code.length > 0}
              className="btn btn-primary"
            >
              Generate Room
            </button>
          )}
          {code && (
            <>
              <h2>Your room ID: {code}</h2>
              {/* // TODO form as separate component, card as it's wrapper */}
              <form onSubmit={handleStartGame}>
                <div>
                  <label htmlFor="startAmount">
                    Enter start amount of coins:
                  </label>
                  <input
                    id="startAmount"
                    type="number"
                    value={startAmount}
                    onChange={handleStartAmount}
                  />
                </div>
                <div>
                  <label htmlFor="batchSize">Enter start batch size:</label>
                  <input
                    id="batchSize"
                    type="number"
                    value={batchSize}
                    onChange={handleBatchSize}
                  />
                </div>
                <div>
                  <label htmlFor="autoMoveCoins">
                    Auto move coins to next user:
                  </label>
                  <input
                    id="autoMoveCoins"
                    type="checkbox"
                    checked={autoMoveCoins}
                    onChange={handleAutoMoveCoins}
                  />
                </div>
                <button
                  type="submit"
                  disabled={started}
                  className="btn btn-primary"
                >
                  Start Game
                </button>

                {started && (
                  <button
                    type="submit"
                    onClick={handleEndGame}
                    className="btn btn-primary"
                  >
                    End Game
                  </button>
                )}
              </form>
            </>
          )}

          {users && (
            <ol>
              {users.map((user) => (
                <li key={user.username}>
                  {user.username}
                  <button
                    data-username={user.username}
                    onClick={handleRemove}
                    className="btn btn-primary"
                  >
                    Remove
                  </button>
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
