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
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (room) => room !== socket.id
    );

    if (
      socketRooms.length ||
      (connectedSockets && connectedSockets.size === 8)
    ) {
      socket.emit("room_join_error", {
        error: "Room is full, please use another room!",
      });
    } else {
      await socket.join(message.roomId);
      socket.data = message;

      const room = GameController.getRoomFromState(message.roomId);

      if (!room) {
        socket.emit("room_join_error", {
          error: "This room doesn't exist, please check your room name",
        });
      } else {
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
