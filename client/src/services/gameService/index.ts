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

  // TODO fix any type
  public async onGameUpdate(socket: Socket, listener: (state: any) => void) {
    socket.on("on_game_update", (state) => {
      listener(state);
    });
    console.log("on game update");
  }

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
}

export default new GameService();
