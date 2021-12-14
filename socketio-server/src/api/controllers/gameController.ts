import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class GameController {
  private getSocketGameRoom(socket: Socket): string {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (room) => room !== socket.id
    );

    // TODO: if not connected cancel action - could it be just replaces with broadcast?

    const gameRoom = socketRooms && socketRooms[0];
    return gameRoom;
  }

  public async getUsers(@SocketIO() io: Server, roomId: string) {
    // TODO: this doesn't seem like the best solution, but it's from docs
    // https://socket.io/docs/v4/server-socket-instance/#socketdata
    const sockets = await io.fetchSockets();
    const usersInRoom = Array.from(sockets)
      .filter((client) => client.data.roomId === roomId)
      .map((client) => client.data.username);

    return usersInRoom;
  }

  @OnMessage("update_game")
  public async updateGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const gameRoom = this.getSocketGameRoom(socket);
    const usersInRoom = await this.getUsers(io, gameRoom);
    console.log(usersInRoom);
    socket.to(gameRoom).emit("on_game_update", message, usersInRoom);
    console.log("update game: ", message);
  }
}
