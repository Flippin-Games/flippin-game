import React, { useContext, useState } from "react";
import gameContext from "../../gameContext";
import socketService from "../../services/socketService";
import gameService from "../../services/socketService/gameService";

interface IJoinRoomProps {}

function JoinRoom(props: IJoinRoomProps) {
  const [roomName, setRoomName] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const { setIsInRoom, isInRoom } = useContext(gameContext);

  const handleRoomNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setRoomName(value);
  };

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const socket = socketService.socket;
    if (!roomName || roomName.trim() === "" || !socket) return;

    setIsJoining(true);

    const joined = await gameService
      .joinGameRoom(socket, roomName)
      .catch((err) => alert(err));

    if (joined) {
      setIsInRoom(true);
    }

    setIsJoining(false);
  };

  return (
    <div>
      <form onSubmit={joinRoom}>
        <h2>Enter room id:</h2>
        <input
          placeholder="Room Id To Join Game"
          value={roomName}
          onChange={handleRoomNameChange}
        />
        <button type="submit" disabled={isJoining}>
          {isJoining ? "Joining..." : "Join"}
        </button>
      </form>
    </div>
  );
}

export default JoinRoom;