import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import Room from "../../modules/room";

// TODO move interface to separate files
interface IUser {
  username: string;
  localCounter: number;
  flipped: number;
}

interface IGameState {
  rooms: Room[];
}
@SocketController()
export class GameController {
  static gameState: IGameState = { rooms: [] };

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

  static getUsers(roomId: string) {
    const room = GameController.getRoomFromState(roomId);

    return room.users;
  }

  static getUser(roomId: string, username: string) {
    const user = GameController.getUsers(roomId).find(
      (user) => user.username === username
    );

    return user;
  }

  static getCounter(roomId: string): number {
    const room = GameController.getRoomFromState(roomId);

    return room.counter;
  }

  static removeUser(roomId: string, username: string): void {
    const room = GameController.getRoomFromState(roomId);

    room.users = room.users.filter((user) => user.username !== username);
  }

  static stopTimer = (roomId: string): void => {
    const room = GameController.getRoomFromState(roomId);

    if (room.timer) {
      console.log("STOPPING TIME AT ", room.time);
      room.clearInterval();
    }
  };

  static emitUpateGame(@SocketIO() io: Server, gameRoom: string): void {
    console.log("EMIT UPDATE GAME");
    io.to(gameRoom).emit(
      "on_game_update",
      GameController.getRoomFromState(gameRoom)
    );
  }

  public updateCounter(roomId: string): number {
    const room = GameController.getRoomFromState(roomId);

    room.counter = room.counter + 1;
    return room.counter;
  }

  static didGameEnd(roomId: string): boolean {
    const room = GameController.getRoomFromState(roomId);
    const lastUser = room.users[room.users.length - 1];

    return lastUser.flipped === room.settings.startAmount;
  }

  // TODO should this be async?
  public updateCoinsTaken(roomId, from, to): void {
    // TODO error handle and checks

    const room = GameController.getRoomFromState(roomId);
    const userToTakeFrom = GameController.getUser(roomId, from);
    const userToGiveTo = GameController.getUser(roomId, to);

    userToTakeFrom.flipped = userToTakeFrom.flipped - room.settings.batchSize;
    userToGiveTo.localCounter =
      userToGiveTo.localCounter + room.settings.batchSize;
  }

  @OnMessage("update_local_counter")
  public async updateLocalCounter(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const gameRoom = this.getSocketGameRoom(socket);
    const user = GameController.getUser(gameRoom, message.username);
    const roomFromState = GameController.getRoomFromState(gameRoom);
    const currentUserIndex = roomFromState.users.findIndex(
      (user) => user.username === message.username
    );

    if (currentUserIndex === 0 && roomFromState.started) {
      roomFromState.startTimer(io);
    }

    if (user.localCounter > 0) {
      user.localCounter = user.localCounter - 1;
      user.flipped = user.flipped + 1;
    }

    // TODO create getter for game state
    if (
      user.flipped >= roomFromState.settings.batchSize &&
      roomFromState.settings.autoMoveCoins
    ) {
      // get next user
      const nextUser = roomFromState.users[currentUserIndex + 1];
      if (nextUser) {
        this.updateCoinsTaken(gameRoom, message.username, nextUser.username);
      }
    }

    GameController.emitUpateGame(io, gameRoom);
  }

  @OnMessage("take_coins")
  public async takeCoins(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const gameRoom = this.getSocketGameRoom(socket);
    this.updateCoinsTaken(gameRoom, message.from, message.to);

    GameController.emitUpateGame(io, gameRoom);
  }
}
