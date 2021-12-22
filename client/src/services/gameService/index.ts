import { Socket } from "socket.io-client";

class GameService {
  public async joinGameRoom(
    socket: Socket,
    roomId: string,
    username: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      socket.emit("join_game", { roomId, username });
      socket.on("room_joined", () => {
        resolve(true);
      });
      socket.on("room_join_error", ({ error }) => {
        reject(error);
      });
    });
  }

  public async updateGame(socket: Socket) {
    console.log("UPDATE GAME");
    socket.emit("update_game");
  }

  public async updateLocalCounter(socket: Socket, username: string) {
    socket.emit("update_local_counter", { username });
  }

  public async takeCoins(socket: Socket, from: string, to: string) {
    console.log(from, to);
    socket.emit("take_coins", { from, to });
  }

  // TODO fix any type
  public async onGameUpdate(socket: Socket, listener: (state: any) => void) {
    socket.on("on_game_update", (state) => {
      listener(state);
    });
    console.log("on game update");
  }

  // TODO admin stuff could be separate service
  public async createRoom(socket: Socket): Promise<string> {
    return new Promise((resolve, reject) => {
      socket.emit("create_room");
      socket.on("created_room", (id) => {
        resolve(id);
      });
      socket.on("room_join_error", ({ error }) => {
        reject(error);
      });
    });
  }

  public async startGame(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log(roomId);
      socket.emit("start_game", roomId);
      socket.on("game_started", () => {
        resolve(true);
        console.log("START GAME");
      });
      socket.on("game_start_error", ({ error }) => {
        reject(error);
      });
    });
  }
}

export default new GameService();
