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

  // TODO create getter for game state

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

    console.log("== UPDATE LOCAL COUNTER ==");

    // Start timer if it's first flip -> TODO: each comment could be separate func?
    if (
      currentUserIndex === 0 &&
      roomFromState.started &&
      user.localCounter === roomFromState.settings.startAmount
    ) {
      roomFromState.time.startTimer(io);
    }

    // flip
    if (user.localCounter > 0) {
      user.localCounter = user.localCounter - 1;
      user.flipped = user.flipped + 1;
    }

    // If automove coins is on, move coins
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

    // timestampBatch
    if (
      currentUserIndex + 1 === roomFromState.users.length &&
      user.flipped === roomFromState.settings.batchSize
    ) {
      roomFromState.time.setTimestamp();
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
