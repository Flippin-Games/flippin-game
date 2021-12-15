import { Socket } from "socket.io-client";

class GameService {
  public async joinGameRoom(
    socket: Socket,
    roomId: string,
    username: string
  ): Promise<{ joined: boolean; users: []; counter: number }> {
    return new Promise((resolve, reject) => {
      socket.emit("join_game", { roomId, username });
      socket.on("room_joined", (name, users, counter) => {
        resolve({ joined: true, users, counter });
      });
      socket.on("room_join_error", ({ error }) => {
        reject(error);
      });
    });
  }

  public async updateGame(socket: Socket, counter: number) {
    console.log("UPDATE GAME");
    socket.emit("update_game", { counter });
  }

  public async onGameUpdate(
    socket: Socket,
    listener: (counter: number, users: []) => void
  ) {
    socket.on("on_game_update", (counter, users) => {
      listener(counter, users);
    });
    console.log("on game update");
  }

  public async createRoom(socket: Socket): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log("=== Emitting create_room ===");
      socket.emit("create_room");
      socket.on("created_room", (id) => {
        console.log(id);
        resolve(id);
      });
      socket.on("room_join_error", ({ error }) => {
        reject(error);
      });
    });
  }
}

export default new GameService();
