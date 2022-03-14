import { useEffect, useState, useReducer } from "react";

import Button from "../components/button/button";
import SettingsForm from "../components/settingsForm/settingsForm";
import UsersList from "../components/usersList/usersList";

import gameService from "../services/gameService";
import socketService from "../services/socketService";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  setCurrentTime,
  setTimestampBatch,
} from "../store/features/time-slice";
import { setIsPlaying } from "../store/features/admin-slice";
import { setIsInRoom } from "../store/features/local-slice";
import { setGamesPlayed } from "../store/features/games-slice";
import formatTime from "../utils/formatTime";

import { setUsers as setUsersRedux } from "../store/features/users-slice";

import styles from "./admin.module.scss";
import Main from "./main";

const initialFormState = {
  amountOfBatches: 1,
  batchSize: 20,
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
    dispatchRedux(setIsInRoom(true));
  };

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault();
    const socket = socketService.socket;
    const settings = formValues;
    if (!socket) return;

    await gameService
      .startGame(socket, roomId, settings)
      .catch((error) => alert(error));
  };

  // const handleEndGame = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (roomId && socketService.socket) {
  //     gameService.endGame(socketService.socket, roomId);
  //   }
  // };

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
    const { time } = state;
    setUsers(state.users);

    // TODO this is kind of repeated in mian.tsx, can I avoid repetition?
    dispatchRedux(setIsPlaying(state.isPlaying));
    if (
      state.users.length &&
      JSON.stringify(state.users) !== JSON.stringify(users)
    ) {
      dispatchRedux(setUsersRedux(state.users));
    }
    if (state.gamesPlayed) {
      dispatchRedux(setGamesPlayed(state.gamesPlayed));
    }
    dispatchRedux(setCurrentTime(formatTime(time.currentTime)));
    dispatchRedux(setTimestampBatch(formatTime(time.timestampBatch)));
    // dispatchRedux(setGamesPlayed(state.gamesPlayed));
  };

  useEffect(() => {
    connectSocket();
    handleGameUpdate();
  }, []);

  return (
    <div className="App">
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
          <section className={styles.wrapper}>
            {roomId && (
              <section>
                <h2>
                  Your room ID: <span id="roomId">{roomId}</span>
                </h2>
                <SettingsForm
                  formValues={formValues}
                  handleChange={handleChange}
                  handleStartGame={handleStartGame}
                  isPlaying={isPlaying}
                />
              </section>
            )}
            {/* 
            {isPlaying && (
              <Button
                type="submit"
                onClick={handleEndGame}
                className="btn btn-primary"
                text="End Game"
              />
            )} */}
            {roomId && <UsersList handleRemove={handleRemove} users={users} />}
          </section>
        </div>
        <br />
        <hr />
        <Main isAdmin={true} />
      </main>
    </div>
  );
}

export default Admin;
