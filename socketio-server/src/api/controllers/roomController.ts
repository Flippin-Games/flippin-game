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
    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
    // const socketRooms = Array.from(socket.rooms.values()).filter(
    //   (room) => room !== socket.id
    // );

    // console.log(`Socket rooms: ${socketRooms.length},
    // connected sockets: ${connectedSockets && connectedSockets.size === 8}`);

    if (connectedSockets && connectedSockets.size === 3) {
      console.log("error");
      socket.emit("room_join_error", {
        error: "Room is full, please use another room!",
      });
    } else {
      await socket.join(message.roomId);
      socket.data = message;

      const room = GameController.getRoomFromState(message.roomId);

      // check if username is unique
      const isUniqueUsername =
        room.users.filter((user) => user.username === message.username)
          .length === 0;

      if (!isUniqueUsername) {
        socket.emit("room_join_error", {
          error:
            "Sorry, this username is already taken in this room. Change username and try again.",
        });
        return;
      } else if (!room) {
        socket.emit("room_join_error", {
          error: "Sorry, this room doesn't exist, please check your room name.",
        });
        return;
      } else {
        console.log("PUSHING NEW USER");
        room.users.push({
          username: message.username,
          localCounter: 0,
          flipped: 0,
        });
      }

      socket.emit("room_joined");

      GameController.emitUpateGame(io, message.roomId);
      console.log(
        "New User " + message.username + " joining room:",
        message.roomId
      );
    }
  }
}
