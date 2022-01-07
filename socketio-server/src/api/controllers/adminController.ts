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
import { getRandomInt } from "../../utils/utils";

@SocketController()
export class AdminController {
  @OnMessage("create_room")
  public async createRoom(
    // @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket
  ) {
    // TODO this could be done better
    let roomId = getRandomInt(1000, 9999).toString();
    const alreadyExists = GameController.getRoomFromState(roomId);

    if (alreadyExists) {
      roomId = getRandomInt(1000, 9999).toString();
    }
    const room = new Room(roomId, [], 0);

    await socket.join(roomId);
    GameController.addRoom(room);
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
      const { settings } = message;

      room.settings.update(
        settings.autoMoveCoins,
        settings.amountOfBatches,
        settings.batchSize
      );
      room.setFirstUserCounter();
      room.setStarted(true);

      socket.emit("game_started");
      GameController.emitUpateGame(io, message.roomId);
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
    const room = GameController.getRoomFromState(message.roomId);

    room.removeUser(message.username);
    GameController.emitUpateGame(io, message.roomId);
  }
}
