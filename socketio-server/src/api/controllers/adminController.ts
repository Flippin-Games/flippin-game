import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import { GameController, Iroom } from "./gameController";

@SocketController("/admin")
export class AdminController {
  @OnMessage("create_room")
  public async createRoom(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket
  ) {
    // TODO: move to utils
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    // TODO check if toom already exists, move logic from join_room ?
    const roomId = getRandomInt(1000, 9999);
    const room: Iroom = {
      id: roomId.toString(),
      users: [],
    };
    await socket.join(room.id);
    GameController.gameState.rooms.push(room);
    console.log(GameController.gameState.rooms);
    socket.emit("created_room", room.id);
  }
}
