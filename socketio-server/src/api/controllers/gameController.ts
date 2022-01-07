import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import Room from "../../modules/room";

interface IGameState {
  rooms: Room[];
}
@SocketController()
export class GameController {
  static gameState: IGameState = { rooms: [] };

  // Use when don't know room ID
  private getSocketGameRoom(socket: Socket): string {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (room) => room !== socket.id
    );

    const gameRoom = socketRooms && socketRooms[0];
    return gameRoom;
  }

  static getRoomFromState(roomId: string) {
    const room = GameController.gameState.rooms.find((r) => {
      return r.id === roomId;
    });

    return room;
  }

  static emitUpateGame(@SocketIO() io: Server, roomId: string): void {
    console.log("=== EMIT UPDATE GAME ===");

    io.to(roomId).emit(
      "on_game_update",
      GameController.getRoomFromState(roomId)
    );
  }

  static didGameEnd(roomId: string): boolean {
    const room = GameController.getRoomFromState(roomId);
    const lastUser = room.users[room.users.length - 1];

    return lastUser.flipped === room.settings.startAmount;
  }

  static addRoom(room: Room) {
    GameController.gameState.rooms.push(room);
  }

  @OnMessage("update_local_counter")
  public async updateLocalCounter(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const roomId = this.getSocketGameRoom(socket);
    const room = GameController.getRoomFromState(roomId);
    const user = room.getUser(message.username);
    const currentUserIndex = room.getUserIndex(message.username);

    console.log("== UPDATE LOCAL COUNTER ==");

    // Start timer if it's first flip -> TODO: each comment could be separate func?
    if (
      currentUserIndex === 0 &&
      room.started &&
      user.localCounter === room.settings.startAmount
    ) {
      room.time.startTimer(io);
    }

    // flip
    if (user.localCounter > 0) {
      user.localCounter = user.localCounter - 1;
      user.flipped = user.flipped + 1;
    }

    // If automove coins is on, move coins
    if (
      user.flipped >= room.settings.batchSize &&
      room.settings.autoMoveCoins
    ) {
      // get next user
      const nextUser = room.users[currentUserIndex + 1];
      if (nextUser) {
        room.updateCoinsTaken(message.username, nextUser.username);
      }
    }

    // timestampBatch
    if (
      currentUserIndex + 1 === room.users.length &&
      user.flipped === room.settings.batchSize
    ) {
      room.time.setTimestamp();
    }

    GameController.emitUpateGame(io, roomId);
  }

  @OnMessage("take_coins")
  public async takeCoins(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const roomId = this.getSocketGameRoom(socket);
    const room = GameController.getRoomFromState(roomId);

    room.updateCoinsTaken(message.from, message.to);
    GameController.emitUpateGame(io, roomId);
  }
}
