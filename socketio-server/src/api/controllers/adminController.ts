import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import { GameController } from "./gameController";
import Room from "../../modules/room";

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
    const room = new Room(roomId.toString(), [], 0, {
      startAmount: 20,
      amountOfBatches: 5,
      autoMoveCoins: true,
    });
    await socket.join(room.id);
    GameController.gameState.rooms.push(room);
    socket.emit("created_room", room.id);
  }

  @OnMessage("start_game")
  public async startGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    console.log("Game started! in room: ", message.roomId);

    const room = GameController.getRoomFromState(message.roomId);

    if (room.users.length > 1) {
      room.settings = message.settings;
      room.settings.startAmount =
        message.settings.amountOfBatches * message.settings.batchSize;

      room.users[0].localCounter = room.settings.startAmount || 20;
      room.started = true;
      socket.emit("game_started");
      GameController.emitUpateGame(io, message.roomId);
      console.log(room.settings);
    } else {
      socket.emit("game_start_error", {
        error: "Not enough players to start the game",
      });
    }
  }

  @OnMessage("end_game")
  public async endGame(@MessageBody() message: any) {
    // console.log("Game ended! in room: ", message.roomId);

    console.log("THIS DOESNT WORK AT THE MOMENT");

    // GameController.stopTimer(message.roomId);
  }

  @OnMessage("remove_user")
  public async removeUser(@SocketIO() io: Server, @MessageBody() message: any) {
    GameController.removeUser(message.roomId, message.username);
    GameController.emitUpateGame(io, message.roomId);
  }
}
