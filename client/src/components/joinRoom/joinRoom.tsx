import React, { useContext, useState } from "react";
import gameContext from "../../gameContext";
import socketService from "../../services/socketService";
import gameService from "../../services/gameService";

// TODO: display feedback that something is wrong with form

function JoinRoom() {
  const [roomName, setRoomName] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const { setIsInRoom, username, setUsername } = useContext(gameContext);

  const handleRoomNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;

    setRoomName(value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;

    setUsername(value);
  };

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const socket = socketService.socket;

    if (!socket) return;

    if (!roomName || roomName.trim() === "") {
      alert("Please provide required fields.");
      return;
    }

    setIsJoining(true);

    const joined = await gameService
      .joinGameRoom(socket, roomName, username)
      .catch((err) => alert(err));

    if (joined) {
      setIsInRoom(true);
    }

    setIsJoining(false);
  };

  return (
    <form onSubmit={joinRoom}>
      <div className="formItem">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div className="formItem">
        <label htmlFor="room">Room ID</label>
        <input
          id="room"
          placeholder="Room Id To Join Game"
          value={roomName}
          onChange={handleRoomNameChange}
        />
      </div>
      <button type="submit" disabled={isJoining} className="btn btn-primary">
        {isJoining ? "Joining..." : "Join"}
      </button>
    </form>
  );
}

export default JoinRoom;
