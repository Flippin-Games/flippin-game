import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import { GameController, Iroom } from "./gameController";

@SocketController()
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
      counter: 0,
      settings: { batchSize: 20, autoMoveCoins: true },
    };
    await socket.join(room.id);
    GameController.gameState.rooms.push(room);
    socket.emit("created_room", room.id);
  }

  @OnMessage("start_game")
  public async startGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
    // @MessageBody() settings: any
  ) {
    console.log("Game started! in room: ", message.roomId);

    const room = GameController.getRoomFromState(message.roomId);

    if (room.users.length > 1) {
      room.settings = message.settings;
      room.users[0].localCounter = message.settings.batchSize || 20;
      room.started = true;
      socket.emit("game_started");
      GameController.emitUpateGame(io, message.roomId);
    } else {
      socket.emit("game_start_error", {
        error: "Not enough players to start the game",
      });
    }
  }

  @OnMessage("remove_user")
  public async removeUser(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    GameController.removeUser(message.roomId, message.username);
    GameController.emitUpateGame(io, message.roomId);
  }
}
