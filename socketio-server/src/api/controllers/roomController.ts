import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import { GameController, Iroom } from "./gameController";

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
        const room: Iroom = {
          id: message.roomId,
          users: [message.username],
        };

        GameController.gameState.rooms.push(room);
      } else {
        room.users.push(message.username);
      }

      const users = GameController.getUsers(message.roomId);
      const counter = GameController.getCounter(message.roomId);

      socket.emit(
        "room_joined",
        message.username,
        users, // TODO: do I need to pass it here?
        counter // TODO: do I need to pass it here?
      );
      console.log(
        "New User " + message.username + " joining room:",
        message.roomId
      );
    }
  }
}
