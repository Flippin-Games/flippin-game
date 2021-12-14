import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import { GameController } from "./gameController";

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

      // TODO:
      const users = await new GameController().getUsers(io, message.roomId);

      socket.emit("room_joined", message.username, users);
      console.log(
        "New User " + message.username + " joining room:",
        message.roomId
      );
    }
  }
}
