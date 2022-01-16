import { useEffect, useState, useReducer } from "react";

import Button from "../components/button/button";
import SettingsForm from "../components/settingsForm/settingsForm";

import gameService from "../services/gameService";
import socketService from "../services/socketService";

const initialFormState = {
  amountOfBatches: 4,
  batchSize: 5,
  autoMoveCoins: false,
};

const formReducer = (state: any, action: any) => {
  const { data } = action;

  switch (action.type) {
    case "number":
      return {
        ...state,
        [data.name]: parseInt(data.value),
      };
    case "checkbox":
      return {
        ...state,
        [data.name]: !state[data.name],
      };
    case "text":
      return {
        ...state,
        [data.name]: data.value,
      };
    default:
      return state;
  }
};

function Admin() {
  const [roomId, setRoomId] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [formValues, dispatch] = useReducer(formReducer, initialFormState);

  const connectSocket = async () => {
    await socketService
      .connect(`${process.env.REACT_APP_PUBLIC_URL}`)
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const handleChange = (e: any) => {
    dispatch({
      type: e.target.type,
      data: { value: e.target.value, name: e.target.name },
    });
  };

  const handleGenerateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const socket = socketService.socket;
    if (!socket) return;

    // TODO: handle errors
    const room = await gameService.createRoom(socket);
    setRoomId(room);
  };

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault();
    const socket = socketService.socket;
    const settings = formValues;
    if (!socket) return;

    const hasStarted = await gameService
      .startGame(socket, roomId, settings)
      .catch((error) => alert(error));

    if (hasStarted) {
      setStarted(hasStarted);
    }
  };

  const handleEndGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId && socketService.socket) {
      gameService.endGame(socketService.socket, roomId);
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
        roomId,
        e.target.dataset.attr
      );
    }
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
      <main className="main">
        <div>
          {!roomId && roomId.length === 0 && (
            <Button
              type="submit"
              onClick={handleGenerateRoom}
              disabled={roomId.length > 0}
              className="btn-primary"
              text="Generate Room"
            />
          )}

          {roomId && (
            <>
              <h2>Your room ID: {roomId}</h2>
              <SettingsForm
                formValues={formValues}
                handleChange={handleChange}
                handleStartGame={handleStartGame}
                started={started}
              />
            </>
          )}

          {started && (
            <Button
              type="submit"
              onClick={handleEndGame}
              className="btn btn-primary"
              text="End Game"
            />
          )}

          {users && (
            <ol>
              {users.map((user) => (
                <li key={user.username}>
                  {user.username}
                  <Button
                    type="button"
                    dataAtrr={user.username}
                    onClick={handleRemove}
                    className="btn btn-primary"
                    text="Remove"
                  />
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
