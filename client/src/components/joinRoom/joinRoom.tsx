import { useContext, useState } from "react";

import gameContext from "../../gameContext";
import socketService from "../../services/socketService";
import gameService from "../../services/gameService";

import Form from "../form/form";
import FormField from "../form/formField/formField";
import Button from "../button/button";

import styles from "./joinRoom.module.scss";

const initialFormState = {
  name: "",
  room: "",
};

function JoinRoom() {
  const [formValues, setFormValues] = useState(initialFormState);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  const { dispatch } = useContext(gameContext);

  // TODO
  const handleChange = (e: any) => {
    console.log("first");
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const socket = socketService.socket;

    if (!socket) return;

    console.log("asdasda");

    if (!formValues.room || formValues.room.trim() === "") {
      alert("Please provide required fields.");
      return;
    }

    setIsJoining(true);

    const joined = await gameService
      .joinGameRoom(socket, formValues.room, formValues.name)
      .catch((err) => setError(err));

    if (joined) {
      dispatch({
        type: "username",
        data: formValues.name,
      });
      dispatch({
        type: "isInRoom",
        data: true,
      });
    }

    setIsJoining(false);
  };

  return (
    <section className={styles.wrapper}>
      <Form onSubmit={joinRoom} errorMessage={error}>
        <FormField
          id="name"
          placeholder="Username"
          value={formValues.name}
          onChange={handleChange}
          type="text"
          label="Name"
          required={true}
        />
        <FormField
          id="room"
          placeholder="Room Id To Join Game"
          value={formValues.room}
          onChange={handleChange}
          type="text"
          label="Room ID"
          required={true}
        />
        <Button
          type="submit"
          disabled={isJoining}
          className="btn-primary"
          text={isJoining ? "Joining..." : "Join"}
        />
      </Form>
    </section>
  );
}

export default JoinRoom;
