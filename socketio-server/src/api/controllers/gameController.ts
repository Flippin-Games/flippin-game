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

  // are users before me playing
  static updateUsers(roomId: string) {
    const room = GameController.getRoomFromState(roomId);

    // stop timers if all users left
    if (room.getIsEmpty()) {
      room.resetTimeInRoom();
      return;
    }

    room.users.map((user) => {
      const userIndex = room.getUserIndex(user.username);
      const usersBeforeMe = room.users.slice(0, userIndex);
      const areUsersBeforeMeFlipping =
        usersBeforeMe.filter(
          (usr: any) => usr.localCounter > 0 || usr.flipped > 0
        ).length > 0;
      user.setAreUsersBeforeMeFlipping(areUsersBeforeMeFlipping);
    });
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
    const lastUser = room.getUserByIndex(room.users.length - 1);

    if (lastUser && lastUser.flipped === room.settings.startAmount) {
      room.updateGamesPlayed();
      return true;
    }

    return false;
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
    const { batchSize, autoMoveCoins, startAmount } = room.settings.get();
    const { isPlaying, users } = room;

    const nextIndex = currentUserIndex + 1;
    const isFirst = currentUserIndex === 0;
    const hasMaxCoins = user.getLocalCounter() === startAmount;

    console.log("== UPDATE LOCAL COUNTER ==");

    if (isFirst && isPlaying && hasMaxCoins) {
      room.time.startTimer(io);
    }

    user.flip();

    const flipped = user.getFlipped();

    // If automove coins is on, move coins
    if (flipped >= batchSize && autoMoveCoins) {
      const nextUser = users[nextIndex];
      if (nextUser) {
        room.updateCoinsTaken(message.username, nextUser.username);
      }
    }

    // timestampBatch
    if (nextIndex === users.length && flipped === batchSize) {
      room.time.setTimestampBatch();
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
