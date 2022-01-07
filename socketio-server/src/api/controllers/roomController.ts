import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import { GameController } from "./gameController";

// TODO:
// - add validation for name - avoid same user n ames
// - sanitize inputs

@SocketController()
export class RoomController {
  @OnMessage("join_game")
  public async joinGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    // TODO: util?
    const emitError = (error) => {
      socket.emit("room_join_error", {
        error,
      });
    };

    if (!message.roomId) {
      emitError("Please provide required fields");

      return;
    }

    const room = GameController.getRoomFromState(message.roomId);

    if (!room) {
      emitError("Sorry, this room doesn't exist, please check your room id.");

      return;
    }

    if (room.users.length === 4) {
      emitError("Room is full, please use another room!");

      return;
    }

    if (message.username.length === 0) {
      emitError("Please provide username.");

      return;
    }

    const isUniqueUsername =
      room.users.filter((user) => user.username === message.username).length ===
      0;

    if (!isUniqueUsername) {
      emitError(
        "Sorry, this username is already taken in this room. Change username and try again."
      );
      return;
    }

    await socket.join(message.roomId);
    socket.data = message;
    room.users.push({
      username: message.username,
      localCounter: 0,
      flipped: 0,
    });

    socket.emit("room_joined");

    GameController.emitUpateGame(io, message.roomId);
    console.log(
      "New User " + message.username + " joining room:",
      message.roomId
    );
  }
}
