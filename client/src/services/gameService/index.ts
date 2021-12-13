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

  public async updateGame(socket: Socket, counterValue: number) {
    socket.emit("update_game", { counterValue });
  }

  public async onGameUpdate(
    socket: Socket,
    listener: (counterValue: number) => void
  ) {
    socket.on("on_game_update", ({ counterValue }) => listener(counterValue));
    console.log("on game update");
  }
}

export default new GameService();
