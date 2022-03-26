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

  public async updateLocalCounter(socket: Socket, username: string) {
    console.log("Emit: update local counter");
    socket.emit("update_local_counter", { username });
  }

  public async takeCoins(socket: Socket, from: string, to: string) {
    socket.emit("take_coins", { from, to });
  }

  public async onGameUpdate(
    socket: Socket,
    listener: (state: Function) => void
  ) {
    socket.on("on_game_update", (state) => {
      listener(state);
    });
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

  public async startGame(
    socket: Socket,
    roomId: string,
    settings: any
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      socket.emit("start_game", { roomId, settings });
      socket.on("game_isPlaying", () => {
        resolve(true);
      });
      socket.on("game_start_error", ({ error }) => {
        reject(error);
      });
    });
  }

  public async resetGame(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      socket.emit("reset_game", { roomId });
      socket.on("game_reset", () => {
        resolve(true);
      });
      // socket.on("game_start_error", ({ error }) => {
      //   reject(error);
      // });
    });
  }

  public async removeUser(
    socket: Socket,
    roomId: string,
    username: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      socket.emit("remove_user", { roomId, username });
      socket.on("user_removed", () => {
        resolve(true);
      });
      socket.on("remove_user_error", ({ error }) => {
        reject(error);
      });
    });
  }
}

export default new GameService();
