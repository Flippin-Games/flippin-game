import { useEffect, useState, useReducer } from "react";

import Button from "../components/button/button";
import SettingsForm from "../components/settingsForm/settingsForm";

import gameService from "../services/gameService";
import socketService from "../services/socketService";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setIsPlaying } from "../store/features/admin-slice";

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
  const [users, setUsers] = useState([]);
  const [formValues, dispatch] = useReducer(formReducer, initialFormState);
  const { isPlaying } = useAppSelector((state) => state.admin);
  const dispatchRedux = useAppDispatch();

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
      console.log(1);
      // setIsPlaying(hasStarted);
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
      gameService.onGameUpdate(socketService.socket, updateState);
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
  const updateState = (state: any) => {
    console.log(state);
    setUsers(state.users);

    console.log(state.isPlaying, isPlaying);

    dispatchRedux(setIsPlaying(state.isPlaying));
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
                isPlaying={isPlaying}
              />
            </>
          )}

          {isPlaying && (
            <Button
              type="submit"
              onClick={handleEndGame}
              className="btn btn-primary"
              text="End Game"
            />
          )}

          {users && (
            <ol>
              {/* {users.map((user) => (
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
              ))} */}
            </ol>
          )}
        </div>
      </main>
    </div>
  );
}

export default Admin;
