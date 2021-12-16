import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

interface IUser {
  username: string;
  localCounter: number;
}

export interface Iroom {
  id: string;
  users: IUser[];
  counter?: number;
}

interface IGameState {
  rooms: Iroom[];
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
  static getCounter(roomId: string): number {
    const room = GameController.getRoomFromState(roomId);

    return room.counter;
  }

  // public addUser(roomId) { }
  static removeUser(roomId: string, username: string): void {
    const room = GameController.getRoomFromState(roomId);

    room.users = room.users.filter((user) => user.username !== username);
  }

  public updateCounter(roomId, value) {
    const room = GameController.getRoomFromState(roomId);

    room.counter = value;
    return room.counter;
  }

  @OnMessage("update_game")
  public async updateGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const gameRoom = this.getSocketGameRoom(socket);
    const usersInRoom = await GameController.getUsers(gameRoom);
    const counter = this.updateCounter(gameRoom, message.counter);

    socket.to(gameRoom).emit("on_game_update", counter, usersInRoom);
  }

  @OnMessage("update_local_counter")
  public async updateLocalCounter(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const gameRoom = this.getSocketGameRoom(socket);
    const user = GameController.getUsers(gameRoom).find(
      (user) => user.username === message.username
    );
    user.localCounter = message.counter;
    console.log(user, message);
    console.log(GameController.gameState[0].users);

    // TODO: emit event that sends room
    // Change front to accept whole room as context
    // move checking if it's above 20 to server side = all users need to see others changes on their screens
    // socket.to(gameRoom).emit("on_game_update", counter, usersInRoom);
  }
}
