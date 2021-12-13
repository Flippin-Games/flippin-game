import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

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

      // TODO: this doesn't seem like the best solution, but it's from docs
      // https://socket.io/docs/v4/server-socket-instance/#socketdata
      const sockets = await io.fetchSockets();
      const usersInRoom = Array.from(sockets)
        .filter((client) => client.data.roomId === message.roomId)
        .map((client) => client.data.username);

      socket.emit("room_joined", message.username, usersInRoom);
      console.log(
        "New User " + message.username + " joining room:",
        message.roomId
      );

      // const users = [];
      // for (let [id, socket] of sockets) {
      //   users.push({
      //     userID: id,
      //     username: socket.data.username,
      //   });
      // }
      // socket.emit("users", users);
    }
  }
}
